app_name = "tecponto"
app_title = "TecPonto"
app_publisher = "TecPonto"
app_description = "ERP operacional da TecPonto"
app_email = "dev@tecponto.local"
app_license = "gpl-3.0"
app_logo_url = "/assets/tecponto/images/favicon.svg"
app_home = "/desk/tecponto"

add_to_apps_screen = [
	{
		"name": "tecponto",
		"logo": "/assets/tecponto/images/favicon.svg",
		"title": "TecPonto",
		"route": "/desk/tecponto",
	}
]

required_apps = ["erpnext"]

app_include_css = "/assets/tecponto/css/tecponto.css"
app_include_js = [
	"/assets/tecponto/js/tecponto.js",
	"/assets/tecponto/js/operational_pages.js",
]
web_include_css = "/assets/tecponto/css/tecponto.css"

after_install = "tecponto.install.after_install"
after_migrate = "tecponto.install.ensure_setup"

doctype_js = {
	"Repair Order": "public/js/repair_order.js",
	"Trade In Evaluation": "public/js/trade_in_evaluation.js",
}

doc_events = {
	"File": {
		"after_insert": "tecponto.privacy.enforce_private_attachment",
		"on_update": "tecponto.privacy.enforce_private_attachment",
	},
	"Repair Order": {
		"after_insert": "tecponto.integrations.capture_repair_created",
		"on_update": "tecponto.integrations.capture_repair_state",
	},
	"Trade In Evaluation": {
		"after_insert": "tecponto.integrations.capture_trade_created",
		"on_update": "tecponto.integrations.capture_trade_state",
	},
}

scheduler_events = {
	"hourly": ["tecponto.integrations.retry_failed_events"],
	"daily": ["tecponto.privacy.run_scheduled_audit"],
}

user_data_fields = [
	{
		"doctype": "Service Device",
		"filter_by": "customer",
		"redact_fields": ["imei_serial", "condition_summary"],
		"partial": 1,
	},
	{
		"doctype": "Repair Order",
		"filter_by": "customer",
		"redact_fields": ["reported_issue", "intake_condition", "accessories", "diagnosis"],
		"partial": 1,
	},
	{
		"doctype": "Trade In Evaluation",
		"filter_by": "customer",
		"redact_fields": [
			"technical_notes",
			"ownership_confirmed",
			"offer_notes",
			"internal_notes",
		],
		"partial": 1,
	},
	{
		"doctype": "TecPonto Contact Preference",
		"filter_by": "customer",
		"redact_fields": ["whatsapp_number", "consent_source", "notes"],
		"partial": 1,
	},
]
