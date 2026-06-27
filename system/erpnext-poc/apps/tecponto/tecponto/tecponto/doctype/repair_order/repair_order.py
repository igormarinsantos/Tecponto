import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import (
	add_days,
	add_to_date,
	cint,
	flt,
	get_datetime,
	getdate,
	now_datetime,
	time_diff_in_hours,
)


APPROVED_STATES = {
	"Aprovado",
	"Aguardando peca",
	"Em reparo",
	"Em testes",
	"Pronto para retirada",
	"Entregue",
}
TESTED_STATES = {"Pronto para retirada", "Entregue"}
CLOSED_STATES = {"Entregue", "Rejeitado", "Sem conserto", "Cancelado"}


class RepairOrder(Document):
	def before_insert(self):
		settings = frappe.get_single("TecPonto Operations Settings")
		self.warranty_days = self.warranty_days or settings.default_service_warranty_days or 90
		self.parts_warranty_days = (
			self.parts_warranty_days or settings.default_parts_warranty_days or 90
		)
		if not self.promised_at and self.intake_at:
			self.promised_at = add_to_date(
				get_datetime(self.intake_at),
				hours=cint(settings.default_repair_deadline_hours or 48),
			)

	def validate(self):
		self.calculate_totals()
		self.validate_device_customer()
		self.validate_intake_requirements()
		self.validate_service_relationship()
		self.validate_deadline()
		self.validate_third_party_service()
		self.validate_process_requirements()
		self.set_milestones()
		self.set_sla_status()
		self.set_closure_outcome()

	def validate_intake_requirements(self):
		if not self.intake_front_photo or not str(self.intake_front_photo).strip():
			frappe.throw(_("A foto frontal do aparelho é obrigatória para registrar a entrada."))
		if not self.intake_back_photo or not str(self.intake_back_photo).strip():
			frappe.throw(_("A foto traseira do aparelho é obrigatória para registrar a entrada."))
		if self.device:
			imei = frappe.db.get_value("Service Device", self.device, "imei_serial")
			if not imei or not str(imei).strip():
				frappe.throw(_("O aparelho selecionado precisa ter o IMEI ou Número de Série cadastrado para iniciar o atendimento."))

	def calculate_totals(self):
		total = 0
		for row in self.items:
			row.qty = flt(row.qty)
			row.rate = flt(row.rate)
			row.amount = row.qty * row.rate
			total += row.amount
		self.estimated_total = total

	def validate_device_customer(self):
		if not self.device or not self.customer:
			return
		device_customer = frappe.db.get_value("Service Device", self.device, "customer")
		if device_customer != self.customer:
			frappe.throw(_("O aparelho selecionado pertence a outro cliente."))

	def validate_service_relationship(self):
		if self.service_type not in {"Garantia", "Retrabalho"}:
			self.original_repair_order = None
			return
		if not self.original_repair_order:
			frappe.throw(_("Informe a ordem de serviço original."))
		if self.original_repair_order == self.name:
			frappe.throw(_("Uma ordem não pode ser vinculada a ela mesma."))

		original = frappe.get_doc("Repair Order", self.original_repair_order)
		if original.workflow_state != "Entregue":
			frappe.throw(_("A ordem original precisa estar entregue."))
		if original.customer != self.customer or original.device != self.device:
			frappe.throw(
				_("A ordem original deve pertencer ao mesmo cliente e aparelho.")
			)

		if self.service_type == "Garantia":
			warranty_dates = [
				getdate(value)
				for value in (original.warranty_until, original.parts_warranty_until)
				if value
			]
			if warranty_dates and getdate() > max(warranty_dates):
				frappe.throw(_("A garantia da ordem original já terminou."))

	def validate_deadline(self):
		if not self.promised_at or not self.intake_at:
			return
		if get_datetime(self.promised_at) < get_datetime(self.intake_at):
			frappe.throw(_("O prazo prometido não pode ser anterior à entrada."))

	def validate_third_party_service(self):
		if not self.third_party_service:
			self.third_party_supplier = None
			self.third_party_cost = 0
			return
		if not self.third_party_supplier:
			frappe.throw(_("Informe o terceiro responsável pelo serviço."))

	def validate_process_requirements(self):
		state = self.workflow_state or "Recebido"

		if state not in {
			"Recebido",
			"Em diagnostico",
			"Rejeitado",
			"Sem conserto",
			"Cancelado",
		}:
			if not self.diagnosis:
				frappe.throw(_("Registre o diagnóstico antes de avançar a ordem de serviço."))
			if not self.items:
				frappe.throw(_("Inclua ao menos um serviço ou peça no orçamento."))

		if state == "Aguardando peca":
			if not self.waiting_part_details:
				frappe.throw(_("Informe qual peça ou impedimento está bloqueando o reparo."))
			if not self.part_expected_at:
				frappe.throw(_("Informe a previsão da peça antes de aguardar."))

		if state == "Sem conserto":
			if not self.diagnosis:
				frappe.throw(_("Registre o diagnóstico antes de encerrar sem conserto."))
			if not self.no_repair_reason:
				frappe.throw(_("Informe por que o aparelho ficou sem conserto."))

		if state in APPROVED_STATES and self.approval_status != "Aprovado":
			frappe.throw(_("A aprovação do cliente é obrigatória antes do reparo."))

		if state in TESTED_STATES:
			if not self.solution:
				frappe.throw(_("Registre a solução executada antes de liberar o aparelho."))
			if not self.tests:
				frappe.throw(_("Registre os testes técnicos antes de liberar o aparelho."))
			failed = [row.test_name for row in self.tests if row.result != "Aprovado"]
			if failed:
				frappe.throw(
					_("Todos os testes precisam estar aprovados. Pendências: {0}").format(
						", ".join(failed)
					)
				)
			pending_parts = [
				row.item_code
				for row in self.items
				if cint(row.is_stock_item) and flt(row.consumed_qty) < flt(row.qty)
			]
			if pending_parts:
				# Tentar consumir automaticamente primeiro se houver transição
				if self.is_new() or self.has_value_changed("workflow_state"):
					try:
						self.auto_consume_parts()
						pending_parts = [
							row.item_code
							for row in self.items
							if cint(row.is_stock_item) and flt(row.consumed_qty) < flt(row.qty)
						]
					except Exception as e:
						frappe.throw(_("Erro na baixa automática de estoque: {0}").format(str(e)))
				
				if pending_parts:
					frappe.throw(
						_("Dê baixa nas peças antes de liberar o aparelho: {0}").format(
							", ".join(pending_parts)
						)
					)

	def set_milestones(self):
		state = self.workflow_state or "Recebido"
		if self.is_new() and not self.stage_changed_at:
			self.stage_changed_at = now_datetime()
		elif self.has_value_changed("workflow_state"):
			self.stage_changed_at = now_datetime()
		if state == "Em diagnostico" and not self.diagnosis_started_at:
			self.diagnosis_started_at = now_datetime()
		if state == "Aguardando aprovacao" and not self.diagnosis_completed_at:
			self.diagnosis_completed_at = now_datetime()
		if state == "Aprovado" and not self.approval_at:
			self.approval_at = now_datetime()
		if state == "Em reparo" and not self.repair_started_at:
			self.repair_started_at = now_datetime()
		if state == "Aguardando peca" and not self.waiting_parts_started_at:
			self.waiting_parts_started_at = now_datetime()
		if state == "Em testes" and not self.tests_started_at:
			self.tests_started_at = now_datetime()
		if state == "Pronto para retirada" and not self.ready_at:
			self.ready_at = now_datetime()
		if state == "Entregue":
			if not self.delivered_at:
				self.delivered_at = now_datetime()
			self.warranty_until = add_days(getdate(self.delivered_at), cint(self.warranty_days or 0))
			self.parts_warranty_until = add_days(
				getdate(self.delivered_at), cint(self.parts_warranty_days or 0)
			)

	def set_sla_status(self):
		if self.workflow_state in CLOSED_STATES:
			self.sla_status = "Concluído"
			return
		if not self.promised_at:
			self.sla_status = None
			return

		hours_remaining = time_diff_in_hours(
			get_datetime(self.promised_at), now_datetime()
		)
		if hours_remaining < 0:
			self.sla_status = "Atrasado"
		elif hours_remaining <= 4:
			self.sla_status = "Vence em breve"
		else:
			self.sla_status = "No prazo"

	def set_closure_outcome(self):
		outcomes = {
			"Entregue": "Consertado",
			"Sem conserto": "Sem conserto",
			"Rejeitado": "Orçamento recusado",
			"Cancelado": "Cancelado",
		}
		self.closure_outcome = outcomes.get(self.workflow_state)

	def auto_consume_parts(self):
		stock_rows = [
			row
			for row in self.items
			if cint(row.is_stock_item) and flt(row.qty) > flt(row.consumed_qty)
		]
		if not stock_rows:
			return

		for row in stock_rows:
			if not row.warehouse:
				frappe.throw(_("Depósito não informado para o item {0}").format(row.item_code))

		entry = frappe.get_doc(
			{
				"doctype": "Stock Entry",
				"stock_entry_type": "Material Issue",
				"company": self.company,
				"remarks": _("Baixa automática OS {0}").format(self.name or _("Nova")),
			}
		)
		for row in stock_rows:
			entry.append(
				"items",
				{
					"item_code": row.item_code,
					"s_warehouse": row.warehouse,
					"qty": flt(row.qty) - flt(row.consumed_qty),
				},
			)

		entry.insert(ignore_permissions=True)
		entry.submit()
		for row in stock_rows:
			row.consumed_qty = flt(row.qty)
		self.parts_stock_entry = entry.name



