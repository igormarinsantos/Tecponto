import os

import frappe
from frappe.utils import now_datetime
from frappe.utils.password import update_password


PILOT_USERS = (
	("gestor@tecponto.local", "Gestor TecPonto", "TecPonto Gestor", "TECPONTO_GESTOR_PASSWORD"),
	(
		"direcao@tecponto.local",
		"Direcao TecPonto",
		"TecPonto Direcao",
		"TECPONTO_DIRECAO_PASSWORD",
	),
	(
		"atendente@tecponto.local",
		"Atendente TecPonto",
		"TecPonto Atendente",
		"TECPONTO_ATENDENTE_PASSWORD",
	),
	("tecnico@tecponto.local", "Tecnico TecPonto", "TecPonto Tecnico", "TECPONTO_TECNICO_PASSWORD"),
)

POC_INTAKE_PHOTO = "/assets/tecponto/images/favicon.svg"

MODULE_PROFILES = {
	"TecPonto Atendimento": {"CRM", "Selling", "Setup", "Stock"},
	"TecPonto Oficina": {"CRM", "Selling", "Setup", "Stock"},
	"TecPonto Gestao": {"Buying", "CRM", "Selling", "Setup", "Stock"},
	"TecPonto Direcao": {"Accounts", "Buying", "CRM", "Selling", "Setup", "Stock"},
}

ROLE_MODULE_PROFILES = {
	"TecPonto Atendente": "TecPonto Atendimento",
	"TecPonto Tecnico": "TecPonto Oficina",
	"TecPonto Gestor": "TecPonto Gestao",
	"TecPonto Direcao": "TecPonto Direcao",
}

TECPONTO_ROLES = tuple(ROLE_MODULE_PROFILES)
ADDITIONAL_ROLES = {
	"TecPonto Direcao": ("TecPonto Gestor",),
}

PERMISSION_FIELDS = (
	"read",
	"write",
	"create",
	"delete",
	"submit",
	"cancel",
	"amend",
	"report",
	"export",
	"import",
	"share",
	"print",
	"email",
)

STANDARD_PERMISSIONS = {
	"Company": {
		"TecPonto Atendente": {"read": 1},
		"TecPonto Tecnico": {"read": 1},
		"TecPonto Gestor": {"read": 1},
		"TecPonto Direcao": {"read": 1},
	},
	"Customer": {
		"TecPonto Atendente": {"read": 1, "write": 1, "create": 1, "report": 1, "print": 1},
		"TecPonto Tecnico": {"read": 1, "report": 1},
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "delete": 1, "report": 1, "export": 1, "share": 1, "print": 1, "email": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "report": 1, "export": 1, "share": 1, "print": 1, "email": 1},
	},
	"Item": {
		"TecPonto Atendente": {"read": 1, "report": 1},
		"TecPonto Tecnico": {"read": 1, "report": 1},
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "delete": 1, "report": 1, "export": 1, "import": 1, "print": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "report": 1, "export": 1, "import": 1, "print": 1},
	},
	"Warehouse": {
		"TecPonto Atendente": {"read": 1},
		"TecPonto Tecnico": {"read": 1},
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "report": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "report": 1},
	},
	"Sales Invoice": {
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "export": 1, "share": 1, "print": 1, "email": 1},
	},
	"Supplier": {
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "delete": 1, "report": 1, "export": 1, "share": 1, "print": 1, "email": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "report": 1, "export": 1, "share": 1, "print": 1, "email": 1},
	},
	"Stock Entry": {
		"TecPonto Tecnico": {"read": 1, "report": 1},
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "export": 1, "print": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "export": 1, "print": 1},
	},
	"Serial No": {
		"TecPonto Atendente": {"read": 1},
		"TecPonto Tecnico": {"read": 1, "write": 1, "report": 1},
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "report": 1, "export": 1, "print": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "report": 1, "export": 1, "print": 1},
	},
	"Item Price": {
		"TecPonto Atendente": {"read": 1},
		"TecPonto Tecnico": {"read": 1},
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "delete": 1, "report": 1, "export": 1, "import": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "report": 1, "export": 1, "import": 1},
	},
	"Price List": {
		"TecPonto Atendente": {"read": 1},
		"TecPonto Tecnico": {"read": 1},
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1},
	},
	"Stock Ledger Entry": {
		"TecPonto Gestor": {"read": 1, "report": 1, "export": 1},
		"TecPonto Direcao": {"read": 1, "report": 1, "export": 1},
	},
	"Bin": {
		"TecPonto Gestor": {"read": 1, "report": 1, "export": 1},
		"TecPonto Direcao": {"read": 1, "report": 1, "export": 1},
	},
	"Material Request": {
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "print": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "print": 1},
	},
	"Purchase Order": {
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "print": 1, "email": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "print": 1, "email": 1},
	},
	"Purchase Receipt": {
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "print": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "print": 1},
	},
	"Stock Reconciliation": {
		"TecPonto Gestor": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "print": 1},
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "print": 1},
	},
	"Purchase Invoice": {
		"TecPonto Direcao": {"read": 1, "write": 1, "create": 1, "delete": 1, "submit": 1, "cancel": 1, "amend": 1, "report": 1, "export": 1, "print": 1},
	},
	"Page": {
		"TecPonto Atendente": {"read": 1},
		"TecPonto Tecnico": {"read": 1},
		"TecPonto Gestor": {"read": 1},
		"TecPonto Direcao": {"read": 1},
	},
}


