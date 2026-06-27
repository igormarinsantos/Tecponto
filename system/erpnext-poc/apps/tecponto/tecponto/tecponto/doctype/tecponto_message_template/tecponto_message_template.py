import frappe
from frappe import _
from frappe.model.document import Document


class TecPontoMessageTemplate(Document):
	def validate(self):
		if self.approved and not self.provider_template_id:
			frappe.throw(_("Informe o identificador aprovado pelo provedor."))