@frappe.whitelist()
def consume_parts(repair_order):
	allowed_roles = {"TecPonto Tecnico", "TecPonto Gestor", "TecPonto Direcao"}
	if (
		frappe.session.user != "Administrator"
		and not allowed_roles.intersection(frappe.get_roles())
	):
		frappe.throw(_("Você não tem permissão para baixar peças."), frappe.PermissionError)

	order = frappe.get_doc("Repair Order", repair_order)
	order.check_permission("write")
	if order.workflow_state not in APPROVED_STATES:
		frappe.throw(_("As peças só podem ser baixadas após a aprovação."))

	if order.parts_stock_entry:
		docstatus = frappe.db.get_value("Stock Entry", order.parts_stock_entry, "docstatus")
		if docstatus is not None and cint(docstatus) != 2:
			return {"name": order.parts_stock_entry, "created": False}

	stock_rows = [
		row
		for row in order.items
		if cint(row.is_stock_item) and flt(row.qty) > flt(row.consumed_qty)
	]
	if not stock_rows:
		frappe.throw(_("Não há peças pendentes de baixa nesta ordem."))

	entry = frappe.get_doc(
		{
			"doctype": "Stock Entry",
			"stock_entry_type": "Material Issue",
			"company": order.company,
			"remarks": _("Consumo de peças da ordem de serviço {0}").format(order.name),
		}
	)
	for source_row in stock_rows:
		if not source_row.warehouse:
			frappe.throw(
				_("Informe o depósito da peça {0}.").format(source_row.item_code)
			)
		entry.append(
			"items",
			{
				"item_code": source_row.item_code,
				"s_warehouse": source_row.warehouse,
				"qty": flt(source_row.qty) - flt(source_row.consumed_qty),
			},
		)

	entry.insert(ignore_permissions=True)
	entry.submit()
	for source_row in stock_rows:
		frappe.db.set_value(
			"Repair Order Item",
			source_row.name,
			"consumed_qty",
			flt(source_row.qty),
			update_modified=False,
		)
	order.db_set("parts_stock_entry", entry.name)
	return {"name": entry.name, "created": True}


