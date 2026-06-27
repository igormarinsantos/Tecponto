import hashlib
import hmac
import json
from urllib.parse import urlparse

import frappe
import requests
from frappe import _
from frappe.utils import cint, now_datetime


REPAIR_EVENTS = {
	"Recebido": ("repair_received", "Aparelho recebido", "repair_received"),
	"Aguardando aprovacao": (
		"repair_quote_ready",
		"Orçamento pronto para aprovação",
		"repair_quote_ready",
	),
	"Pronto para retirada": (
		"repair_ready",
		"Aparelho pronto para retirada",
		"repair_ready",
	),
	"Entregue": (
		"repair_delivered",
		"Aparelho entregue e garantia iniciada",
		"repair_delivered",
	),
}

TRADE_EVENTS = {
	"Triagem de troca": (
		"trade_received",
		"Avaliação de troca recebida",
		"trade_received",
	),
	"Oferta apresentada": (
		"trade_offer_ready",
		"Oferta de troca apresentada",
		"trade_offer_ready",
	),
}


def _settings():
	return frappe.get_single("TecPonto Integration Settings")


def _can_manage_integrations():
	return (
		frappe.session.user == "Administrator"
		or "System Manager" in frappe.get_roles()
		or "TecPonto Direcao" in frappe.get_roles()
	)


def _normalized_payload(doc, category, event_key, event_label, idempotency_key, preference=None):
	return {
		"version": 1,
		"category": category.lower(),
		"event": event_key,
		"event_label": event_label,
		"idempotency_key": idempotency_key,
		"occurred_at": str(now_datetime()),
		"record": {
			"doctype": doc.doctype,
			"name": doc.name,
			"workflow_state": doc.workflow_state,
			"service_type": doc.get("service_type"),
		},
		"customer": {
			"id": doc.customer,
			"name": doc.customer_name,
		},
		"device": doc.device,
		"communication": {
			"whatsapp_number": preference.whatsapp_number if preference else None,
			"operational_authorized": bool(preference and preference.operational_messages),
		},
	}


def _record(doc, category, event_definition):
	event_key, event_label, setting_field = event_definition
	settings = _settings()
	idempotency_key = hashlib.sha256(
		f"{doc.doctype}:{doc.name}:{event_key}:{doc.modified}".encode("utf-8")
	).hexdigest()
	existing = frappe.db.get_value(
		"TecPonto Automation Event", {"idempotency_key": idempotency_key}, "name"
	)
	if existing:
		return existing
	preference = frappe.db.get_value(
		"TecPonto Contact Preference",
		{"customer": doc.customer},
		["whatsapp_number", "operational_messages"],
		as_dict=True,
	)
	event_enabled = bool(cint(settings.get(setting_field)))
	should_dispatch = bool(
		event_enabled
		and preference
		and preference.operational_messages
		and cint(settings.enabled)
		and settings.outbound_url
	)
	payload = _normalized_payload(
		doc, category, event_key, event_label, idempotency_key, preference
	)

	event = frappe.get_doc(
		{
			"doctype": "TecPonto Automation Event",
			"category": category,
			"idempotency_key": idempotency_key,
			"event_key": event_key,
			"event_label": event_label,
			"status": "Na fila" if should_dispatch else (
				"Registrado" if event_enabled else "Desativado"
			),
			"workflow_state": doc.workflow_state,
			"reference_doctype": doc.doctype,
			"reference_name": doc.name,
			"customer": doc.customer,
			"payload": json.dumps(payload, ensure_ascii=False, indent=2),
		}
	).insert(ignore_permissions=True)

	if should_dispatch:
		frappe.enqueue(
			"tecponto.integrations.dispatch_event",
			event_name=event.name,
			queue="short",
			enqueue_after_commit=True,
		)

	return event.name


def capture_repair_created(doc, method=None):
	return _record(doc, "Reparo", REPAIR_EVENTS["Recebido"])


