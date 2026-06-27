import hashlib
import hmac

import frappe
from frappe import _
from frappe.model.workflow import apply_workflow
from frappe.utils import add_days, get_datetime, now_datetime


SIGNATURE_LINK_VALIDITY_DAYS = 7


def _token_hash(token):
	return hashlib.sha256((token or "").encode("utf-8")).hexdigest()


def _validate_token(doc, token):
	if not token or not doc.customer_signature_token_hash:
		return False
	if not hmac.compare_digest(
		_token_hash(token),
		doc.customer_signature_token_hash,
	):
		return False
	created_at = doc.customer_signature_token_created_at
	if not created_at:
		return False
	return now_datetime() <= add_days(get_datetime(created_at), SIGNATURE_LINK_VALIDITY_DAYS)

def get_context(context):
	frappe.flags.ignore_guest_to_route = True

	key = frappe.form_dict.get("key")
	token = frappe.form_dict.get("token")
	if not key or not token:
		context.error = "Nenhuma Ordem de Serviço especificada na URL."
		return

	if not frappe.db.exists("Repair Order", key):
		context.error = f"A Ordem de Serviço {key} não foi encontrada no sistema."
		return

	doc = frappe.get_doc("Repair Order", key)
	if not _validate_token(doc, token):
		context.error = "Este link de assinatura é inválido ou expirou. Solicite um novo link à TecPonto."
		return

	# Fetch device label
	brand = ""
	model = ""
	if doc.device:
		device_val = frappe.db.get_value("Service Device", doc.device, ["brand", "model"], as_dict=True)
		if device_val:
			brand = device_val.brand or ""
			model = device_val.model or ""

	device_label = f"{brand} {model}".strip() or doc.device

	# Get customer phone
	whatsapp = frappe.db.get_value("TecPonto Contact Preference", doc.customer, "whatsapp_number") or ""

	context.doc = doc
	context.device_label = device_label
	context.whatsapp = whatsapp
	context.signature_token = token
	context.error = None


@frappe.whitelist()
def generate_signature_link(repair_order):
	roles = set(frappe.get_roles())
	if (
		frappe.session.user != "Administrator"
		and not roles.intersection(
			{"TecPonto Atendente", "TecPonto Gestor", "TecPonto Direcao"}
		)
	):
		frappe.throw(_("Seu perfil não pode gerar links de assinatura."), frappe.PermissionError)
	doc = frappe.get_doc("Repair Order", repair_order)
	doc.check_permission("write")
	token = frappe.generate_hash(length=32)
	created_at = now_datetime()
	doc.db_set("customer_signature_token_hash", _token_hash(token), update_modified=False)
	doc.db_set("customer_signature_token_created_at", created_at, update_modified=False)
	frappe.db.commit()
	return {
		"repair_order": doc.name,
		"path": f"/os_aceite?key={doc.name}&token={token}",
		"expires_at": add_days(created_at, SIGNATURE_LINK_VALIDITY_DAYS),
	}


@frappe.whitelist(allow_guest=True)
def submit_signature(repair_order, whatsapp_number, token):
	if not repair_order or not whatsapp_number or not token:
		frappe.throw(_("Por favor, preencha todos os campos obrigatórios."))

	if not frappe.db.exists("Repair Order", repair_order):
		frappe.throw(_("Ordem de Serviço não encontrada."))

	doc = frappe.get_doc("Repair Order", repair_order)
	if not _validate_token(doc, token):
		frappe.throw(_("O link de assinatura é inválido ou expirou. Solicite um novo link."))

	# Validate owner phone
	stored_whatsapp = frappe.db.get_value("TecPonto Contact Preference", doc.customer, "whatsapp_number") or ""
	norm_input = "".join(c for c in whatsapp_number if c.isdigit())
	norm_stored = "".join(c for c in stored_whatsapp if c.isdigit())

	if not norm_input or not norm_stored or not norm_stored.endswith(norm_input[-8:]):
		frappe.throw(_("Número de WhatsApp incorreto para esta Ordem de Serviço."))

	# Capture audit data
	ip = getattr(frappe.local, "request_ip", None) or "127.0.0.1"
	request = getattr(frappe.local, "request", None)
	ua = request.headers.get("User-Agent", "") if request else "TecPonto internal validation"
	timestamp = now_datetime()

	# Generate signature integrity hash
	hash_payload = f"{doc.name}-{norm_stored}-{ip}-{timestamp}"
	signature_hash = hashlib.sha256(hash_payload.encode('utf-8')).hexdigest()

	# Save details
	doc.db_set("customer_signature_ip", ip)
	doc.db_set("customer_signature_at", timestamp)
	doc.db_set("customer_signature_hash", signature_hash)
	doc.db_set("customer_signature_ua", ua)

	doc.db_set("approval_status", "Aprovado")
	doc.db_set("approval_method", "WhatsApp")
	doc.db_set("approval_reference", f"Assinatura Digital IP: {ip}")
	doc.db_set("approval_at", timestamp)

	# O aceite aprova o orçamento, mas não inicia o reparo automaticamente.
	if doc.workflow_state == "Aguardando aprovacao":
		doc = apply_workflow(doc, "Aprovar orcamento")

	frappe.db.commit()
	return {"status": "success", "message": "Termos de serviço assinados digitalmente com sucesso."}