@frappe.whitelist()
def create_sales_invoice(repair_order):
	if (
		frappe.session.user != "Administrator"
		and "TecPonto Direcao" not in frappe.get_roles()
	):
		frappe.throw(
			_("Somente a direção pode criar ou acessar o faturamento."),
			frappe.PermissionError,
		)

	order = frappe.get_doc("Repair Order", repair_order)
	order.check_permission("write")

	if order.approval_status != "Aprovado":
		frappe.throw(_("O orçamento precisa estar aprovado antes do faturamento."))
	if not order.items:
		frappe.throw(_("A ordem de serviço não possui itens para faturar."))

	if order.sales_invoice:
		docstatus = frappe.db.get_value("Sales Invoice", order.sales_invoice, "docstatus")
		if docstatus is not None and cint(docstatus) != 2:
			return {"name": order.sales_invoice, "created": False}

	invoice = frappe.new_doc("Sales Invoice")
	invoice.customer = order.customer
	invoice.company = order.company
	invoice.remarks = _("Gerada pela ordem de serviço {0}").format(order.name)

	for source_row in order.items:
		is_stock_item = cint(frappe.db.get_value("Item", source_row.item_code, "is_stock_item"))
		if is_stock_item and not source_row.warehouse:
			frappe.throw(
				_("Informe o depósito do item de estoque {0}.").format(source_row.item_code)
			)

		row = invoice.append(
			"items",
			{
				"item_code": source_row.item_code,
				"qty": source_row.qty,
				"rate": source_row.rate,
				"warehouse": source_row.warehouse if is_stock_item else None,
			},
		)
		row.description = source_row.description or row.description

	invoice.set_missing_values()
	invoice.insert()
	order.db_set("sales_invoice", invoice.name)
	return {"name": invoice.name, "created": True}