def capture_repair_state(doc, method=None):
	if not doc.has_value_changed("workflow_state"):
		return
	event = REPAIR_EVENTS.get(doc.workflow_state)
	if event:
		_record(doc, "Reparo", event)


def capture_trade_created(doc, method=None):
	return _record(doc, "Troca", TRADE_EVENTS["Triagem de troca"])


def capture_trade_state(doc, method=None):
	if not doc.has_value_changed("workflow_state"):
		return
	event = TRADE_EVENTS.get(doc.workflow_state)
	if event:
		_record(doc, "Troca", event)


def _validate_destination(url):
	parsed = urlparse(url)
	if parsed.scheme == "https":
		return
	if parsed.scheme == "http" and parsed.hostname in {"localhost", "127.0.0.1", "::1"}:
		return
	frappe.throw(_("A URL do webhook deve usar HTTPS em produção."))


def dispatch_event(event_name):
	event = frappe.get_doc("TecPonto Automation Event", event_name)
	settings = _settings()
	if not cint(settings.enabled) or not settings.outbound_url:
		event.db_set("status", "Registrado")
		return

	_validate_destination(settings.outbound_url)
	payload_text = event.payload or "{}"
	secret = settings.get_password("webhook_secret") or ""
	signature = hmac.new(
		secret.encode("utf-8"),
		payload_text.encode("utf-8"),
		hashlib.sha256,
	).hexdigest()
	headers = {
		"Content-Type": "application/json",
		"X-TecPonto-Event": event.event_key,
		"X-TecPonto-Signature": f"sha256={signature}",
	}

	frappe.db.set_value(
		event.doctype,
		event.name,
		{
			"attempts": cint(event.attempts) + 1,
			"last_attempt": now_datetime(),
		},
	)
	try:
		response = requests.post(
			settings.outbound_url,
			data=payload_text.encode("utf-8"),
			headers=headers,
			timeout=max(1, cint(settings.timeout_seconds or 10)),
		)
		response.raise_for_status()
		frappe.db.set_value(
			event.doctype,
			event.name,
			{
				"status": "Enviado",
				"response_code": response.status_code,
				"response_body": response.text[:1000],
				"error": None,
			},
		)
	except Exception as exc:
		frappe.db.set_value(
			event.doctype,
			event.name,
			{
				"status": "Falhou",
				"response_code": getattr(getattr(exc, "response", None), "status_code", None),
				"response_body": getattr(getattr(exc, "response", None), "text", "")[:1000],
				"error": str(exc)[:1000],
			},
		)
		frappe.log_error(
			title=f"Falha no webhook TecPonto: {event.name}",
			message=frappe.get_traceback(),
		)
		return {"status": "Falhou", "error": str(exc)}


def retry_failed_events():
	settings = _settings()
	if not cint(settings.enabled) or not settings.outbound_url:
		return
	max_attempts = max(1, cint(settings.max_attempts or 3))
	events = frappe.get_all(
		"TecPonto Automation Event",
		filters={"status": "Falhou", "attempts": ["<", max_attempts]},
		pluck="name",
		limit_page_length=50,
	)
	for event_name in events:
		frappe.db.set_value(
			"TecPonto Automation Event", event_name, "status", "Na fila"
		)
		frappe.enqueue(
			"tecponto.integrations.dispatch_event",
			event_name=event_name,
			queue="short",
			enqueue_after_commit=True,
		)


@frappe.whitelist()
def get_capabilities():
	if not _can_manage_integrations():
		frappe.throw(
			_("Somente a direção pode consultar as integrações."),
			frappe.PermissionError,
		)
	settings = _settings()
	return {
		"rest_api": True,
		"token_authentication": True,
		"native_webhooks": True,
		"normalized_event_webhook": True,
		"outbound_enabled": bool(cint(settings.enabled)),
		"provider": settings.provider,
		"supported_events": {
			"repair": [value[0] for value in REPAIR_EVENTS.values()],
			"trade": [value[0] for value in TRADE_EVENTS.values()],
		},
	}