@frappe.whitelist()
def configure_erpnext():
	"""Conclui o assistente do ERPNext de forma idempotente para o POC local."""
	created = False
	if not frappe.db.exists("Company", "TecPonto POC"):
		from erpnext.setup.setup_wizard.setup_wizard import setup_complete

		args = frappe._dict(
			{
				"country": "Brazil",
				"company_name": "TecPonto POC",
				"company_abbr": "TP",
				"currency": "BRL",
				"chart_of_accounts": "Standard",
				"domain": "Retail",
				"fy_start_date": "2026-01-01",
				"fy_end_date": "2026-12-31",
			}
		)
		setup_complete(args)
		created = True

	mark_setup_complete()
	frappe.db.commit()
	return {"company": "TecPonto POC", "created": created, "setup_complete": True}


def mark_setup_complete():
	"""Marca os apps obrigatorios conforme o mecanismo nativo do Frappe 16."""
	installed_apps = frappe.get_single("Installed Applications")
	installed_apps.update_versions()
	for app_name in ("frappe", "erpnext"):
		frappe.db.set_value(
			"Installed Application",
			{"app_name": app_name},
			"is_setup_complete",
			1,
			update_modified=False,
		)
	frappe.db.set_single_value("System Settings", "setup_complete", 1)
	frappe.clear_cache()


@frappe.whitelist()
def configure_poc():
	"""Cria somente cadastros demonstrativos necessarios para validar o fluxo local."""
	frappe.db.set_single_value("System Settings", "language", "pt-BR")
	frappe.db.set_single_value("System Settings", "time_zone", "America/Sao_Paulo")
	frappe.db.set_single_value(
		"Stock Settings", "enable_serial_and_batch_no_for_item", 1
	)
	frappe.db.set_value(
		"User",
		"Administrator",
		{"language": "pt-BR", "time_zone": "America/Sao_Paulo"},
		update_modified=False,
	)
	configure_branding()
	ensure_standard_permissions()
	ensure_report_access("Stock Balance", ("TecPonto Gestor", "TecPonto Direcao"))
	ensure_module_profiles()
	pilot_users = ensure_pilot_users()

	company = frappe.defaults.get_global_default("company") or frappe.db.get_value("Company", {}, "name")
	if not company:
		frappe.throw("Empresa do POC ainda nao foi configurada.")

	warehouses = ensure_operational_warehouses(company)
	ensure_items()
	supplier = ensure_demo_supplier()
	ensure_item_profiles(warehouses, supplier)
	ensure_demo_stock(company, warehouses["parts"])
	ensure_demo_retail_stock(company, warehouses["retail"])
	ensure_demo_selling_prices()
	customer = ensure_demo_customer()
	ensure_contact_preference(customer)
	ensure_message_templates()
	ensure_privacy_settings()
	device = ensure_demo_device(customer)
	repair_order = ensure_demo_repair_order(
		company, customer, device, warehouses["parts"]
	)
	trade_device = ensure_demo_trade_device(customer)
	trade_in_evaluation = ensure_demo_trade_in_evaluation(
		company, customer, trade_device, warehouses["used_review"]
	)
	backfill_role_based_ux_data()

	frappe.db.commit()
	return {
		"company": company,
		"warehouse": warehouses["parts"],
		"warehouses": warehouses,
		"supplier": supplier,
		"customer": customer,
		"device": device,
		"repair_order": repair_order,
		"trade_device": trade_device,
		"trade_in_evaluation": trade_in_evaluation,
		"pilot_users": pilot_users,
	}


