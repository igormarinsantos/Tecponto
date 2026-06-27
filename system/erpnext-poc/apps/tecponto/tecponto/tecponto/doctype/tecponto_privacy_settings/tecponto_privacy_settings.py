import frappe
from frappe import _
from frappe.model.document import Document


class TecPontoPrivacySettings(Document):
	def validate(self):
		if not self.enforce_private_sensitive_files:
			frappe.throw(_("A proteção de anexos sensíveis não pode ser desativada."))
		if not self.direction_mfa_required:
			frappe.throw(_("MFA da direção é um requisito obrigatório para produção."))
		if self.automatic_deletion_enabled:
			frappe.throw(
				_("A exclusão automática permanece bloqueada. Revise os candidatos antes de qualquer descarte.")
			)
		for fieldname in (
			"photo_retention_days",
			"event_payload_retention_days",
			"inactive_customer_review_days",
		):
			if int(self.get(fieldname) or 0) < 30:
				frappe.throw(_("Os prazos de revisão devem ter pelo menos 30 dias."))
