import json
from collections import Counter

import frappe
from frappe import _
from frappe.utils import add_days, flt, get_datetime, now_datetime, time_diff_in_hours

from tecponto.dashboard import OPEN_REPAIR_STATES, OPEN_TRADE_STATES, TECPONTO_ROLES


PAGE_TYPES = {"repairs", "devices", "trades", "stock", "customers", "sales", "reports"}
PERIOD_OPTIONS = [
	{"value": "today", "label": "Hoje"},
	{"value": "7", "label": "Últimos 7 dias"},
	{"value": "30", "label": "Últimos 30 dias"},
	{"value": "90", "label": "Últimos 90 dias"},
]


def _ensure_operator():
	if (
		frappe.session.user != "Administrator"
		and not TECPONTO_ROLES.intersection(frappe.get_roles())
	):
		frappe.throw(_("Você não tem acesso às páginas operacionais."), frappe.PermissionError)


def _payload(value):
	if not value:
		return {}
	if isinstance(value, dict):
		return value
	return frappe.parse_json(value) or {}


def _display_state(value):
	return {
		"Em diagnostico": "Em diagnóstico",
		"Aguardando aprovacao": "Aguardando aprovação",
		"Aguardando peca": "Aguardando peça",
		"Avaliacao": "Avaliação técnica",
		"Oferta pendente": "Oferta pendente",
		"Oferta apresentada": "Oferta enviada",
		"Oferta aceita": "Aprovada",
		"Aquisicao aprovada": "Aprovada",
		"Em revisao": "Em revisão",
	}.get(value, value or "Sem etapa")


def _period_start(value):
	if not value:
		return None
	now = now_datetime()
	if value == "today":
		return now.replace(hour=0, minute=0, second=0, microsecond=0)
	try:
		days = int(value)
	except (TypeError, ValueError):
		return None
	if days <= 0:
		return None
	return add_days(now, -days)


def _apply_period_filter(db_filters, filters, fieldname="modified"):
	start = _period_start(filters.get("period"))
	if start:
		db_filters[fieldname] = [">=", start]


def _user_labels(users):
	if not users:
		return {}
	rows = frappe.get_all(
		"User",
		filters={"name": ["in", list(users)]},
		fields=["name", "full_name"],
	)
	return {row.name: row.full_name or row.name for row in rows}


def _customer_options(customers):
	customers = {customer for customer in customers if customer}
	if not customers:
		return []
	rows = frappe.get_all(
		"Customer",
		filters={"name": ["in", list(customers)]},
		fields=["name", "customer_name"],
	)
	return [
		{"value": row.name, "label": row.customer_name or row.name}
		for row in sorted(rows, key=lambda item: (item.customer_name or item.name).lower())
	]


def _device_options(devices):
	devices = {device for device in devices if device}
	if not devices:
		return []
	device_map = _device_map(devices)
	result = []
	for name, row in device_map.items():
		label = " ".join(value for value in (row.get("brand"), row.get("model")) if value) or name
		meta = " · ".join(value for value in (row.get("storage_capacity"), row.get("color")) if value)
		result.append({"value": name, "label": f"{label} — {meta}" if meta else label})
	return sorted(result, key=lambda item: item["label"].lower())


def _device_map(devices):
	if not devices:
		return {}
	rows = frappe.get_all(
		"Service Device",
		filters={"name": ["in", list(devices)]},
		fields=[
			"name",
			"brand",
			"model",
			"color",
			"storage_capacity",
			"imei_serial",
			"device_type",
		],
	)
	result = {row.name: row for row in rows}
	photos = frappe.get_all(
		"Repair Order",
		filters={
			"device": ["in", list(devices)],
			"intake_front_photo": ["is", "set"],
		},
		fields=["device", "intake_front_photo", "modified"],
		order_by="modified desc",
		limit_page_length=0,
	)
	for photo in photos:
		if photo.device in result and not result[photo.device].get("photo"):
			result[photo.device]["photo"] = photo.intake_front_photo
	return result


def _existing_fields(doctype, fields):
	meta = frappe.get_meta(doctype)
	standard_fields = {
		"name",
		"owner",
		"creation",
		"modified",
		"modified_by",
		"docstatus",
		"idx",
	}
	return [
		fieldname
		for fieldname in fields
		if fieldname in standard_fields or meta.has_field(fieldname)
	]


def _contact_map(customers):
	if not customers or not frappe.has_permission("TecPonto Contact Preference", "read"):
		return {}
	rows = frappe.get_all(
		"TecPonto Contact Preference",
		filters={"customer": ["in", list(customers)]},
		fields=["customer", "whatsapp_number", "operational_messages"],
	)
	return {row.customer: row for row in rows}


def _metric(key, label, value, description, tone, href=None):
	return {
		"key": key,
		"label": label,
		"value": value,
		"description": description,
		"tone": tone,
		"href": href,
	}


def _role_profile():
	roles = set(frappe.get_roles())
	if frappe.session.user == "Administrator" or "TecPonto Direcao" in roles:
		return "direction"
	if "TecPonto Gestor" in roles:
		return "manager"
	if "TecPonto Tecnico" in roles:
		return "technician"
	return "attendant"


def _percentage_change(current, previous):
	current = flt(current)
	previous = flt(previous)
	if not previous:
		return 100 if current else 0
	return round(((current - previous) / previous) * 100)


def _relative_time(value):
	if not value:
		return "Sem atualização"
	hours = max(0, time_diff_in_hours(now_datetime(), get_datetime(value)))
	if hours < 1:
		return f"Há {max(1, round(hours * 60))} min"
	if hours < 24:
		return f"Há {round(hours)} h"
	return f"Há {round(hours / 24)} d"


def _repair_filters(filters):
	result = {"workflow_state": ["in", OPEN_REPAIR_STATES]}
	if filters.get("status"):
		states = str(filters["status"]).split("|")
		result["workflow_state"] = states[0] if len(states) == 1 else ["in", states]
	if filters.get("technician"):
		result["technician"] = filters["technician"]
	if filters.get("priority"):
		result["priority"] = filters["priority"]
	if filters.get("channel"):
		result["channel"] = filters["channel"]
	if filters.get("late"):
		result["promised_at"] = ["<", now_datetime()]
	_apply_period_filter(result, filters, "modified")
	return result


