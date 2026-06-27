import frappe
from frappe import _
from frappe.utils import flt, now_datetime


IN_TYPES = {"Venda", "Recebimento", "Suprimento"}
OUT_TYPES = {"Sangria", "Estorno"}


def _ensure_direction():
	if (
		frappe.session.user != "Administrator"
		and "TecPonto Direcao" not in frappe.get_roles()
	):
		frappe.throw(_("Somente a direção pode operar o caixa."), frappe.PermissionError)


def _ensure_enabled():
	settings = frappe.get_single("TecPonto Operations Settings")
	if not settings.finance_process_approved or not settings.cash_control_enabled:
		frappe.throw(_("O controle de caixa ainda não foi aprovado e ativado."))


def _open_session():
	return frappe.db.get_value("TecPonto Cash Session", {"status": "Aberto"}, "name")


@frappe.whitelist()
def get_cash_status():
	_ensure_direction()
	settings = frappe.get_single("TecPonto Operations Settings")
	name = _open_session()
	return {
		"enabled": bool(settings.finance_process_approved and settings.cash_control_enabled),
		"session": name,
		"status": "Aberto" if name else "Fechado",
	}


@frappe.whitelist()
def open_cash(opening_amount=0):
	_ensure_direction()
	_ensure_enabled()
	if _open_session():
		frappe.throw(_("Já existe um caixa aberto."))
	amount = flt(opening_amount)
	if amount < 0:
		frappe.throw(_("O fundo inicial não pode ser negativo."))

	session = frappe.get_doc(
		{
			"doctype": "TecPonto Cash Session",
			"status": "Aberto",
			"opened_at": now_datetime(),
			"opened_by": frappe.session.user,
			"opening_amount": amount,
			"total_in": 0,
			"total_out": 0,
			"expected_amount": amount,
		}
	).insert(ignore_permissions=True)
	return {"name": session.name, "status": session.status}


@frappe.whitelist()
def register_movement(
	movement_type,
	payment_method,
	amount,
	direction=None,
	reference_doctype=None,
	reference_name=None,
	notes=None,
):
	_ensure_direction()
	_ensure_enabled()
	session_name = _open_session()
	if not session_name:
		frappe.throw(_("Abra o caixa antes de registrar movimentos."))

	amount = flt(amount)
	if amount <= 0:
		frappe.throw(_("O valor do movimento deve ser maior que zero."))
	if movement_type in IN_TYPES:
		direction = "Entrada"
	elif movement_type in OUT_TYPES:
		direction = "Saída"
	elif movement_type == "Ajuste" and direction not in {"Entrada", "Saída"}:
		frappe.throw(_("Informe se o ajuste é de entrada ou saída."))
	elif movement_type not in IN_TYPES | OUT_TYPES | {"Ajuste"}:
		frappe.throw(_("Tipo de movimento inválido."))

	if reference_name and not reference_doctype:
		frappe.throw(_("Informe o tipo do registro de referência."))
	if reference_doctype and reference_name and not frappe.db.exists(
		reference_doctype, reference_name
	):
		frappe.throw(_("O registro de referência não existe."))

	movement = frappe.get_doc(
		{
			"doctype": "TecPonto Cash Movement",
			"cash_session": session_name,
			"occurred_at": now_datetime(),
			"movement_type": movement_type,
			"direction": direction,
			"payment_method": payment_method,
			"amount": amount,
			"reference_doctype": reference_doctype,
			"reference_name": reference_name,
			"created_by": frappe.session.user,
			"notes": notes,
		}
	).insert(ignore_permissions=True)
	_refresh_totals(session_name)
	return {"name": movement.name, "cash_session": session_name}


def _refresh_totals(session_name):
	session = frappe.get_doc("TecPonto Cash Session", session_name)
	movements = frappe.get_all(
		"TecPonto Cash Movement",
		filters={"cash_session": session_name},
		fields=["direction", "amount"],
	)
	total_in = sum(flt(row.amount) for row in movements if row.direction == "Entrada")
	total_out = sum(flt(row.amount) for row in movements if row.direction == "Saída")
	expected = flt(session.opening_amount) + total_in - total_out
	frappe.db.set_value(
		"TecPonto Cash Session",
		session_name,
		{"total_in": total_in, "total_out": total_out, "expected_amount": expected},
	)
	return total_in, total_out, expected


@frappe.whitelist()
def close_cash(counted_amount, notes=None):
	_ensure_direction()
	_ensure_enabled()
	session_name = _open_session()
	if not session_name:
		frappe.throw(_("Não existe caixa aberto."))
	counted = flt(counted_amount)
	if counted < 0:
		frappe.throw(_("O valor contado não pode ser negativo."))

	total_in, total_out, expected = _refresh_totals(session_name)
	difference = counted - expected
	if difference and not notes:
		frappe.throw(_("Justifique a diferença antes de fechar o caixa."))
	frappe.db.set_value(
		"TecPonto Cash Session",
		session_name,
		{
			"status": "Fechado",
			"closed_at": now_datetime(),
			"closed_by": frappe.session.user,
			"total_in": total_in,
			"total_out": total_out,
			"expected_amount": expected,
			"counted_amount": counted,
			"difference": difference,
			"notes": notes,
		},
	)
	return {
		"name": session_name,
		"status": "Fechado",
		"expected_amount": expected,
		"counted_amount": counted,
		"difference": difference,
	}