def ensure_privacy_settings():
	"""Mantém proteção conservadora e prazos explícitos; nunca ativa descarte automático."""
	mandatory = {
		"enforce_private_sensitive_files": 1,
		"direction_mfa_required": 1,
		"automatic_deletion_enabled": 0,
	}
	for fieldname, value in mandatory.items():
		frappe.db.set_single_value("TecPonto Privacy Settings", fieldname, value)

	retention_defaults = {
		"photo_retention_days": 365,
		"event_payload_retention_days": 180,
		"inactive_customer_review_days": 730,
	}
	for fieldname, default in retention_defaults.items():
		current = int(frappe.db.get_single_value("TecPonto Privacy Settings", fieldname) or 0)
		if current < 30:
			frappe.db.set_single_value("TecPonto Privacy Settings", fieldname, default)


def configure_branding():
	"""Aplica os ativos e tokens oficiais da TecPonto ao site e ao Desk."""
	logo = "/assets/tecponto/images/tecponto-logo.png"
	favicon = "/assets/tecponto/images/favicon.svg"
	brand_html = (
		f'<img src="{logo}" alt="TecPonto" style="width: 180px; max-height: 42px; object-fit: contain;">'
	)

	frappe.db.set_single_value("System Settings", "app_name", "TecPonto")
	frappe.db.set_single_value("System Settings", "default_app", "tecponto")
	frappe.db.set_single_value("System Settings", "login_with_email_link", 0)
	for fieldname, value in {
		"app_name": "TecPonto",
		"app_logo": logo,
		"favicon": favicon,
		"brand_html": brand_html,
		"disable_signup": 1,
		"show_footer_on_login": 0,
		"hide_footer_signup": 1,
		"footer_powered": 0,
		"splash_image": favicon,
	}.items():
		frappe.db.set_single_value("Website Settings", fieldname, value)

	frappe.db.set_single_value("Navbar Settings", "app_logo", favicon)
	frappe.clear_cache()


def ensure_pilot_users():
	"""Cria usuarios locais por funcao; as senhas permanecem apenas no .env ignorado."""
	created_users = []
	for email, first_name, role, environment_key in PILOT_USERS:
		password = os.environ.get(environment_key)
		module_profile = ROLE_MODULE_PROFILES[role]
		if not password:
			frappe.throw(f"Variavel local ausente para o usuario {email}: {environment_key}")

		if frappe.db.exists("User", email):
			user = frappe.get_doc("User", email)
			user.enabled = 1
			user.user_type = "System User"
			user.language = "pt-BR"
			user.time_zone = "America/Sao_Paulo"
			user.default_app = "tecponto"
			user.default_workspace = "TecPonto"
			user.module_profile = module_profile
			expected_roles = {role, "All", *ADDITIONAL_ROLES.get(role, ())}
			preserved_roles = {
				row.role for row in user.roles if row.role not in TECPONTO_ROLES
			}
			user.set(
				"roles",
				[{"role": value} for value in sorted(preserved_roles | expected_roles)],
			)
			user.save(ignore_permissions=True)
		else:
			expected_roles = {role, "All", *ADDITIONAL_ROLES.get(role, ())}
			user = frappe.get_doc(
				{
					"doctype": "User",
					"email": email,
					"first_name": first_name,
					"enabled": 1,
					"user_type": "System User",
					"language": "pt-BR",
					"time_zone": "America/Sao_Paulo",
					"default_app": "tecponto",
					"default_workspace": "TecPonto",
					"module_profile": module_profile,
					"send_welcome_email": 0,
					"new_password": password,
					"roles": [{"role": value} for value in sorted(expected_roles)],
				}
			).insert(ignore_permissions=True)

		update_password(email, password, logout_all_sessions=False)
		created_users.append({"email": email, "role": role})

	frappe.clear_cache()
	return created_users