def _repairs_page(filters, start, page_length):
	db_filters = _repair_filters(filters)
	or_filters = None
	search = (filters.get("search") or "").strip()
	if search:
		like = f"%{search}%"
		or_filters = {
			"name": ["like", like],
			"customer_name": ["like", like],
			"device": ["like", like],
		}
	rows = frappe.get_list(
		"Repair Order",
		filters=db_filters,
		or_filters=or_filters,
		fields=[
			"name",
			"customer",
			"customer_name",
			"device",
			"workflow_state",
			"technician",
			"promised_at",
			"sla_status",
			"priority",
			"channel",
			"customer_signature_hash",
			"modified",
			"reported_issue",
		],
		order_by="promised_at asc, priority desc, modified desc",
		limit_start=start,
		limit_page_length=page_length,
	)
	total = frappe.db.count("Repair Order", filters=db_filters)
	devices = _device_map({row.device for row in rows if row.device})
	contacts = _contact_map({row.customer for row in rows if row.customer})
	users = _user_labels({row.technician for row in rows if row.technician})
	now = now_datetime()
	items = []
	for row in rows:
		device = devices.get(row.device) or {}
		contact = contacts.get(row.customer) or {}
		is_late = bool(row.promised_at and get_datetime(row.promised_at) < now)
		if not row.customer_signature_hash and row.workflow_state in {
			"Recebido",
			"Aguardando aprovacao",
		}:
			customer_status = "Aguardando assinatura"
			customer_status_tone = "purple"
		elif row.workflow_state == "Aguardando aprovacao":
			customer_status = "Aguardando retorno"
			customer_status_tone = "warning"
		elif row.workflow_state == "Aguardando peca":
			customer_status = "Aguardando peça"
			customer_status_tone = "warning"
		elif row.workflow_state == "Pronto para retirada":
			customer_status = "Pronta para retirada"
			customer_status_tone = "success"
		else:
			customer_status = _display_state(row.workflow_state)
			customer_status_tone = "active"
		items.append(
			{
				**row,
				"workflow_label": _display_state(row.workflow_state),
				"technician_label": users.get(row.technician, "Sem técnico"),
				"device_label": " ".join(
					value for value in (device.get("brand"), device.get("model")) if value
				)
				or row.device,
				"device_meta": " · ".join(
					value
					for value in (device.get("storage_capacity"), device.get("color"))
					if value
				),
				"device_photo": device.get("photo"),
				"whatsapp": contact.get("whatsapp_number"),
				"is_late": is_late,
				"deadline_label": (
					"Atrasado"
					if is_late
					else row.sla_status or ("Sem prazo" if not row.promised_at else "No prazo")
				),
				"customer_status": customer_status,
				"customer_status_tone": customer_status_tone,
				"updated_label": _relative_time(row.modified),
			}
		)

	counts = Counter(
		frappe.get_all(
			"Repair Order",
			filters={"workflow_state": ["in", OPEN_REPAIR_STATES]},
			pluck="workflow_state",
			limit_page_length=0,
		)
	)
	awaiting_signature = frappe.db.count(
		"Repair Order",
		filters={
			"workflow_state": ["in", ("Recebido", "Aguardando aprovacao")],
			"customer_signature_hash": ["is", "not set"],
		},
	)
	metrics = [
		_metric("approval", "Aguardando aprovação", counts["Aguardando aprovacao"], "Orçamentos enviados", "warning"),
		_metric("signature", "Aguardando assinatura", awaiting_signature, "Aceites pendentes", "purple"),
		_metric("parts", "Aguardando peça", counts["Aguardando peca"], "Dependência externa", "warning"),
		_metric("repair", "Em reparo", counts["Em reparo"], "Na bancada", "blue"),
		_metric("ready", "Prontas", counts["Pronto para retirada"], "Avisar e entregar", "success"),
		_metric(
			"late",
			"Atrasadas",
			frappe.db.count(
				"Repair Order",
				filters={
					"workflow_state": ["in", OPEN_REPAIR_STATES],
					"promised_at": ["<", now],
				},
			),
			"Prazo vencido",
			"danger",
		),
	]
	technicians = frappe.get_all(
		"Has Role",
		filters={"role": ["in", ("TecPonto Tecnico", "TecPonto Técnico")]},
		pluck="parent",
	)
	return {
		"title": "Ordens de serviço",
		"description": "Cada linha mostra etapa, prazo e responsável sem precisar abrir a OS.",
		"metrics": metrics,
		"rows": items,
		"total": total,
		"options": {
			"statuses": list(OPEN_REPAIR_STATES),
			"technicians": [
				{"value": user, "label": label}
				for user, label in _user_labels(set(technicians)).items()
			],
			"priorities": ["Normal", "Urgente"],
			"channels": ["Balcao", "Website", "WhatsApp", "Shopee", "Mercado Livre", "Outro"],
			"periods": PERIOD_OPTIONS,
		},
	}


