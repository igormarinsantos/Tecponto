import frappe
from frappe.utils import now_datetime, nowdate


OPEN_REPAIR_STATES = (
	"Recebido",
	"Em diagnostico",
	"Aguardando aprovacao",
	"Aprovado",
	"Aguardando peca",
	"Em reparo",
	"Em testes",
	"Pronto para retirada",
	"Sem conserto",
)

OPEN_TRADE_STATES = (
	"Triagem de troca",
	"Avaliacao",
	"Oferta pendente",
	"Oferta apresentada",
	"Oferta aceita",
	"Aquisicao aprovada",
	"Em revisao",
	"Pronto para venda",
)


def _ensure_operator():
	roles = set(frappe.get_roles())
	if frappe.session.user == "Administrator" or roles.intersection(
		{
			"TecPonto Atendente",
			"TecPonto Tecnico",
			"TecPonto Gestor",
			"TecPonto Direcao",
		}
	):
		return
	frappe.throw("Seu usuario nao tem acesso operacional TecPonto.", frappe.PermissionError)


def _card(value, route=None, route_options=None, fieldtype="Int"):
	payload = {"value": int(value or 0), "fieldtype": fieldtype}
	if route:
		payload["route"] = route
	if route_options:
		payload["route_options"] = route_options
	return payload


def _count(doctype, filters=None):
	_ensure_operator()
	return frappe.db.count(doctype, filters=filters or {})


@frappe.whitelist()
def open_repairs():
	return _card(
		_count("Repair Order", {"workflow_state": ["in", OPEN_REPAIR_STATES]}),
		route=["List", "Repair Order"],
		route_options={"workflow_state": ["in", OPEN_REPAIR_STATES]},
	)


@frappe.whitelist()
def late_repairs():
	return _card(
		_count(
			"Repair Order",
			{
				"workflow_state": ["in", OPEN_REPAIR_STATES],
				"promised_at": ["<", now_datetime()],
			},
		),
		route=["List", "Repair Order"],
		route_options={"sla_status": "Atrasado"},
	)


@frappe.whitelist()
def awaiting_diagnosis():
	return _card(
		_count("Repair Order", {"workflow_state": ["in", ("Recebido", "Em diagnostico")]}),
		route=["List", "Repair Order"],
		route_options={"workflow_state": ["in", ("Recebido", "Em diagnostico")]},
	)


@frappe.whitelist()
def awaiting_approval():
	return _card(
		_count("Repair Order", {"workflow_state": "Aguardando aprovacao"}),
		route=["List", "Repair Order"],
		route_options={"workflow_state": "Aguardando aprovacao"},
	)


@frappe.whitelist()
def ready_for_pickup():
	return _card(
		_count("Repair Order", {"workflow_state": "Pronto para retirada"}),
		route=["List", "Repair Order"],
		route_options={"workflow_state": "Pronto para retirada"},
	)


@frappe.whitelist()
def open_trades():
	return _card(
		_count("Trade In Evaluation", {"workflow_state": ["in", OPEN_TRADE_STATES]}),
		route=["List", "Trade In Evaluation"],
		route_options={"workflow_state": ["in", OPEN_TRADE_STATES]},
	)


@frappe.whitelist()
def trade_offers_pending():
	return _card(
		_count(
			"Trade In Evaluation",
			{"workflow_state": ["in", ("Oferta pendente", "Oferta apresentada")]},
		),
		route=["List", "Trade In Evaluation"],
		route_options={"workflow_state": ["in", ("Oferta pendente", "Oferta apresentada")]},
	)


@frappe.whitelist()
def used_devices_ready():
	return _card(
		_count("Trade In Evaluation", {"workflow_state": "Pronto para venda"}),
		route=["List", "Trade In Evaluation"],
		route_options={"workflow_state": "Pronto para venda"},
	)


@frappe.whitelist()
def low_stock_items():
	_ensure_operator()
	count = 0
	for profile in frappe.get_all(
		"TecPonto Item Profile",
		filters={"active": 1, "minimum_stock": [">", 0]},
		fields=["item", "default_warehouse", "minimum_stock"],
	):
		if not profile.default_warehouse:
			continue
		actual_qty = frappe.db.get_value(
			"Bin",
			{"item_code": profile.item, "warehouse": profile.default_warehouse},
			"actual_qty",
		) or 0
		if actual_qty < profile.minimum_stock:
			count += 1
	return _card(count, route=["List", "TecPonto Item Profile"])


@frappe.whitelist()
def open_cash_sessions():
	return _card(
		_count("TecPonto Cash Session", {"status": "Aberto"}),
		route=["List", "TecPonto Cash Session"],
		route_options={"status": "Aberto"},
	)


@frappe.whitelist()
def sales_today():
	return _card(
		_count("Sales Invoice", {"posting_date": nowdate(), "docstatus": ["<", 2]}),
		route=["List", "Sales Invoice"],
		route_options={"posting_date": nowdate()},
	)


@frappe.whitelist()
def pending_receivables():
	return _card(
		_count("Sales Invoice", {"docstatus": 1, "outstanding_amount": [">", 0]}),
		route=["List", "Sales Invoice"],
		route_options={"outstanding_amount": [">", 0]},
	)
