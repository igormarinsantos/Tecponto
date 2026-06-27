import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import cint, flt


STOCK_TYPES = {"Aparelho", "Acessório", "Peça"}


class TecPontoItemProfile(Document):
	def validate(self):
		self.validate_minimum_stock()
		self.validate_item_configuration()

	def validate_minimum_stock(self):
		if flt(self.minimum_stock) < 0:
			frappe.throw(_("O estoque mínimo não pode ser negativo."))

	def validate_item_configuration(self):
		if not self.item:
			return
		item = frappe.get_doc("Item", self.item)
		has_ledger = frappe.db.exists("Stock Ledger Entry", {"item_code": self.item})

		if self.operational_type == "Serviço" and cint(item.is_stock_item):
			frappe.throw(_("Um serviço não pode controlar saldo de estoque."))

		if self.operational_type in STOCK_TYPES and not cint(item.is_stock_item):
			frappe.throw(_("Aparelhos, acessórios e peças precisam controlar estoque."))

		if self.operational_type == "Aparelho" and not cint(item.has_serial_no):
			if has_ledger:
				frappe.throw(
					_("Este aparelho já possui movimentações e não pode receber controle serial automaticamente.")
				)
			item.has_serial_no = 1
			item.serial_no_series = item.serial_no_series or "TEC-.YYYY.-.#####"
			item.save(ignore_permissions=True)
