import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime


class TecPontoOperationsSettings(Document):
	def validate(self):
		if self.has_value_changed("used_fiscal_process_approved"):
			if self.used_fiscal_process_approved:
				if (
					frappe.session.user != "Administrator"
					and "TecPonto Direcao" not in frappe.get_roles()
				):
					frappe.throw(
						_("Somente a direção pode aprovar o processo fiscal."),
						frappe.PermissionError,
					)
				self.used_fiscal_approved_by = frappe.session.user
				self.used_fiscal_approved_at = now_datetime()
			else:
				self.auto_create_used_inventory = 0
				self.used_fiscal_approved_by = None
				self.used_fiscal_approved_at = None

		if self.auto_create_used_inventory and not self.used_fiscal_process_approved:
			frappe.throw(
				_("A automação de usados exige aprovação prévia do processo fiscal.")
			)

		if self.has_value_changed("finance_process_approved"):
			if self.finance_process_approved:
				if (
					frappe.session.user != "Administrator"
					and "TecPonto Direcao" not in frappe.get_roles()
				):
					frappe.throw(
						_("Somente a direção pode aprovar o processo financeiro."),
						frappe.PermissionError,
					)
				self.finance_approved_by = frappe.session.user
				self.finance_approved_at = now_datetime()
			else:
				self.cash_control_enabled = 0
				self.finance_approved_by = None
				self.finance_approved_at = None

		if self.cash_control_enabled and not self.finance_process_approved:
			frappe.throw(
				_("O controle de caixa exige aprovação do processo financeiro.")
			)