def ensure_module_profiles():
	"""Bloqueia módulos genéricos do ERPNext sem afetar o núcleo técnico do Frappe."""
	erpnext_modules = set(
		frappe.get_all("Module Def", filters={"app_name": "erpnext"}, pluck="name")
	)
	for profile_name, allowed_modules in MODULE_PROFILES.items():
		blocked_modules = sorted(erpnext_modules - allowed_modules)
		if frappe.db.exists("Module Profile", profile_name):
			profile = frappe.get_doc("Module Profile", profile_name)
			if {row.module for row in profile.block_modules} == set(blocked_modules):
				continue
		else:
			profile = frappe.get_doc(
				{
					"doctype": "Module Profile",
					"module_profile_name": profile_name,
				}
			)

		profile.set(
			"block_modules",
			[{"module": module_name} for module_name in blocked_modules],
		)
		profile.save(ignore_permissions=True)

	frappe.clear_cache()


def ensure_standard_permissions():
	"""Libera apenas os cadastros ERPNext necessarios para cada funcao do piloto."""
	from frappe.permissions import setup_custom_perms

	for doctype, role_permissions in STANDARD_PERMISSIONS.items():
		if not frappe.db.exists("DocType", doctype):
			continue
		setup_custom_perms(doctype)

		for role in TECPONTO_ROLES:
			grants = role_permissions.get(role, {})
			filters = {"parent": doctype, "role": role, "permlevel": 0, "if_owner": 0}
			name = frappe.db.get_value("Custom DocPerm", filters, "name")
			if name:
				permission = frappe.get_doc("Custom DocPerm", name)
			else:
				permission = frappe.get_doc(
					{
						"doctype": "Custom DocPerm",
						"parent": doctype,
						"parenttype": "DocType",
						"parentfield": "permissions",
						"role": role,
						"permlevel": 0,
						"if_owner": 0,
					}
				)

			for fieldname in PERMISSION_FIELDS:
				permission.set(fieldname, int(bool(grants.get(fieldname))))
			permission.save(ignore_permissions=True)

	frappe.clear_cache()


def ensure_report_access(report_name, roles):
	"""Preserva os perfis nativos e acrescenta os perfis TecPonto ao relatorio."""
	if not frappe.db.exists("Report", report_name):
		return

	report = frappe.get_doc("Report", report_name)
	custom_name = frappe.db.get_value("Custom Role", {"report": report_name}, "name")
	custom_role = (
		frappe.get_doc("Custom Role", custom_name)
		if custom_name
		else frappe.get_doc(
			{
				"doctype": "Custom Role",
				"report": report_name,
				"ref_doctype": report.ref_doctype,
			}
		)
	)
	existing_roles = {row.role for row in report.roles}
	existing_roles.update(row.role for row in custom_role.roles)
	existing_roles.update(roles)
	custom_role.set("roles", [{"role": role} for role in sorted(existing_roles)])
	custom_role.save(ignore_permissions=True)
	frappe.clear_cache()


def ensure_operational_warehouses(company):
	"""Separa venda, peças, bancada, usados em revisão e itens bloqueados."""
	abbr = frappe.db.get_value("Company", company, "abbr")
	parent = frappe.db.get_value(
		"Warehouse", {"company": company, "is_group": 1, "parent_warehouse": ""}, "name"
	) or frappe.db.get_value(
		"Warehouse", {"company": company, "is_group": 1}, "name"
	)
	definitions = {
		"retail": "Varejo",
		"parts": "Peças",
		"workshop": "Oficina",
		"used_review": "Usados em revisão",
		"quarantine": "Quarentena",
	}
	warehouses = {}
	for key, warehouse_label in definitions.items():
		full_name = f"{warehouse_label} - {abbr}"
		if frappe.db.exists("Warehouse", full_name):
			warehouses[key] = full_name
			continue
		warehouse = frappe.get_doc(
			{
				"doctype": "Warehouse",
				"warehouse_name": warehouse_label,
				"company": company,
				"parent_warehouse": parent,
				"is_group": 0,
			}
		).insert(ignore_permissions=True)
		warehouses[key] = warehouse.name
	return warehouses


