import re

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import cint, flt, now_datetime


VALUED_STATES = {
	"Oferta pendente",
	"Oferta apresentada",
	"Oferta aceita",
	"Oferta recusada",
	"Aquisicao aprovada",
	"Em revisao",
	"Pronto para venda",
	"Encerrado",
}
ACQUISITION_STATES = {"Aquisicao aprovada", "Em revisao", "Pronto para venda"}


class TradeInEvaluation(Document):
	def validate(self):
		self.calculate_values()
		self.validate_device_customer()
		self.validate_process_requirements()
		self.set_milestones()
		self.set_imei_milestone()

	def on_update(self):
		if (
			self.workflow_state == "Aquisicao aprovada"
			and self.has_value_changed("workflow_state")
			and not self.stock_entry
		):
			settings = frappe.get_single("TecPonto Operations Settings")
			if cint(settings.used_fiscal_process_approved) and cint(
				settings.auto_create_used_inventory
			):
				frappe.enqueue(
					"tecponto.tecponto.doctype.trade_in_evaluation.trade_in_evaluation.create_used_inventory_internal",
					trade_in_evaluation=self.name,
					queue="short",
					enqueue_after_commit=True,
				)

	def calculate_values(self):
		resale = flt(self.expected_resale_value)
		refurbishment = flt(self.refurbishment_cost)
		offer = flt(self.offered_value)
		self.expected_margin_value = resale - refurbishment - offer
		self.expected_margin_percent = (
			(self.expected_margin_value / resale) * 100 if resale else 0
		)
		self.customer_difference = flt(self.desired_item_price) - offer
		self.final_acquisition_cost = offer + flt(
			self.actual_refurbishment_cost or self.refurbishment_cost
		)

	def validate_device_customer(self):
		if not self.device or not self.customer:
			return
		device_customer = frappe.db.get_value("Service Device", self.device, "customer")
		if device_customer != self.customer:
			frappe.throw(_("O aparelho selecionado pertence a outro cliente."))

	def validate_process_requirements(self):
		state = self.workflow_state or "Triagem de troca"

		if state in VALUED_STATES:
			if not self.checklist:
				frappe.throw(_("Preencha o checklist antes de preparar a oferta."))
			pending = [row.check_name for row in self.checklist if row.result == "Pendente"]
			if pending:
				frappe.throw(
					_("Conclua todos os itens do checklist. Pendências: {0}").format(
						", ".join(pending)
					)
				)
			if flt(self.expected_resale_value) <= 0 or flt(self.offered_value) <= 0:
				frappe.throw(_("Informe os valores de revenda e da oferta antes de avançar."))
			if self.imei_check_status == "Pendente":
				frappe.throw(_("Conclua a consulta do IMEI antes de preparar a oferta."))
			if (
				flt(self.expected_margin_percent) < flt(self.target_margin_percent)
				and not self.margin_override_approved
			):
				frappe.throw(
					_("A margem prevista está abaixo da meta. Um gestor deve aprovar a exceção.")
				)
			if self.margin_override_approved and not self.margin_override_reason:
				frappe.throw(_("Justifique a aprovação de margem excepcional."))

		if state in ACQUISITION_STATES:
			if self.offer_status != "Aceita":
				frappe.throw(_("A oferta precisa estar aceita antes de aprovar a aquisição."))
			if self.imei_check_status != "Regular":
				frappe.throw(_("A aquisição exige IMEI com situação regular."))
			if not self.account_lock_removed:
				frappe.throw(_("Confirme a remoção do bloqueio de conta do aparelho."))
			if not self.ownership_confirmed:
				frappe.throw(_("Confirme a propriedade do aparelho antes da aquisição."))
			if not self.seller_declaration_accepted:
				frappe.throw(_("Registre o aceite da declaração do vendedor."))

		if state == "Pronto para venda" and not self.warehouse:
			frappe.throw(_("Informe o depósito antes de liberar o aparelho para venda."))
		if state == "Pronto para venda":
			settings = frappe.get_single("TecPonto Operations Settings")
			if cint(settings.used_fiscal_process_approved) and not self.stock_entry:
				frappe.throw(_("Crie a entrada fiscal e de estoque antes de liberar para venda."))

	def set_milestones(self):
		state = self.workflow_state or "Triagem de troca"
		if state == "Oferta apresentada" and not self.offer_at:
			self.offer_at = now_datetime()
		if state == "Oferta aceita" and not self.accepted_at:
			self.accepted_at = now_datetime()
		if state == "Aquisicao aprovada" and not self.acquired_at:
			self.acquired_at = now_datetime()
		if state == "Pronto para venda" and not self.ready_at:
			self.ready_at = now_datetime()

	def set_imei_milestone(self):
		if self.imei_check_status != "Pendente" and not self.imei_checked_at:
			self.imei_checked_at = now_datetime()


