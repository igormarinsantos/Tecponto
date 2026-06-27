import re

import frappe
from frappe import _
from frappe.utils import add_to_date, cint, get_datetime, now_datetime


INTAKE_ROLES = {"TecPonto Atendente", "TecPonto Gestor", "TecPonto Direcao"}


def _ensure_intake_access():
	if (
		frappe.session.user != "Administrator"
		and not INTAKE_ROLES.intersection(frappe.get_roles())
	):
		frappe.throw(
			_("Seu perfil não pode registrar uma nova entrada."),
			frappe.PermissionError,
		)


def _normalize_phone(value):
	digits = re.sub(r"\D+", "", value or "")
	if len(digits) in {10, 11}:
		digits = f"55{digits}"
	if digits and (not digits.startswith("55") or len(digits) not in {12, 13}):
		frappe.throw(_("Informe um WhatsApp brasileiro válido com DDD."))
	return digits


def _find_or_create_customer(data, phone):
	customer = data.get("customer")
	if customer:
		if not frappe.db.exists("Customer", customer):
			frappe.throw(_("O cliente selecionado não existe."))
		return customer

	if phone:
		customer = frappe.db.get_value(
			"TecPonto Contact Preference",
			{"whatsapp_number": phone},
			"customer",
		)
		if customer:
			return customer

	customer_name = (data.get("customer_name") or "").strip()
	if not customer_name:
		frappe.throw(_("Informe o nome do cliente ou selecione um cadastro existente."))

	exact = frappe.db.get_value("Customer", {"customer_name": customer_name}, "name")
	if exact:
		return exact

	customer_group = (
		frappe.db.get_value("Customer Group", {"customer_group_name": "Individual"}, "name")
		or frappe.db.get_value("Customer Group", {"is_group": 0}, "name")
	)
	territory = (
		frappe.db.get_value("Territory", {"territory_name": "Brazil"}, "name")
		or frappe.db.get_value("Territory", {"is_group": 0}, "name")
	)
	return frappe.get_doc(
		{
			"doctype": "Customer",
			"customer_name": customer_name,
			"customer_type": "Individual",
			"customer_group": customer_group,
			"territory": territory,
		}
	).insert(ignore_permissions=True).name


def _upsert_contact_preference(customer, phone, operational_consent):
	if not phone:
		return
	if frappe.db.exists("TecPonto Contact Preference", customer):
		preference = frappe.get_doc("TecPonto Contact Preference", customer)
	else:
		preference = frappe.get_doc(
			{
				"doctype": "TecPonto Contact Preference",
				"customer": customer,
				"consent_source": "Balcão",
			}
		)
	preference.whatsapp_number = phone
	preference.operational_messages = cint(operational_consent)
	preference.save(ignore_permissions=True)


def _find_or_create_device(data, customer):
	device = data.get("device")
	if device:
		if frappe.db.get_value("Service Device", device, "customer") != customer:
			frappe.throw(_("O aparelho selecionado não pertence ao cliente."))
		return device

	brand = (data.get("brand") or "").strip()
	model = (data.get("model") or "").strip()
	if not brand or not model:
		frappe.throw(_("Informe marca e modelo do aparelho."))

	imei_serial = re.sub(
		r"[\s-]+",
		"",
		(data.get("imei_serial") or "").strip(),
	).upper()
	if imei_serial:
		existing = frappe.db.get_value(
			"Service Device",
			{"customer": customer, "imei_serial": imei_serial},
			"name",
		)
		if existing:
			return existing

	return frappe.get_doc(
		{
			"doctype": "Service Device",
			"customer": customer,
			"device_type": data.get("device_type") or "Celular",
			"brand": brand,
			"model": model,
			"imei_serial": imei_serial,
			"color": data.get("color"),
			"storage_capacity": data.get("storage_capacity"),
			"condition_summary": data.get("intake_condition"),
			"ownership_confirmed": cint(data.get("ownership_confirmed", 1)),
		}
	).insert(ignore_permissions=True).name


def _attach_file(file_url, doctype, name, fieldname):
	if not file_url:
		return file_url
	file_name = frappe.db.get_value("File", {"file_url": file_url}, "name")
	if not file_name:
		return file_url
	file_doc = frappe.get_doc("File", file_name)
	file_doc.attached_to_doctype = doctype
	file_doc.attached_to_name = name
	file_doc.attached_to_field = fieldname
	file_doc.save(ignore_permissions=True)
	return file_doc.file_url


def _default_company():
	company = (
		frappe.defaults.get_global_default("company")
		or frappe.db.get_value("Company", {}, "name")
	)
	if not company:
		frappe.throw(_("Configure a empresa antes de registrar atendimentos."))
	return company


@frappe.whitelist()
def create_customer_intake(payload):
	"""Cria um cliente pelo fluxo curto do balcão e registra a preferência de contato."""
	_ensure_intake_access()
	data = frappe.parse_json(payload) or {}
	phone = _normalize_phone(data.get("whatsapp_number"))
	if not phone:
		frappe.throw(_("Informe o WhatsApp do cliente com DDD."))
	customer = _find_or_create_customer(data, phone)
	_upsert_contact_preference(
		customer,
		phone,
		data.get("operational_consent"),
	)
	frappe.db.commit()
	return {
		"name": customer,
		"customer_name": frappe.db.get_value("Customer", customer, "customer_name"),
		"whatsapp_number": phone,
	}