def ensure_items():
	items = (
		{
			"item_code": "SERV-DIAGNOSTICO-POC",
			"item_name": "Diagnostico tecnico POC",
			"item_group": "Services",
			"is_stock_item": 0,
		},
		{
			"item_code": "PECA-TESTE-POC",
			"item_name": "Peca demonstrativa POC",
			"item_group": "Products",
			"is_stock_item": 1,
		},
		{
			"item_code": "APARELHO-USADO-POC",
			"item_name": "Aparelho usado demonstrativo POC",
			"item_group": "Products",
			"is_stock_item": 1,
			"has_serial_no": 1,
			"serial_no_series": "TEC-.YYYY.-.#####",
		},
		{
			"item_code": "ACESSORIO-CABO-USBC-POC",
			"item_name": "Cabo USB-C demonstrativo",
			"item_group": "Products",
			"is_stock_item": 1,
		},
	)
	for item in items:
		if frappe.db.exists("Item", item["item_code"]):
			continue
		frappe.get_doc(
			{
				"doctype": "Item",
				"stock_uom": "Nos",
				"include_item_in_manufacturing": 0,
				**item,
			}
		).insert(ignore_permissions=True)


def ensure_demo_supplier():
	name = frappe.db.get_value(
		"Supplier", {"supplier_name": "Fornecedor Demonstracao POC"}, "name"
	)
	if name:
		return name

	supplier_group = frappe.db.get_value(
		"Supplier Group", {"is_group": 0}, "name"
	) or frappe.db.get_value("Supplier Group", {}, "name")
	return frappe.get_doc(
		{
			"doctype": "Supplier",
			"supplier_name": "Fornecedor Demonstracao POC",
			"supplier_group": supplier_group,
			"supplier_type": "Company",
			"country": "Brazil",
		}
	).insert(ignore_permissions=True).name


def ensure_item_profiles(warehouses, supplier):
	profiles = (
		{
			"item": "SERV-DIAGNOSTICO-POC",
			"operational_type": "Serviço",
			"brand_name": "TecPonto",
			"model_name": "Diagnóstico",
			"minimum_stock": 0,
		},
		{
			"item": "PECA-TESTE-POC",
			"operational_type": "Peça",
			"quality_level": "Compatível",
			"brand_name": "Demonstrativa",
			"model_name": "Peça de teste",
			"compatibility": "Aparelhos demonstrativos POC",
			"minimum_stock": 5,
			"default_warehouse": warehouses["parts"],
			"preferred_supplier": supplier,
		},
		{
			"item": "APARELHO-USADO-POC",
			"operational_type": "Aparelho",
			"quality_level": "Usado",
			"brand_name": "Demonstrativa",
			"model_name": "Aparelho usado POC",
			"minimum_stock": 0,
			"default_warehouse": warehouses["used_review"],
		},
		{
			"item": "ACESSORIO-CABO-USBC-POC",
			"operational_type": "Acessório",
			"quality_level": "Original",
			"brand_name": "TecPonto",
			"model_name": "Cabo USB-C",
			"compatibility": "Celulares, tablets e acessórios USB-C",
			"minimum_stock": 3,
			"default_warehouse": warehouses["retail"],
			"preferred_supplier": supplier,
		},
	)
	for values in profiles:
		if frappe.db.exists("TecPonto Item Profile", values["item"]):
			profile = frappe.get_doc("TecPonto Item Profile", values["item"])
			profile.update(values)
			profile.active = 1
			profile.save(ignore_permissions=True)
		else:
			frappe.get_doc(
				{"doctype": "TecPonto Item Profile", "active": 1, **values}
			).insert(ignore_permissions=True)


def ensure_demo_stock(company, warehouse):
	actual_qty = frappe.db.get_value(
		"Bin", {"item_code": "PECA-TESTE-POC", "warehouse": warehouse}, "actual_qty"
	) or 0
	if actual_qty > 0:
		return

	entry = frappe.get_doc(
		{
			"doctype": "Stock Entry",
			"company": company,
			"stock_entry_type": "Material Receipt",
			"items": [
				{
					"item_code": "PECA-TESTE-POC",
					"t_warehouse": warehouse,
					"qty": 5,
					"basic_rate": 25,
				}
			],
		}
	)
	entry.insert(ignore_permissions=True)
	entry.submit()