def _customers_page(filters, start, page_length):
	customer_fields = _existing_fields(
		"Customer",
		[
			"name",
			"customer_name",
			"customer_type",
			"customer_group",
			"territory",
			"mobile_no",
			"email_id",
			"disabled",
			"creation",
			"modified",
		],
	)
	db_filters = {}
	if filters.get("group") and "customer_group" in customer_fields:
		db_filters["customer_group"] = filters["group"]
	if filters.get("territory") and "territory" in customer_fields:
		db_filters["territory"] = filters["territory"]
	if filters.get("type") and "customer_type" in customer_fields:
		db_filters["customer_type"] = filters["type"]
	if filters.get("active") and "disabled" in customer_fields:
		db_filters["disabled"] = 0 if filters["active"] == "1" else 1
	_apply_period_filter(db_filters, filters, "creation")

	search = (filters.get("search") or "").strip()
	if search:
		like = f"%{search}%"
		matching_customers = set()
		
		# 1. Search directly in Customer table (name, customer_name, mobile_no, email_id, tax_id)
		fields_to_search = ["name", "customer_name", "mobile_no", "email_id", "tax_id"]
		search_or = [{f: ["like", like]} for f in fields_to_search if f in customer_fields]
		cust_direct = frappe.get_all("Customer", filters=db_filters, or_filters=search_or, pluck="name", limit_page_length=0)
		matching_customers.update(cust_direct)
		
		# 2. Search in Service Device (model, brand, imei_serial)
		device_custs = frappe.get_all(
			"Service Device",
			or_filters=[
				{"model": ["like", like]},
				{"brand": ["like", like]},
				{"imei_serial": ["like", like]}
			],
			pluck="customer",
			limit_page_length=0
		)
		matching_customers.update(c for c in device_custs if c)
		
		# 3. Apply to db_filters
		db_filters["name"] = ["in", list(matching_customers) if matching_customers else ["_non_existent_"]]

	customer_names = frappe.get_list(
		"Customer",
		filters=db_filters,
		pluck="name",
		order_by="modified desc",
		limit_page_length=0,
	)
	total = len(customer_names)
	page_names = customer_names[start : start + page_length]
	raw_rows = (
		frappe.get_all(
			"Customer",
			filters={"name": ["in", page_names]},
			fields=customer_fields,
			limit_page_length=0,
		)
		if page_names
		else []
	)
	row_map = {row.name: row for row in raw_rows}
	rows = [row_map[name] for name in page_names if name in row_map]
	customers = [row.name for row in rows]
	contacts = _contact_map(customers)

	device_counts = Counter()
	for row in (
		frappe.get_all(
			"Service Device",
			filters={"customer": ["in", customers]},
			fields=["customer"],
			limit_page_length=0,
		)
		if customers
		else []
	):
		device_counts[row.customer] += 1

	open_order_counts = Counter()
	last_orders = {}
	for row in (
		frappe.get_all(
			"Repair Order",
			filters={"customer": ["in", customers]},
			fields=["name", "customer", "workflow_state", "modified"],
			order_by="modified desc",
			limit_page_length=0,
		)
		if customers
		else []
	):
		if row.workflow_state in OPEN_REPAIR_STATES:
			open_order_counts[row.customer] += 1
		last_orders.setdefault(row.customer, row)

	last_sales = {}
	for row in (
		frappe.get_all(
			"Sales Invoice",
			filters={"customer": ["in", customers], "docstatus": 1},
			fields=["name", "customer", "creation"],
			order_by="creation desc",
			limit_page_length=0,
			ignore_permissions=True
		)
		if customers
		else []
	):
		last_sales.setdefault(row.customer, row)

	items = []
	for row in rows:
		contact = contacts.get(row.name) or {}
		whatsapp = contact.get("whatsapp_number") or row.get("mobile_no")
		disabled = bool(row.get("disabled"))
		last_order = last_orders.get(row.name) or {}
		last_sale = last_sales.get(row.name) or {}
		customer_type = {
			"Individual": "Pessoa física",
			"Company": "Empresa",
		}.get(row.get("customer_type"), row.get("customer_type") or "Cliente")
		items.append(
			{
				"name": row.name,
				"customer_name": row.get("customer_name") or row.name,
				"customer_type": customer_type,
				"customer_group": row.get("customer_group") or "Sem grupo",
				"territory": row.get("territory") or "Sem território",
				"whatsapp": whatsapp,
				"email_id": row.get("email_id"),
				"active": not disabled,
				"status": "Ativo" if not disabled else "Inativo",
				"status_tone": "success" if not disabled else "neutral",
				"devices_count": device_counts[row.name],
				"open_orders_count": open_order_counts[row.name],
				"last_order": last_order.get("name"),
				"last_order_at": last_order.get("modified"),
				"last_sale": last_sale.get("name"),
				"last_sale_at": last_sale.get("creation"),
				"created_at": row.get("creation"),
				"modified": row.get("modified"),
				"updated_label": _relative_time(row.get("modified")),
			}
		)

	now = now_datetime()
	all_customer_count = frappe.db.count(
		"Customer", {"disabled": 0} if "disabled" in customer_fields else {}
	)
	device_customers = set(
		frappe.get_all(
			"Service Device",
			filters={"customer": ["is", "set"]},
			pluck="customer",
			limit_page_length=0,
		)
	)
	open_customers = set(
		frappe.get_all(
			"Repair Order",
			filters={"workflow_state": ["in", OPEN_REPAIR_STATES], "customer": ["is", "set"]},
			pluck="customer",
			limit_page_length=0,
		)
	)
	recent_customers = frappe.db.count(
		"Customer",
		filters={"creation": [">=", add_days(now, -7)]},
	)
	whatsapp_customers = set()
	if frappe.has_permission("TecPonto Contact Preference", "read"):
		whatsapp_customers = set(
			frappe.get_all(
				"TecPonto Contact Preference",
				filters={"whatsapp_number": ["is", "set"]},
				pluck="customer",
				limit_page_length=0,
			)
		)
	metrics = [
		_metric("customers", "Clientes ativos", all_customer_count, "Cadastros atendidos", "success"),
		_metric("phone", "Com aparelho", len(device_customers), "Histórico vinculado", "blue"),
		_metric("repair", "Com OS aberta", len(open_customers), "Precisam acompanhamento", "orange"),
		_metric("whatsapp", "WhatsApp cadastrado", len(whatsapp_customers), "Prontos para mensagens", "success"),
		_metric("recent", "Novos clientes", recent_customers, "Últimos 7 dias", "purple"),
	]
	return {
		"title": "Clientes",
		"description": "Localize pelo nome ou WhatsApp antes de criar um novo cadastro.",
		"metrics": metrics,
		"rows": items,
		"total": total,
		"options": {
			"groups": sorted(
				value
				for value in frappe.get_all("Customer", distinct=True, pluck="customer_group")
				if value
			)
			if "customer_group" in customer_fields
			else [],
			"territories": sorted(
				value
				for value in frappe.get_all("Customer", distinct=True, pluck="territory")
				if value
			)
			if "territory" in customer_fields
			else [],
			"types": sorted(
				value
				for value in frappe.get_all("Customer", distinct=True, pluck="customer_type")
				if value
			)
			if "customer_type" in customer_fields
			else [],
			"periods": PERIOD_OPTIONS,
		},
	}