@frappe.whitelist()
def create_device_intake(payload):
	"""Cadastra cliente e aparelho em uma jornada curta, sem expor o formulário técnico."""
	_ensure_intake_access()
	data = frappe.parse_json(payload) or {}
	phone = _normalize_phone(data.get("whatsapp_number"))
	customer = _find_or_create_customer(data, phone)
	_upsert_contact_preference(
		customer,
		phone,
		data.get("operational_consent"),
	)
	if not cint(data.get("ownership_confirmed")):
		frappe.throw(_("Confirme a titularidade ou autorização antes de cadastrar o aparelho."))
	device = _find_or_create_device(data, customer)
	frappe.db.commit()
	return {
		"name": device,
		"customer": customer,
	}


@frappe.whitelist()
def create_trade_intake(payload):
	"""Cria a triagem de troca sem expor ao atendente o formulário comercial completo."""
	_ensure_intake_access()
	data = frappe.parse_json(payload) or {}
	front_photo = data.get("device_front_photo")
	back_photo = data.get("device_back_photo")
	if not front_photo or not back_photo:
		frappe.throw(_("As fotos da frente e de trás são obrigatórias."))
	if not cint(data.get("ownership_confirmed")):
		frappe.throw(_("Confirme a titularidade ou autorização antes de registrar a troca."))

	phone = _normalize_phone(data.get("whatsapp_number"))
	customer = _find_or_create_customer(data, phone)
	_upsert_contact_preference(
		customer,
		phone,
		data.get("operational_consent"),
	)
	data["ownership_confirmed"] = 1
	device = _find_or_create_device(data, customer)
	trade = frappe.get_doc(
		{
			"doctype": "Trade In Evaluation",
			"company": _default_company(),
			"customer": customer,
			"device": device,
			"intake_at": now_datetime(),
			"source_channel": data.get("source_channel") or "Balcao",
			"current_condition": data.get("current_condition"),
			"desired_type": data.get("desired_type"),
			"cash_budget": data.get("cash_budget"),
			"technician": data.get("technician"),
			"ownership_confirmed": 1,
			"device_photo": front_photo,
			"device_front_photo": front_photo,
			"device_back_photo": back_photo,
			"technical_notes": (data.get("condition_details") or "").strip(),
		}
	).insert(ignore_permissions=True)

	front_photo = _attach_file(
		front_photo,
		"Trade In Evaluation",
		trade.name,
		"device_front_photo",
	)
	back_photo = _attach_file(
		back_photo,
		"Trade In Evaluation",
		trade.name,
		"device_back_photo",
	)
	frappe.db.set_value(
		"Trade In Evaluation",
		trade.name,
		{
			"device_photo": front_photo,
			"device_front_photo": front_photo,
			"device_back_photo": back_photo,
		},
		update_modified=False,
	)
	frappe.db.commit()
	return {
		"name": trade.name,
		"customer": customer,
		"device": device,
		"workflow_state": trade.workflow_state,
	}


@frappe.whitelist()
def create_repair_intake(payload):
	"""Cria cliente, aparelho e OS em uma única experiência guiada do balcão."""
	_ensure_intake_access()
	data = frappe.parse_json(payload) or {}
	front_photo = data.get("intake_front_photo")
	back_photo = data.get("intake_back_photo")
	if not front_photo or not back_photo:
		frappe.throw(_("As fotos da frente e de trás são obrigatórias."))

	phone = _normalize_phone(data.get("whatsapp_number"))
	customer = _find_or_create_customer(data, phone)
	_upsert_contact_preference(
		customer,
		phone,
		data.get("operational_consent"),
	)
	device = _find_or_create_device(data, customer)

	settings = frappe.get_single("TecPonto Operations Settings")
	intake_at = now_datetime()
	promised_at = data.get("promised_at") or add_to_date(
		get_datetime(intake_at),
		hours=cint(settings.default_repair_deadline_hours or 48),
	)
	order = frappe.get_doc(
		{
			"doctype": "Repair Order",
			"company": _default_company(),
			"customer": customer,
			"device": device,
			"intake_at": intake_at,
			"channel": data.get("channel") or "Balcao",
			"priority": data.get("priority") or "Normal",
			"service_type": data.get("service_type") or "Reparo",
			"original_repair_order": data.get("original_repair_order"),
			"promised_at": promised_at,
			"reported_issue": (data.get("reported_issue") or "").strip(),
			"intake_condition": (data.get("intake_condition") or "").strip(),
			"accessories": (data.get("accessories") or "Nenhum").strip(),
			"intake_front_photo": front_photo,
			"intake_back_photo": back_photo,
		}
	).insert(ignore_permissions=True)

	front_photo = _attach_file(
		front_photo,
		"Repair Order",
		order.name,
		"intake_front_photo",
	)
	back_photo = _attach_file(
		back_photo,
		"Repair Order",
		order.name,
		"intake_back_photo",
	)
	frappe.db.set_value(
		"Repair Order",
		order.name,
		{
			"intake_front_photo": front_photo,
			"intake_back_photo": back_photo,
		},
		update_modified=False,
	)
	frappe.db.commit()
	return {
		"name": order.name,
		"customer": customer,
		"device": device,
		"workflow_state": order.workflow_state,
	}