def _safe_item_code(device):
	base = f"USADO-{device.brand or 'SEM-MARCA'}-{device.model or 'SEM-MODELO'}"
	base = re.sub(r"[^A-Z0-9]+", "-", base.upper()).strip("-")
	serial = re.sub(r"[^A-Za-z0-9]+", "", device.imei_serial or device.name)
	return f"{base[:110]}-{serial[-12:]}"


@frappe.whitelist()
def create_used_inventory(trade_in_evaluation):
	if (
		frappe.session.user != "Administrator"
		and "TecPonto Direcao" not in frappe.get_roles()
	):
		frappe.throw(
			_("Somente a direção pode criar a entrada do aparelho usado."),
			frappe.PermissionError,
		)
	return create_used_inventory_internal(trade_in_evaluation)


def create_used_inventory_internal(trade_in_evaluation):
	trade = frappe.get_doc("Trade In Evaluation", trade_in_evaluation)
	settings = frappe.get_single("TecPonto Operations Settings")
	if not cint(settings.used_fiscal_process_approved):
		frappe.throw(_("O processo fiscal de usados ainda não foi aprovado."))
	if not cint(settings.auto_create_used_inventory):
		frappe.throw(_("A criação automática de estoque está desativada."))
	if trade.workflow_state not in {"Aquisicao aprovada", "Em revisao", "Pronto para venda"}:
		frappe.throw(_("A aquisição precisa estar aprovada antes da entrada em estoque."))
	if trade.stock_entry:
		return {"name": trade.stock_entry, "item": trade.stock_item, "serial_no": trade.serial_no, "created": False}
	if not trade.warehouse:
		frappe.throw(_("Informe o depósito de destino."))

	device = frappe.get_doc("Service Device", trade.device)
	if not device.imei_serial:
		frappe.throw(_("O aparelho usado precisa possuir IMEI ou número de série."))
	item_code = _safe_item_code(device)
	if not frappe.db.exists("Item", item_code):
		frappe.get_doc(
			{
				"doctype": "Item",
				"item_code": item_code,
				"item_name": f"{device.brand or ''} {device.model or ''} usado".strip(),
				"item_group": "Products",
				"stock_uom": "Nos",
				"is_stock_item": 1,
				"has_serial_no": 1,
			}
		).insert(ignore_permissions=True)

	if not frappe.db.exists("TecPonto Item Profile", item_code):
		frappe.get_doc(
			{
				"doctype": "TecPonto Item Profile",
				"item": item_code,
				"operational_type": "Aparelho",
				"quality_level": "Usado",
				"brand_name": device.brand,
				"model_name": device.model,
				"minimum_stock": 0,
				"default_warehouse": trade.warehouse,
				"active": 1,
			}
		).insert(ignore_permissions=True)

	serial_value = re.sub(r"[^A-Za-z0-9-]+", "", device.imei_serial)
	entry = frappe.get_doc(
		{
			"doctype": "Stock Entry",
			"stock_entry_type": "Material Receipt",
			"company": trade.company,
			"remarks": _("Aquisição do aparelho usado pela avaliação {0}").format(trade.name),
			"items": [
				{
					"item_code": item_code,
					"t_warehouse": trade.warehouse,
					"qty": 1,
					"basic_rate": flt(trade.final_acquisition_cost or trade.offered_value),
					"serial_no": serial_value,
				}
			],
		}
	).insert(ignore_permissions=True)
	entry.submit()

	serial_name = frappe.db.get_value("Serial No", {"serial_no": serial_value}, "name") or serial_value
	frappe.db.set_value(
		"Trade In Evaluation",
		trade.name,
		{
			"stock_item": item_code,
			"serial_no": serial_name,
			"stock_entry": entry.name,
			"final_acquisition_cost": flt(trade.final_acquisition_cost or trade.offered_value),
		},
	)
	return {"name": entry.name, "item": item_code, "serial_no": serial_name, "created": True}
