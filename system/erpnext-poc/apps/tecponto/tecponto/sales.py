import frappe
from frappe import _
from frappe.utils import flt, nowdate


ALLOWED_ROLES = {
	"TecPonto Atendente",
	"TecPonto Tecnico",
	"TecPonto Gestor",
	"TecPonto Direcao",
}


def _ensure_sales_operator():
	if (
		frappe.session.user != "Administrator"
		and not ALLOWED_ROLES.intersection(frappe.get_roles())
	):
		frappe.throw(_("Você não pode iniciar vendas."), frappe.PermissionError)


def _payload(value):
	if isinstance(value, dict):
		return value
	return frappe.parse_json(value or "{}") or {}


def _item_context(item_code):
	profile = frappe.db.get_value(
		"TecPonto Item Profile",
		{"item": item_code, "active": 1},
		[
			"operational_type",
			"default_warehouse",
			"minimum_stock",
		],
		as_dict=True,
	)
	if not profile or profile.operational_type not in {"Aparelho", "Acessório"}:
		frappe.throw(_("Selecione um aparelho ou acessório liberado para venda."))

	item = frappe.db.get_value(
		"Item",
		item_code,
		["item_name", "disabled", "is_stock_item", "stock_uom"],
		as_dict=True,
	)
	if not item or item.disabled:
		frappe.throw(_("O item selecionado não está disponível."))

	price = frappe.db.get_value(
		"Item Price",
		{"item_code": item_code, "selling": 1},
		["price_list_rate", "currency", "price_list"],
		as_dict=True,
		order_by="modified desc",
	)
	if not price or flt(price.price_list_rate) <= 0:
		frappe.throw(_("Defina o preço de venda do item antes de continuar."))

	actual_qty = None
	if item.is_stock_item:
		bin_filters = {"item_code": item_code}
		if profile.default_warehouse:
			bin_filters["warehouse"] = profile.default_warehouse
		actual_qty = sum(
			flt(row.actual_qty)
			for row in frappe.get_all("Bin", filters=bin_filters, fields=["actual_qty"])
		)
	return {
		"item_code": item_code,
		"item_name": item.item_name,
		"operational_type": profile.operational_type,
		"warehouse": profile.default_warehouse,
		"stock_uom": item.stock_uom,
		"actual_qty": actual_qty,
		"rate": flt(price.price_list_rate),
		"currency": price.currency or "BRL",
		"price_list": price.price_list,
	}


@frappe.whitelist()
def get_sale_quote(item_code, qty=1):
	_ensure_sales_operator()
	qty = flt(qty)
	if qty <= 0:
		frappe.throw(_("A quantidade precisa ser maior que zero."))
	context = _item_context(item_code)
	if context["actual_qty"] is not None and qty > context["actual_qty"]:
		frappe.throw(_("Estoque insuficiente para essa quantidade."))
	context["qty"] = qty
	context["total"] = qty * context["rate"]
	return context


@frappe.whitelist()
def create_sale_draft(payload):
	"""Cria um rascunho de venda sem liberar o financeiro ao operador."""
	_ensure_sales_operator()
	data = _payload(payload)
	customer = data.get("customer")
	item_code = data.get("item_code")
	qty = flt(data.get("qty") or 1)
	if not customer or not frappe.db.exists("Customer", customer):
		frappe.throw(_("Selecione um cliente válido."))
	context = get_sale_quote(item_code, qty)

	company = frappe.defaults.get_global_default("company") or frappe.db.get_value(
		"Company", {}, "name"
	)
	if not company:
		frappe.throw(_("A empresa padrão não está configurada."))

	payment_method = (data.get("payment_method") or "A definir").strip()
	notes = (data.get("notes") or "").strip()
	invoice = frappe.get_doc(
		{
			"doctype": "Sales Invoice",
			"company": company,
			"customer": customer,
			"posting_date": nowdate(),
			"due_date": nowdate(),
			"selling_price_list": context["price_list"],
			"update_stock": 1,
			"remarks": (
				f"Venda iniciada por {frappe.session.user}. "
				f"Forma prevista: {payment_method}."
				+ (f" Observação: {notes}" if notes else "")
			),
			"items": [
				{
					"item_code": item_code,
					"qty": qty,
					"rate": context["rate"],
					"warehouse": context["warehouse"],
				}
			],
		}
	)
	invoice.insert(ignore_permissions=True)
	frappe.db.commit()
	can_open = (
		frappe.session.user == "Administrator"
		or "TecPonto Direcao" in frappe.get_roles()
	)
	return {
		"name": invoice.name,
		"customer": customer,
		"item_code": item_code,
		"grand_total": invoice.grand_total,
		"currency": invoice.currency,
		"status": "Rascunho",
		"can_open": can_open,
	}