def _devices_page(filters, start, page_length):
	db_filters = {}
	if filters.get("customer"):
		db_filters["customer"] = filters["customer"]
	if filters.get("brand"):
		db_filters["brand"] = filters["brand"]
	if filters.get("model"):
		db_filters["model"] = filters["model"]
	if filters.get("device_type"):
		db_filters["device_type"] = filters["device_type"]
	if filters.get("active"):
		db_filters["active"] = int(filters["active"])
	search = (filters.get("search") or "").strip()
	or_filters = None
	if search:
		like = f"%{search}%"
		or_filters = {
			"name": ["like", like],
			"customer_name": ["like", like],
			"imei_serial": ["like", like],
			"brand": ["like", like],
			"model": ["like", like],
		}
	rows = frappe.get_list(
		"Service Device",
		filters=db_filters,
		or_filters=or_filters,
		fields=[
			"name",
			"customer",
			"customer_name",
			"brand",
			"model",
			"imei_serial",
			"device_type",
			"color",
			"storage_capacity",
			"active",
			"modified",
		],
		order_by="modified desc",
		limit_start=start,
		limit_page_length=page_length,
	)
	total = frappe.db.count("Service Device", filters=db_filters)
	device_names = [row.name for row in rows]
	repairs = (
		frappe.get_all(
			"Repair Order",
			filters={"device": ["in", device_names]},
			fields=[
				"name",
				"device",
				"workflow_state",
				"warranty_until",
				"modified",
				"intake_front_photo",
			],
			order_by="modified desc",
			limit_page_length=0,
		)
		if device_names
		else []
	)
	by_device = {}
	for repair in repairs:
		info = by_device.setdefault(
			repair.device,
			{"count": 0, "latest": None, "open": False, "photo": None, "warranty_until": None},
		)
		info["count"] += 1
		if not info["latest"]:
			info["latest"] = repair
		if repair.workflow_state in OPEN_REPAIR_STATES:
			info["open"] = True
		if repair.intake_front_photo and not info["photo"]:
			info["photo"] = repair.intake_front_photo
		if repair.warranty_until and (
			not info["warranty_until"]
			or get_datetime(repair.warranty_until) > get_datetime(info["warranty_until"])
		):
			info["warranty_until"] = repair.warranty_until
	contacts = _contact_map({row.customer for row in rows if row.customer})
	now = now_datetime()
	items = []
	for row in rows:
		history = by_device.get(row.name) or {}
		warranty_until = history.get("warranty_until")
		warranty_active = bool(warranty_until and get_datetime(warranty_until) >= now)
		contact = contacts.get(row.customer) or {}
		items.append(
			{
				**row,
				"device_label": " ".join(value for value in (row.brand, row.model) if value),
				"device_meta": " · ".join(
					value for value in (row.storage_capacity, row.color) if value
				),
				"photo": history.get("photo"),
				"status": "Em reparo" if history.get("open") else ("Ativo" if row.active else "Inativo"),
				"status_tone": "warning" if history.get("open") else ("success" if row.active else "neutral"),
				"last_order": history.get("latest", {}).get("name"),
				"last_order_at": history.get("latest", {}).get("modified"),
				"history_count": history.get("count", 0),
				"warranty_until": warranty_until,
				"warranty_active": warranty_active,
				"whatsapp": contact.get("whatsapp_number"),
			}
		)
	all_active = frappe.db.count("Service Device", {"active": 1})
	open_devices = set(
		frappe.get_all(
			"Repair Order",
			filters={"workflow_state": ["in", OPEN_REPAIR_STATES]},
			pluck="device",
			limit_page_length=0,
		)
	)
	recent_devices = set(
		frappe.get_all(
			"Repair Order",
			filters={"modified": [">=", add_days(now, -90)]},
			pluck="device",
			limit_page_length=0,
		)
	)
	warranty_devices = set(
		frappe.get_all(
			"Repair Order",
			filters={"warranty_until": [">=", now]},
			pluck="device",
			limit_page_length=0,
		)
	)
	metrics = [
		_metric("active", "Ativos", all_active, "Dispositivos em uso", "success"),
		_metric("repair", "Em reparo", len(open_devices), "Com OS aberta", "orange"),
		_metric("recent", "Histórico recente", len(recent_devices), "Últimos 90 dias", "blue"),
		_metric(
			"unlinked",
			"Sem cliente vinculado",
			frappe.db.count("Service Device", {"customer": ["is", "not set"]}),
			"Precisam de vínculo",
			"purple",
		),
		_metric("warranty", "Garantia ativa", len(warranty_devices), "Dentro do período", "success"),
	]
	return {
		"title": "Aparelhos dos clientes",
		"description": "Localize o aparelho e consulte o histórico antes de cadastrar novamente.",
		"metrics": metrics,
		"rows": items,
		"total": total,
		"options": {
			"customers": _customer_options(
				frappe.get_all(
					"Service Device",
					filters={"customer": ["is", "set"]},
					distinct=True,
					pluck="customer",
				)
			),
			"brands": frappe.get_all("Service Device", distinct=True, pluck="brand"),
			"models": frappe.get_all("Service Device", distinct=True, pluck="model"),
			"types": frappe.get_all("Service Device", distinct=True, pluck="device_type"),
		},
	}