def ensure_demo_retail_stock(company, warehouse):
	item_code = "ACESSORIO-CABO-USBC-POC"
	actual_qty = frappe.db.get_value(
		"Bin", {"item_code": item_code, "warehouse": warehouse}, "actual_qty"
	) or 0
	if actual_qty > 0:
		return

	entry = frappe.get_doc(
		{
			"doctype": "Stock Entry",
			"company": company,
			"stock_entry_type": "Material Receipt",
			"items": [
				{
					"item_code": item_code,
					"t_warehouse": warehouse,
					"qty": 12,
					"basic_rate": 28,
				}
			],
		}
	)
	entry.insert(ignore_permissions=True)
	entry.submit()


def ensure_demo_selling_prices():
	price_list = frappe.db.get_value(
		"Price List", {"selling": 1, "enabled": 1}, "name"
	)
	if not price_list:
		return
	definitions = (
		("ACESSORIO-CABO-USBC-POC", 79.9),
		("APARELHO-USADO-POC", 1199.0),
	)
	for item_code, rate in definitions:
		existing = frappe.db.get_value(
			"Item Price",
			{"item_code": item_code, "price_list": price_list},
			"name",
		)
		if existing:
			frappe.db.set_value(
				"Item Price",
				existing,
				{"price_list_rate": rate, "selling": 1},
				update_modified=False,
			)
			continue
		frappe.get_doc(
			{
				"doctype": "Item Price",
				"item_code": item_code,
				"price_list": price_list,
				"price_list_rate": rate,
				"selling": 1,
				"currency": "BRL",
			}
		).insert(ignore_permissions=True)


def ensure_demo_customer():
	name = frappe.db.get_value("Customer", {"customer_name": "Cliente Demonstracao POC"}, "name")
	if name:
		return name

	return frappe.get_doc(
		{
			"doctype": "Customer",
			"customer_name": "Cliente Demonstracao POC",
			"customer_type": "Individual",
			"customer_group": "Individual",
			"territory": "Brazil",
		}
	).insert(ignore_permissions=True).name


def ensure_contact_preference(customer):
	if frappe.db.exists("TecPonto Contact Preference", customer):
		return customer
	return frappe.get_doc(
		{
			"doctype": "TecPonto Contact Preference",
			"customer": customer,
			"whatsapp_number": "5511999990000",
			"consent_source": "Importação",
			"operational_messages": 1,
			"marketing_messages": 0,
			"notes": "Número totalmente fictício para testes locais.",
		}
	).insert(ignore_permissions=True).name


def ensure_message_templates():
	templates = (
		("repair_received", "Reparo", "Recebemos seu aparelho na TecPonto. Acompanhe as próximas atualizações por este canal."),
		("repair_quote_ready", "Reparo", "O orçamento do seu reparo está pronto para aprovação."),
		("repair_ready", "Reparo", "Seu aparelho está pronto para retirada na TecPonto."),
		("repair_delivered", "Reparo", "Entrega concluída. A garantia ficou registrada na sua ordem de serviço."),
		("trade_received", "Troca", "Recebemos sua solicitação de avaliação para troca."),
		("trade_offer_ready", "Troca", "Sua oferta de troca está pronta para análise."),
	)
	for event_key, category, preview in templates:
		if frappe.db.exists("TecPonto Message Template", event_key):
			continue
		frappe.get_doc(
			{
				"doctype": "TecPonto Message Template",
				"event_key": event_key,
				"category": category,
				"active": 1,
				"approved": 0,
				"language_code": "pt_BR",
				"message_preview": preview,
			}
		).insert(ignore_permissions=True)


def ensure_demo_device(customer):
	name = frappe.db.get_value(
		"Service Device", {"customer": customer, "imei_serial": "POCDEVICE001"}, "name"
	)
	if name:
		return name

	return frappe.get_doc(
		{
			"doctype": "Service Device",
			"customer": customer,
			"device_type": "Celular",
			"brand": "Apple",
			"model": "iPhone demonstrativo",
			"imei_serial": "POC-DEVICE-001",
			"color": "Grafite",
			"condition_summary": "Aparelho ficticio criado apenas para o POC.",
			"ownership_confirmed": 1,
		}
	).insert(ignore_permissions=True).name


