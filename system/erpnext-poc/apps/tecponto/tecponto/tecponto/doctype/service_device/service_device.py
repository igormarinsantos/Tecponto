import re

import frappe
from frappe import _
from frappe.model.document import Document


class ServiceDevice(Document):
	def validate(self):
		if self.imei_serial:
			self.imei_serial = re.sub(r"[\s-]+", "", self.imei_serial).upper()
			duplicate = frappe.db.get_value(
				"Service Device",
				{"imei_serial": self.imei_serial, "name": ["!=", self.name or ""]},
				"name",
			)
			if duplicate:
				frappe.throw(
					_("Este IMEI ou número de série já está vinculado ao aparelho {0}.").format(
						duplicate
					)
				)