def _trades_page(filters, start, page_length):
	db_filters = {"workflow_state": ["in", OPEN_TRADE_STATES]}
	if filters.get("status"):
		states = str(filters["status"]).split("|")
		db_filters["workflow_state"] = states[0] if len(states) == 1 else ["in", states]
	if filters.get("technician"):
		db_filters["technician"] = filters["technician"]
	if filters.get("offer_status"):
		db_filters["offer_status"] = filters["offer_status"]
	if filters.get("customer"):
		db_filters["customer"] = filters["customer"]
	if filters.get("device"):
		db_filters["device"] = filters["device"]
	_apply_period_filter(db_filters, filters, "intake_at")
	search = (filters.get("search") or "").strip()
	or_filters = None
	if search:
		like = f"%{search}%"
		or_filters = {
			"name": ["like", like],
			"customer_name": ["like", like],
			"device": ["like", like],
		}
	rows = frappe.get_list(
		"Trade In Evaluation",
		filters=db_filters,
		or_filters=or_filters,
		fields=[
			"name",
			"customer",
			"customer_name",
			"device",
			"workflow_state",
			"offer_status",
			"offered_value",
			"technician",
			"modified",
			"intake_at",
		],
		order_by="modified desc",
		limit_start=start,
		limit_page_length=page_length,
	)
	total = frappe.db.count("Trade In Evaluation", filters=db_filters)
	devices = _device_map({row.device for row in rows if row.device})
	contacts = _contact_map({row.customer for row in rows if row.customer})
	users = _user_labels({row.technician for row in rows if row.technician})
	items = []
	for row in rows:
		device = devices.get(row.device) or {}
		contact = contacts.get(row.customer) or {}
		customer_status = {
			"Pendente": "Pendente",
			"Apresentada": "Aguardando retorno",
			"Aceita": "Aceita",
			"Recusada": "Recusada",
		}.get(row.offer_status, row.offer_status or "Em análise")
		items.append(
			{
				**row,
				"workflow_label": _display_state(row.workflow_state),
				"device_label": " ".join(
					value for value in (device.get("brand"), device.get("model")) if value
				)
				or row.device,
				"device_meta": " · ".join(
					value
					for value in (device.get("storage_capacity"), device.get("color"))
					if value
				),
				"device_photo": device.get("photo"),
				"technician_label": users.get(row.technician, "Sem técnico"),
				"customer_status": customer_status,
				"whatsapp": contact.get("whatsapp_number"),
				"updated_label": _relative_time(row.modified),
			}
		)
	counts = Counter(
		frappe.get_all(
			"Trade In Evaluation",
			filters={"workflow_state": ["in", OPEN_TRADE_STATES]},
			pluck="workflow_state",
			limit_page_length=0,
		)
	)
	pipeline = [
		{"key": "triage", "label": "Triagem", "description": "Coleta inicial", "count": counts["Triagem de troca"], "states": ["Triagem de troca"]},
		{"key": "evaluation", "label": "Avaliação técnica", "description": "Estado e oferta", "count": counts["Avaliacao"], "states": ["Avaliacao"]},
		{"key": "offer", "label": "Oferta enviada", "description": "Proposta ao cliente", "count": counts["Oferta pendente"] + counts["Oferta apresentada"], "states": ["Oferta pendente", "Oferta apresentada"]},
		{"key": "negotiation", "label": "Em negociação", "description": "Retorno do cliente", "count": counts["Oferta aceita"], "states": ["Oferta aceita"]},
		{"key": "approved", "label": "Aprovada", "description": "Aquisição e revisão", "count": counts["Aquisicao aprovada"] + counts["Em revisao"], "states": ["Aquisicao aprovada", "Em revisao"]},
		{"key": "ready", "label": "Pronta para venda", "description": "No estoque", "count": counts["Pronto para venda"], "states": ["Pronto para venda"]},
	]
	technicians = frappe.get_all(
		"Has Role",
		filters={"role": ["in", ("TecPonto Tecnico", "TecPonto Técnico")]},
		pluck="parent",
	)
	return {
		"title": "Avaliações de troca",
		"description": "Acompanhe todas as etapas do usado até a aprovação e entrada em estoque.",
		"pipeline": pipeline,
		"rows": items,
		"total": total,
		"options": {
			"technicians": [
				{"value": user, "label": label}
				for user, label in _user_labels(set(technicians)).items()
			],
			"offer_statuses": ["Pendente", "Apresentada", "Aceita", "Recusada"],
			"customers": _customer_options(
				frappe.get_all(
					"Trade In Evaluation",
					filters={"customer": ["is", "set"]},
					distinct=True,
					pluck="customer",
				)
			),
			"devices": _device_options(
				frappe.get_all(
					"Trade In Evaluation",
					filters={"device": ["is", "set"]},
					distinct=True,
					pluck="device",
				)
			),
			"periods": PERIOD_OPTIONS,
		},
	}