def ensure_demo_repair_order(company, customer, device, warehouse):
	name = frappe.db.get_value("Repair Order", {"device": device, "channel": "POC"}, "name")
	if name:
		return name

	return frappe.get_doc(
		{
			"doctype": "Repair Order",
			"company": company,
			"customer": customer,
			"device": device,
			"intake_at": now_datetime(),
			"channel": "POC",
			"priority": "Normal",
			"technician": "tecnico@tecponto.local",
			"reported_issue": "Falha demonstrativa para validar o fluxo da ordem de servico.",
			"intake_condition": "Sem dados ou aparelho reais.",
			"intake_front_photo": POC_INTAKE_PHOTO,
			"intake_back_photo": POC_INTAKE_PHOTO,
			"accessories": "Nenhum",
			"approval_status": "Pendente",
			"items": [
				{
					"item_code": "SERV-DIAGNOSTICO-POC",
					"qty": 1,
					"rate": 50,
				},
				{
					"item_code": "PECA-TESTE-POC",
					"qty": 1,
					"rate": 100,
					"warehouse": warehouse,
				},
			],
		}
	).insert(ignore_permissions=True).name


def backfill_role_based_ux_data():
	"""Completa metadados operacionais sem inventar fotos em registros não demonstrativos."""
	open_states = (
		"Recebido",
		"Em diagnostico",
		"Aguardando aprovacao",
		"Aprovado",
		"Aguardando peca",
		"Em reparo",
		"Em testes",
		"Pronto para retirada",
	)
	rows = frappe.get_all(
		"Repair Order",
		fields=[
			"name",
			"channel",
			"workflow_state",
			"technician",
			"intake_photo",
			"intake_front_photo",
			"intake_back_photo",
			"stage_changed_at",
			"modified",
		],
		limit_page_length=0,
	)
	for row in rows:
		updates = {}
		photo_fallback = row.intake_photo
		if not photo_fallback and row.channel == "POC":
			photo_fallback = POC_INTAKE_PHOTO
		if photo_fallback:
			if not row.intake_front_photo:
				updates["intake_front_photo"] = photo_fallback
			if not row.intake_back_photo:
				updates["intake_back_photo"] = photo_fallback
		if (
			row.channel == "POC"
			and row.workflow_state in open_states
			and not row.technician
		):
			updates["technician"] = "tecnico@tecponto.local"
		if not row.stage_changed_at:
			updates["stage_changed_at"] = row.modified
		if updates:
			frappe.db.set_value(
				"Repair Order",
				row.name,
				updates,
				update_modified=False,
			)


def ensure_demo_trade_device(customer):
	name = frappe.db.get_value(
		"Service Device", {"customer": customer, "imei_serial": "POCTRADEIN001"}, "name"
	)
	if name:
		return name

	return frappe.get_doc(
		{
			"doctype": "Service Device",
			"customer": customer,
			"device_type": "Celular",
			"brand": "Samsung",
			"model": "Galaxy demonstrativo",
			"imei_serial": "POC-TRADE-IN-001",
			"color": "Preto",
			"condition_summary": "Aparelho ficticio para validar o fluxo Troque.",
			"ownership_confirmed": 1,
		}
	).insert(ignore_permissions=True).name


def ensure_demo_trade_in_evaluation(company, customer, device, warehouse):
	name = frappe.db.get_value(
		"Trade In Evaluation", {"device": device, "source_channel": "POC"}, "name"
	)
	if name:
		return name

	return frappe.get_doc(
		{
			"doctype": "Trade In Evaluation",
			"company": company,
			"customer": customer,
			"device": device,
			"source_channel": "POC",
			"current_condition": "Marcas de uso",
			"desired_type": "iPhone",
			"cash_budget": "R$ 500 a R$ 1.000",
			"technician": "Administrator",
			"battery_health": 82,
			"imei_check_status": "Regular",
			"account_lock_removed": 1,
			"ownership_confirmed": 1,
			"expected_resale_value": 1200,
			"refurbishment_cost": 150,
			"target_margin_percent": 20,
			"offered_value": 750,
			"warehouse": warehouse,
			"checklist": [
				{"check_name": "Tela e toque", "result": "Aprovado", "critical": 1},
				{"check_name": "Bateria", "result": "Aprovado", "critical": 0},
				{"check_name": "Cameras", "result": "Aprovado", "critical": 1},
				{"check_name": "Audio e microfone", "result": "Aprovado", "critical": 1},
			],
		}
	).insert(ignore_permissions=True).name
