import re

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now_datetime


class TecPontoContactPreference(Document):
	def validate(self):
		self.normalize_whatsapp()
		self.set_consent_milestones()

	def normalize_whatsapp(self):
		if not self.whatsapp_number:
			return
		digits = re.sub(r"\D+", "", self.whatsapp_number)
		if len(digits) in {10, 11}:
			digits = f"55{digits}"
		if len(digits) not in {12, 13} or not digits.startswith("55"):
			frappe.throw(_("Informe um WhatsApp brasileiro válido com DDD."))
		self.whatsapp_number = digits

	def set_consent_milestones(self):
		if self.has_value_changed("operational_messages"):
			if self.operational_messages:
				self.operational_consent_at = now_datetime()
			else:
				self.operational_opt_out_at = now_datetime()
		if self.has_value_changed("marketing_messages"):
			if self.marketing_messages:
				self.marketing_consent_at = now_datetime()
			else:
				self.marketing_opt_out_at = now_datetime()