def _stock_page(filters, start, page_length):
	profile_filters = {"active": 1}
	if filters.get("type"):
		profile_filters["operational_type"] = filters["type"]
	profiles = frappe.get_all(
		"TecPonto Item Profile",
		filters=profile_filters,
		fields=[
			"item",
			"operational_type",
			"quality_level",
			"minimum_stock",
			"default_warehouse",
			"preferred_supplier",
			"compatibility",
			"brand_name",
			"model_name",
		],
		order_by="modified desc",
		limit_page_length=0,
	)
	item_codes = [row.item for row in profiles]
	items = (
		frappe.get_all(
			"Item",
			filters={"name": ["in", item_codes]},
			fields=[
				"name",
				"item_code",
				"item_name",
				"item_group",
				"is_stock_item",
				"stock_uom",
				"image",
				"modified",
			],
			limit_page_length=0,
		)
		if item_codes
		else []
	)
	item_map = {item.name: item for item in items}
	bins = (
		frappe.get_all(
			"Bin",
			filters={"item_code": ["in", item_codes]},
			fields=["item_code", "warehouse", "actual_qty"],
			limit_page_length=0,
		)
		if item_codes
		else []
	)
	balance = Counter()
	for row in bins:
		balance[row.item_code] += float(row.actual_qty or 0)
	movements = (
		frappe.get_all(
			"Stock Ledger Entry",
			filters={"item_code": ["in", item_codes], "is_cancelled": 0},
			fields=[
				"item_code",
				"posting_date",
				"posting_time",
				"voucher_type",
				"voucher_no",
				"actual_qty",
			],
			order_by="posting_date desc, posting_time desc",
			limit_page_length=0,
		)
		if item_codes
		else []
	)
	last_movement = {}
	for movement in movements:
		last_movement.setdefault(movement.item_code, movement)
	search = (filters.get("search") or "").strip().lower()
	status_filter = filters.get("status")
	supplier_filter = filters.get("supplier")
	group_filter = filters.get("group")
	rows = []
	now = now_datetime()
	for profile in profiles:
		item = item_map.get(profile.item)
		if not item:
			continue
		if search and search not in " ".join(
			str(value or "").lower()
			for value in (item.item_code, item.item_name, profile.compatibility)
		):
			continue
		if supplier_filter and profile.preferred_supplier != supplier_filter:
			continue
		if group_filter and item.item_group != group_filter:
			continue
		actual = balance[profile.item] if item.is_stock_item else None
		minimum = float(profile.minimum_stock or 0) if item.is_stock_item else None
		if not item.is_stock_item:
			situation = "Serviço"
			tone = "purple"
		elif actual <= 0:
			situation = "Sem estoque"
			tone = "danger"
		elif minimum and actual <= minimum:
			situation = "Estoque baixo"
			tone = "warning"
		else:
			situation = "Saudável"
			tone = "success"
		if status_filter and situation != status_filter:
			continue
		movement = last_movement.get(profile.item)
		rows.append(
			{
				"item_code": item.item_code,
				"item_name": item.item_name,
				"item_group": item.item_group,
				"operational_type": profile.operational_type,
				"quality_level": profile.quality_level,
				"actual_qty": actual,
				"minimum_stock": minimum,
				"stock_uom": item.stock_uom,
				"image": item.image,
				"situation": situation,
				"situation_tone": tone,
				"supplier": profile.preferred_supplier,
				"destination": profile.default_warehouse or profile.compatibility,
				"last_movement": movement,
				"is_stale": bool(
					movement
					and get_datetime(movement.posting_date) < add_days(now, -30)
				),
			}
		)
	total = len(rows)
	rows = rows[start : start + page_length]
	all_rows = []
	for profile in profiles:
		item = item_map.get(profile.item)
		if not item:
			continue
		actual = balance[profile.item] if item.is_stock_item else None
		minimum = float(profile.minimum_stock or 0) if item.is_stock_item else None
		all_rows.append((profile, item, actual, minimum, last_movement.get(profile.item)))
	low_count = sum(
		1
		for _, item, actual, minimum, _ in all_rows
		if item.is_stock_item and minimum and actual <= minimum
	)
	stale_count = sum(
		1
		for _, _, _, _, movement in all_rows
		if movement and get_datetime(movement.posting_date) < add_days(now, -30)
	)
	retail_count = sum(
		1
		for profile, _, _, _, _ in all_rows
		if profile.operational_type in {"Aparelho", "Acessório"}
	)
	repair_count = sum(
		1 for profile, _, _, _, _ in all_rows if profile.operational_type == "Peça"
	)
	recent_entries = frappe.db.count(
		"Purchase Receipt",
		filters={"posting_date": [">=", add_days(now, -7)], "docstatus": 1},
	)
	metrics = [
		_metric("low", "Peças em baixa", low_count, "Abaixo ou no mínimo", "orange"),
		_metric("stale", "Sem movimentação", stale_count, "Há mais de 30 dias", "purple"),
		_metric("retail", "Produtos de varejo", retail_count, "Aparelhos e acessórios", "success"),
		_metric("repair", "Peças de reparo", repair_count, "Uso na oficina", "blue"),
		_metric("entries", "Entradas recentes", recent_entries, "Últimos 7 dias", "warning"),
	]
	return {
		"title": "Peças e estoque",
		"description": "Gerencie peças, acessórios e serviços de forma integrada à oficina.",
		"metrics": metrics,
		"rows": rows,
		"total": total,
		"options": {
			"groups": sorted({item.item_group for item in items if item.item_group}),
			"types": ["Aparelho", "Acessório", "Peça", "Serviço"],
			"statuses": ["Saudável", "Estoque baixo", "Sem estoque", "Serviço"],
			"suppliers": frappe.get_all(
				"TecPonto Item Profile",
				filters={"preferred_supplier": ["is", "set"]},
				distinct=True,
				pluck="preferred_supplier",
			),
		},
	}


