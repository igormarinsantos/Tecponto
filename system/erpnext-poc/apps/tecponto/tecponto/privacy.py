import json

import frappe
from frappe import _
from frappe.utils import add_days, now_datetime


SENSITIVE_DOCTYPES = (
	"Service Device",
	"Repair Order",
	"Trade In Evaluation",
	"TecPonto Contact Preference",
)


def _require_direction():
	if frappe.session.user != "Administrator" and "TecPonto Direcao" not in frappe.get_roles():
		frappe.throw(_("Somente a direção pode executar a auditoria de privacidade."), frappe.PermissionError)


def enforce_private_attachment(doc, method=None):
	"""Impede que fotos e documentos operacionais sensíveis sejam gravados como públicos."""
	if doc.attached_to_doctype not in SENSITIVE_DOCTYPES:
		return
	settings = frappe.get_single("TecPonto Privacy Settings")
	if settings.enforce_private_sensitive_files and not doc.is_private:
		doc.is_private = 1
		doc.save(ignore_permissions=True)


def _count(doctype, filters):
	return frappe.db.count(doctype, filters=filters)


@frappe.whitelist()
def get_privacy_audit(persist=True):
	"""Retorna riscos e candidatos de retenção sem excluir ou anonimizar registros."""
	_require_direction()
	settings = frappe.get_single("TecPonto Privacy Settings")
	now = now_datetime()
	public_sensitive_files = _count(
		"File",
		{
			"is_private": 0,
			"attached_to_doctype": ["in", SENSITIVE_DOCTYPES],
		},
	)
	old_events = _count(
		"TecPonto Automation Event",
		{"creation": ["<", add_days(now, -int(settings.event_payload_retention_days))]},
	)
	old_customers = _count(
		"Customer",
		{"modified": ["<", add_days(now, -int(settings.inactive_customer_review_days))]},
	)
	old_sensitive_files = _count(
		"File",
		{
			"attached_to_doctype": ["in", SENSITIVE_DOCTYPES],
			"creation": ["<", add_days(now, -int(settings.photo_retention_days))],
		},
	)
	pilot_accounts = _count(
		"User",
		{"enabled": 1, "email": ["like", "%@tecponto.local"]},
	)

	issues = []
	if public_sensitive_files:
		issues.append(f"{public_sensitive_files} anexo(s) sensível(is) público(s)")
	if pilot_accounts:
		issues.append(f"{pilot_accounts} conta(s) demonstrativa(s) devem ser substituídas antes da produção")
	if settings.direction_mfa_required:
		issues.append("MFA das contas reais precisa ser comprovado no ambiente de produção")

	result = {
		"status": "Atenção" if issues else "Conforme",
		"production_ready": not issues,
		"public_sensitive_files": public_sensitive_files,
		"retention_candidates": {
			"automation_events": old_events,
			"customers": old_customers,
			"sensitive_files": old_sensitive_files,
		},
		"pilot_accounts": pilot_accounts,
		"automatic_deletion": False,
		"issues": issues,
		"audited_at": str(now),
	}
	if frappe.parse_json(persist):
		frappe.db.set_single_value("TecPonto Privacy Settings", "last_audit_at", now)
		frappe.db.set_single_value("TecPonto Privacy Settings", "last_audit_status", result["status"])
		frappe.db.set_single_value(
			"TecPonto Privacy Settings",
			"last_audit_summary",
			json.dumps(result, ensure_ascii=False, indent=2),
		)
		frappe.db.commit()
	return result


def run_scheduled_audit():
	"""Registra o diagnóstico diário com contexto administrativo, sem descarte automático."""
	previous_user = frappe.session.user
	try:
		frappe.set_user("Administrator")
		return get_privacy_audit(persist=True)
	finally:
		frappe.set_user(previous_user)