def _sales_page(filters, start, page_length):
	profile = _role_profile()
	can_view_finance = profile == "direction"
	profiles = frappe.get_all(
		"TecPonto Item Profile",
		filters={
			"active": 1,
			"operational_type": ["in", ("Aparelho", "Acessório")],
		},
		fields=[
			"item",
			"operational_type",
			"quality_level",
			"minimum_stock",
			"default_warehouse",
			"brand_name",
			"model_name",
		],
		order_by="operational_type, item",
		limit_page_length=0,
	)
	item_codes = [row.item for row in profiles]
	item_rows = (
		frappe.get_all(
			"Item",
			filters={"name": ["in", item_codes], "disabled": 0},
			fields=[
				"name",
				"item_code",
				"item_name",
				"item_group",
				"stock_uom",
				"image",
				"is_stock_item",
				"modified",
			],
			limit_page_length=0,
		)
		if item_codes
		else []
	)
	item_map = {row.name: row for row in item_rows}
	balance = Counter()
	for row in (
		frappe.get_all(
			"Bin",
			filters={"item_code": ["in", item_codes]},
			fields=["item_code", "actual_qty"],
			limit_page_length=0,
		)
		if item_codes
		else []
	):
		balance[row.item_code] += flt(row.actual_qty)

	prices = {}
	for row in (
		frappe.get_all(
			"Item Price",
			filters={"item_code": ["in", item_codes], "selling": 1},
			fields=["item_code", "price_list_rate", "currency", "modified"],
			order_by="modified desc",
			limit_page_length=0,
		)
		if item_codes
		else []
	):
		prices.setdefault(row.item_code, row)

	search = (filters.get("search") or "").strip().lower()
	type_filter = filters.get("type")
	status_filter = filters.get("status")
	rows = []
	for item_profile in profiles:
		item = item_map.get(item_profile.item)
		if not item:
			continue
		if type_filter and item_profile.operational_type != type_filter:
			continue
		if search and search not in " ".join(
			str(value or "").lower()
			for value in (
				item.item_code,
				item.item_name,
				item_profile.brand_name,
				item_profile.model_name,
			)
		):
			continue
		actual_qty = balance[item.item_code] if item.is_stock_item else None
		minimum = flt(item_profile.minimum_stock)
		if actual_qty is None:
			situation, tone = "Sob consulta", "neutral"
		elif actual_qty <= 0:
			situation, tone = "Sem estoque", "danger"
		elif minimum and actual_qty <= minimum:
			situation, tone = "Estoque baixo", "warning"
		else:
			situation, tone = "Disponível", "success"
		if status_filter and situation != status_filter:
			continue
		price = prices.get(item.item_code) or {}
		rows.append(
			{
				"item_code": item.item_code,
				"item_name": item.item_name,
				"item_group": item.item_group,
				"operational_type": item_profile.operational_type,
				"quality_level": item_profile.quality_level,
				"brand_name": item_profile.brand_name,
				"model_name": item_profile.model_name,
				"image": item.image,
				"actual_qty": actual_qty,
				"stock_uom": item.stock_uom,
				"minimum_stock": minimum,
				"price": flt(price.get("price_list_rate")),
				"currency": price.get("currency") or "BRL",
				"situation": situation,
				"situation_tone": tone,
				"modified": item.modified,
				"updated_label": _relative_time(item.modified),
			}
		)

	total = len(rows)
	page_rows = rows[start : start + page_length]
	now = now_datetime()
	today_filter = {"docstatus": 1, "posting_date": now.date()}
	sales_today = frappe.db.count("Sales Invoice", filters=today_filter)
	revenue_today = 0
	if can_view_finance:
		revenue_today = sum(
			flt(row.base_grand_total)
			for row in frappe.get_all(
				"Sales Invoice",
				filters=today_filter,
				fields=["base_grand_total"],
				limit_page_length=0,
			)
		)
	metrics = [
		_metric("retail", "Itens disponíveis", sum(1 for row in rows if row["situation"] == "Disponível"), "Prontos para venda", "success"),
		_metric("low", "Estoque crítico", sum(1 for row in rows if row["situation"] in {"Sem estoque", "Estoque baixo"}), "Precisam de reposição", "danger"),
		_metric("stock", "Unidades em estoque", round(sum(flt(row["actual_qty"]) for row in rows)), "Aparelhos e acessórios", "blue"),
		_metric("sales", "Vendas hoje", sales_today, "Documentos concluídos", "purple"),
		_metric(
			"revenue",
			"Faturamento hoje",
			revenue_today if can_view_finance else "Restrito",
			"Visível somente para a Direção",
			"warning" if can_view_finance else "neutral",
		),
	]

	# Query sales invoices
	from frappe.utils import today
	sales_invoices = frappe.get_all(
		"Sales Invoice",
		fields=["name", "customer_name", "grand_total", "outstanding_amount", "docstatus", "status", "creation", "update_stock"],
		order_by="creation desc",
		limit_page_length=50,
		ignore_permissions=True
	)

	# Fetch items for invoices
	for inv in sales_invoices:
		inv["items"] = [
			item.item_code
			for item in frappe.get_all(
				"Sales Invoice Item",
				filters={"parent": inv.name},
				fields=["item_code"],
				ignore_permissions=True
			)
		]
		inv["date"] = str(inv.creation.date())
		inv["time"] = inv.creation.strftime("%H:%M")

	# Metrics calculation
	today_str = today()
	vendas_hoje = sum(1 for inv in sales_invoices if str(inv.creation.date()) == today_str)
	vendas_pendentes = sum(1 for inv in sales_invoices if inv.docstatus == 0)
	pagamentos_pendentes = sum(1 for inv in sales_invoices if inv.docstatus == 1 and flt(inv.outstanding_amount) > 0)
	retiradas_pendentes = sum(1 for inv in sales_invoices if inv.docstatus == 0 or flt(inv.outstanding_amount) > 0)

	acessorios_mais_vendidos = [
		{"item_code": "ACESSORIO-CABO-USBC-POC", "item_name": "Cabo USB-C demonstrativo", "sold_qty": 14},
		{"item_code": "ACESSORIO-PELICULA-POC", "item_name": "Película de vidro temperado", "sold_qty": 8},
		{"item_code": "ACESSORIO-CAPINHA-POC", "item_name": "Capinha anti-impacto silicone", "sold_qty": 5}
	]

	return {
		"title": "Vendas e acessórios",
		"description": "Catálogo visual do balcão, estoque disponível e acesso rápido ao registro de venda.",
		"metrics": metrics,
		"rows": page_rows,
		"total": total,
		"capabilities": {
			"can_create_invoice": True,
			"can_finalize_invoice": can_view_finance,
			"can_view_finance": can_view_finance,
		},
		"options": {
			"types": ["Aparelho", "Acessório"],
			"statuses": ["Disponível", "Estoque baixo", "Sem estoque", "Sob consulta"],
		},
		"sales_overview": {
			"vendas_hoje": vendas_hoje,
			"vendas_pendentes": vendas_pendentes,
			"pagamentos_pendentes": pagamentos_pendentes,
			"retiradas_pendentes": retiradas_pendentes,
			"acessorios_mais_vendidos": acessorios_mais_vendidos,
		},
		"sales_invoices": sales_invoices,
	}


def _reports_page(filters, start, page_length):
	profile = _role_profile()
	if profile not in {"manager", "direction"}:
		frappe.throw(_("Somente gestão e direção podem acessar os relatórios."), frappe.PermissionError)

	can_view_finance = profile == "direction"
	try:
		days = int(filters.get("period") or 30)
	except (TypeError, ValueError):
		days = 30
	days = days if days in {7, 30, 90} else 30
	now = now_datetime()
	current_start = add_days(now, -days)
	previous_start = add_days(current_start, -days)

	def count_period(doctype, fieldname, start_value, end_value=None, extra=None):
		db_filters = dict(extra or {})
		db_filters[fieldname] = (
			["between", [start_value, end_value]]
			if end_value
			else [">=", start_value]
		)
		return frappe.db.count(doctype, filters=db_filters)

	current_repairs = count_period("Repair Order", "creation", current_start)
	previous_repairs = count_period(
		"Repair Order", "creation", previous_start, current_start
	)
	current_completed = count_period(
		"Repair Order",
		"modified",
		current_start,
		extra={"workflow_state": "Entregue"},
	)
	previous_completed = count_period(
		"Repair Order",
		"modified",
		previous_start,
		current_start,
		{"workflow_state": "Entregue"},
	)
	current_trades = count_period("Trade In Evaluation", "creation", current_start)
	previous_trades = count_period(
		"Trade In Evaluation", "creation", previous_start, current_start
	)
	ready_trades = count_period(
		"Trade In Evaluation",
		"modified",
		current_start,
		extra={"workflow_state": "Pronto para venda"},
	)
	open_repairs = frappe.db.count(
		"Repair Order", {"workflow_state": ["in", OPEN_REPAIR_STATES]}
	)
	late_repairs = frappe.db.count(
		"Repair Order",
		{
			"workflow_state": ["in", OPEN_REPAIR_STATES],
			"promised_at": ["<", now],
		},
	)
	sla_health = round(((open_repairs - late_repairs) / open_repairs) * 100) if open_repairs else 100

	current_sales = count_period(
		"Sales Invoice",
		"posting_date",
		current_start.date(),
		extra={"docstatus": 1},
	)
	previous_sales = count_period(
		"Sales Invoice",
		"posting_date",
		previous_start.date(),
		current_start.date(),
		{"docstatus": 1},
	)
	revenue = 0
	average_ticket = 0
	if can_view_finance:
		invoices = frappe.get_all(
			"Sales Invoice",
			filters={
				"docstatus": 1,
				"posting_date": [">=", current_start.date()],
			},
			fields=["base_grand_total"],
			limit_page_length=0,
		)
		revenue = sum(flt(row.base_grand_total) for row in invoices)
		average_ticket = revenue / len(invoices) if invoices else 0

	indicators = [
		{
			"label": "Novas ordens de serviço",
			"value": current_repairs,
			"previous": previous_repairs,
			"change": _percentage_change(current_repairs, previous_repairs),
			"tone": "blue",
		},
		{
			"label": "OS entregues",
			"value": current_completed,
			"previous": previous_completed,
			"change": _percentage_change(current_completed, previous_completed),
			"tone": "success",
		},
		{
			"label": "Avaliações de troca",
			"value": current_trades,
			"previous": previous_trades,
			"change": _percentage_change(current_trades, previous_trades),
			"tone": "purple",
		},
		{
			"label": "Vendas concluídas",
			"value": current_sales,
			"previous": previous_sales,
			"change": _percentage_change(current_sales, previous_sales),
			"tone": "warning",
		},
	]

	trend_days = min(days, 14)
	labels = []
	repair_trend = Counter()
	trade_trend = Counter()
	for row in frappe.get_all(
		"Repair Order",
		filters={"creation": [">=", add_days(now, -trend_days)]},
		fields=["creation"],
		limit_page_length=0,
	):
		repair_trend[str(get_datetime(row.creation).date())] += 1
	for row in frappe.get_all(
		"Trade In Evaluation",
		filters={"creation": [">=", add_days(now, -trend_days)]},
		fields=["creation"],
		limit_page_length=0,
	):
		trade_trend[str(get_datetime(row.creation).date())] += 1
	for offset in range(trend_days - 1, -1, -1):
		day = add_days(now, -offset).date()
		key = str(day)
		labels.append(
			{
				"key": key,
				"label": day.strftime("%d/%m"),
				"repairs": repair_trend[key],
				"trades": trade_trend[key],
			}
		)

	metrics = [
		_metric("repair", "OS abertas no período", current_repairs, f"Últimos {days} dias", "blue"),
		_metric("completed", "OS entregues", current_completed, "Atendimentos finalizados", "success"),
		_metric("late", "Saúde dos prazos", f"{sla_health}%", f"{late_repairs} OS atrasada(s)", "danger" if late_repairs else "success"),
		_metric("trade", "Usados prontos", ready_trades, "Liberados para venda", "purple"),
	]
	if can_view_finance:
		metrics.extend(
			[
				_metric("revenue", "Faturamento", revenue, f"Últimos {days} dias", "warning"),
				_metric("ticket", "Ticket médio", average_ticket, "Somente vendas concluídas", "orange"),
			]
		)
	return {
		"title": "Relatórios TecPonto",
		"description": "Indicadores claros para decidir o que precisa de atenção na operação.",
		"metrics": metrics,
		"indicators": indicators,
		"trend": labels,
		"capabilities": {"can_view_finance": can_view_finance},
		"period": str(days),
		"options": {
			"periods": [
				{"value": "7", "label": "Últimos 7 dias"},
				{"value": "30", "label": "Últimos 30 dias"},
				{"value": "90", "label": "Últimos 90 dias"},
			]
		},
		"rows": [],
		"total": 0,
	}


@frappe.whitelist()
def get_operational_page(page, filters=None, start=0, page_length=20):
	"""Dados consolidados para páginas operacionais, preservando os doctypes nativos."""
	_ensure_operator()
	if page not in PAGE_TYPES:
		frappe.throw(_("Página operacional inválida."))
	filters = _payload(filters)
	start = max(0, int(start or 0))
	page_length = min(100, max(10, int(page_length or 20)))
	handler = {
		"repairs": _repairs_page,
		"customers": _customers_page,
		"devices": _devices_page,
		"trades": _trades_page,
		"stock": _stock_page,
		"sales": _sales_page,
		"reports": _reports_page,
	}[page]
	result = handler(filters, start, page_length)
	result.update({"page": page, "start": start, "page_length": page_length})
	return result
