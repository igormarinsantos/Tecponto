import frappe
from frappe.model.workflow import apply_workflow
from frappe.utils import add_days, now_datetime
from urllib.parse import parse_qs, urlparse

from tecponto.setup import (
	MODULE_PROFILES,
	POC_INTAKE_PHOTO,
	ROLE_MODULE_PROFILES,
)
from tecponto.tecponto.doctype.repair_order.repair_order import (
	consume_parts,
	create_sales_invoice,
)


def run():
	required_doctypes = (
		"Service Device",
		"Repair Order",
		"Repair Order Item",
		"Repair Test",
		"Trade In Evaluation",
		"Trade In Checklist Item",
		"TecPonto Integration Settings",
		"TecPonto Automation Event",
		"TecPonto Item Profile",
		"TecPonto Operations Settings",
		"TecPonto Cash Session",
		"TecPonto Cash Movement",
		"TecPonto Contact Preference",
		"TecPonto Message Template",
		"TecPonto Privacy Settings",
	)
	missing = [name for name in required_doctypes if not frappe.db.exists("DocType", name)]
	if missing:
		raise AssertionError(f"DocTypes ausentes: {', '.join(missing)}")

	if not frappe.is_setup_complete():
		raise AssertionError("A configuracao inicial do Frappe/ERPNext permanece incompleta.")

	workflows = {}
	for doc_type in ("Repair Order", "Trade In Evaluation"):
		workflow = frappe.db.get_value(
			"Workflow", {"document_type": doc_type, "is_active": 1}, "name"
		)
		if not workflow:
			raise AssertionError(f"Workflow ativo de {doc_type} nao encontrado.")
		workflows[doc_type] = workflow

	if not frappe.db.exists("Workspace", "TecPonto"):
		raise AssertionError("Workspace TecPonto nao encontrado.")
	if frappe.db.exists(
		"Workspace Link",
		{"parent": "TecPonto", "link_to": "point-of-sale"},
	):
		raise AssertionError("O ponto de venda generico ainda aparece no workspace simplificado.")
	if frappe.db.get_single_value("Website Settings", "app_name") != "TecPonto":
		raise AssertionError("Identidade TecPonto nao aplicada ao Website Settings.")
	if (
		frappe.db.get_single_value("Website Settings", "app_logo")
		!= "/assets/tecponto/images/tecponto-logo.png"
	):
		raise AssertionError("Logo horizontal oficial nao aplicado ao login.")
	if frappe.db.get_single_value("Navbar Settings", "app_logo") != "/assets/tecponto/images/favicon.svg":
		raise AssertionError("Logo TecPonto nao aplicado a navegacao.")

	pilot_users = (
		"gestor@tecponto.local",
		"direcao@tecponto.local",
		"atendente@tecponto.local",
		"tecnico@tecponto.local",
	)
	missing_users = [user for user in pilot_users if not frappe.db.exists("User", user)]
	if missing_users:
		raise AssertionError(f"Usuarios do piloto ausentes: {', '.join(missing_users)}")
	missing_profiles = [
		user
		for user in pilot_users
		if not frappe.db.get_value("User", user, "module_profile")
	]
	if missing_profiles:
		raise AssertionError(
			f"Usuarios sem perfil de modulos simplificado: {', '.join(missing_profiles)}"
		)

	repair_order = frappe.db.get_value("Repair Order", {"channel": "POC"}, "name")
	if not repair_order:
		raise AssertionError("Ordem de servico demonstrativa nao encontrada.")

	trade_in = frappe.db.get_value(
		"Trade In Evaluation", {"source_channel": "POC"}, "name"
	)
	if not trade_in:
		raise AssertionError("Avaliacao de troca demonstrativa nao encontrada.")

	return {
		"app": "tecponto",
		"doctypes": list(required_doctypes),
		"setup_complete": True,
		"workflows": workflows,
		"repair_order": repair_order,
		"trade_in_evaluation": trade_in,
		"pilot_users": list(pilot_users),
		"status": "ok",
	}


def run_pilot_access():
	"""Confirma a matriz minima de acesso sem conceder System Manager aos usuarios do piloto."""
	expectations = {
		"gestor@tecponto.local": {
			("Repair Order", "write"): True,
			("Trade In Evaluation", "write"): True,
			("Customer", "write"): True,
			("Item", "write"): True,
			("Sales Invoice", "read"): False,
			("Sales Invoice", "submit"): False,
			("Purchase Order", "submit"): True,
			("Purchase Receipt", "submit"): True,
			("Purchase Invoice", "read"): False,
			("TecPonto Cash Session", "read"): False,
			("TecPonto Contact Preference", "write"): True,
			("TecPonto Privacy Settings", "read"): False,
		},
		"direcao@tecponto.local": {
			("Repair Order", "write"): True,
			("Trade In Evaluation", "write"): True,
			("Customer", "write"): True,
			("Item", "write"): True,
			("Sales Invoice", "read"): True,
			("Sales Invoice", "submit"): True,
			("Purchase Order", "submit"): True,
			("Purchase Receipt", "submit"): True,
			("Purchase Invoice", "read"): True,
			("TecPonto Cash Session", "read"): True,
			("TecPonto Contact Preference", "write"): True,
			("TecPonto Privacy Settings", "read"): True,
		},
		"atendente@tecponto.local": {
			("Repair Order", "write"): True,
			("Trade In Evaluation", "write"): True,
			("Customer", "create"): True,
			("Item", "write"): False,
			("Sales Invoice", "read"): False,
			("Sales Invoice", "submit"): False,
			("Purchase Order", "read"): False,
			("Purchase Invoice", "read"): False,
			("TecPonto Cash Session", "read"): False,
			("TecPonto Contact Preference", "write"): True,
			("TecPonto Privacy Settings", "read"): False,
		},
		"tecnico@tecponto.local": {
			("Repair Order", "write"): True,
			("Trade In Evaluation", "write"): True,
			("Customer", "read"): True,
			("Sales Invoice", "read"): False,
			("Item", "write"): False,
			("Purchase Order", "read"): False,
			("Purchase Invoice", "read"): False,
			("TecPonto Cash Session", "read"): False,
			("TecPonto Contact Preference", "read"): False,
			("TecPonto Privacy Settings", "read"): False,
		},
	}

	results = {}
	for user, checks in expectations.items():
		roles = frappe.get_roles(user)
		if "System Manager" in roles:
			raise AssertionError(f"Usuario de piloto recebeu System Manager indevidamente: {user}")
		actual_profile = frappe.db.get_value("User", user, "module_profile")
		tecponto_role = next(
			role
			for role, profile in ROLE_MODULE_PROFILES.items()
			if profile == actual_profile
		)
		expected_profile = ROLE_MODULE_PROFILES[tecponto_role]
		if tecponto_role not in roles:
			raise AssertionError(
				f"Perfil principal ausente para {user}: {tecponto_role}"
			)
		if actual_profile != expected_profile:
			raise AssertionError(
				f"Perfil de modulos inesperado para {user}: {actual_profile}, esperado={expected_profile}"
			)

		blocked_modules = set(
			frappe.get_all(
				"Block Module",
				filters={"parent": actual_profile, "parenttype": "Module Profile"},
				pluck="module",
			)
		)
		if not blocked_modules:
			raise AssertionError(f"Nenhum modulo generico foi bloqueado para {user}.")
		if blocked_modules & MODULE_PROFILES[actual_profile]:
			raise AssertionError(f"Modulo operacional bloqueado indevidamente para {user}.")

		results[user] = {
			"roles": sorted(role for role in roles if role.startswith("TecPonto ")),
			"module_profile": actual_profile,
			"blocked_modules": len(blocked_modules),
		}

		for (doctype, permission_type), expected in checks.items():
			actual = bool(frappe.has_permission(doctype, permission_type, user=user))
			if actual != expected:
				raise AssertionError(
					f"Permissao inesperada para {user}: {doctype}.{permission_type}={actual}, esperado={expected}"
				)
			results[user][f"{doctype}.{permission_type}"] = actual

	return {"users": results, "status": "ok"}


def run_integration_foundation():
	"""Valida a separação dos eventos e a base de API/webhook sem realizar envio externo."""
	from tecponto.integrations import (
		capture_repair_created,
		capture_trade_created,
		get_capabilities,
	)

	settings = frappe.get_single("TecPonto Integration Settings")
	if settings.enabled:
		raise AssertionError("A integração externa não deve ser ativada automaticamente no POC.")

	order_name = frappe.db.get_value("Repair Order", {"channel": "POC"}, "name")
	event_name = frappe.db.get_value(
		"TecPonto Automation Event",
		{
			"reference_doctype": "Repair Order",
			"reference_name": order_name,
			"event_key": "repair_received",
		},
		"name",
	)
	if not event_name:
		event_name = capture_repair_created(frappe.get_doc("Repair Order", order_name))

	event = frappe.get_doc("TecPonto Automation Event", event_name)
	if event.category != "Reparo" or '"category": "reparo"' not in event.payload:
		raise AssertionError("Evento de reparo não foi normalizado corretamente.")

	trade_name = frappe.db.get_value(
		"Trade In Evaluation", {"source_channel": "POC"}, "name"
	)
	trade_event_name = frappe.db.get_value(
		"TecPonto Automation Event",
		{
			"reference_doctype": "Trade In Evaluation",
			"reference_name": trade_name,
			"event_key": "trade_received",
		},
		"name",
	)
	if not trade_event_name:
		trade_event_name = capture_trade_created(
			frappe.get_doc("Trade In Evaluation", trade_name)
		)

	trade_event = frappe.get_doc("TecPonto Automation Event", trade_event_name)
	if trade_event.category != "Troca" or '"category": "troca"' not in trade_event.payload:
		raise AssertionError("Evento de troca não foi normalizado corretamente.")

	capabilities = get_capabilities()
	required = (
		"rest_api",
		"token_authentication",
		"native_webhooks",
		"normalized_event_webhook",
	)
	if not all(capabilities.get(key) for key in required):
		raise AssertionError("Capacidades de integração incompletas.")

	frappe.db.commit()
	return {
		"events": {
			"repair": {"name": event.name, "category": event.category, "status": event.status},
			"trade": {"name": trade_event.name, "category": trade_event.category, "status": trade_event.status},
		},
		"capabilities": capabilities,
		"status_check": "ok",
	}


def run_full_flow():
	"""Executa uma segunda OS demonstrativa de ponta a ponta e preserva o resultado."""
	existing = frappe.db.get_value(
		"Repair Order",
		{"approval_reference": "POC-FULL-FLOW"},
		["name", "sales_invoice"],
		as_dict=True,
	)
	if existing:
		order = frappe.get_doc("Repair Order", existing.name)
		if not order.solution:
			order.db_set("root_cause", "Componente demonstrativo com falha.")
			order.db_set("solution", "Componente demonstrativo substituído.")
		if any(
			row.is_stock_item and (row.consumed_qty or 0) < (row.qty or 0)
			for row in order.items
		):
			consume_parts(order.name)
		order.reload()
		if order.delivered_at and not order.parts_warranty_until:
			order.db_set(
				"parts_warranty_until",
				add_days(order.delivered_at, order.parts_warranty_days or 90),
			)
		result = _full_flow_result(existing.name, existing.sales_invoice, created=False)
		result["parts_stock_entry"] = order.parts_stock_entry
		return result

	company, customer, warehouse = _poc_masters()
	device = frappe.db.get_value(
		"Service Device", {"customer": customer, "imei_serial": "POCDEVICE001"}, "name"
	)

	order = frappe.get_doc(
		{
			"doctype": "Repair Order",
			"company": company,
			"customer": customer,
			"device": device,
			"channel": "POC",
			"priority": "Normal",
			"intake_front_photo": POC_INTAKE_PHOTO,
			"intake_back_photo": POC_INTAKE_PHOTO,
			"reported_issue": "Fluxo completo automatizado do POC.",
			"intake_condition": "Registro totalmente ficticio.",
			"accessories": "Nenhum",
			"diagnosis": "Componente demonstrativo selecionado para substituicao.",
			"approval_status": "Pendente",
			"approval_method": "Presencial",
			"approval_reference": "POC-FULL-FLOW",
			"promised_at": add_days(now_datetime(), 2),
			"root_cause": "Componente demonstrativo com falha.",
			"solution": "Componente demonstrativo substituído.",
			"items": [
				{"item_code": "SERV-DIAGNOSTICO-POC", "qty": 1, "rate": 50},
				{"item_code": "PECA-TESTE-POC", "qty": 1, "rate": 100, "warehouse": warehouse},
			],
			"tests": [
				{"test_name": "Ligamento", "result": "Aprovado"},
				{"test_name": "Carregamento", "result": "Aprovado"},
				{"test_name": "Audio e microfone", "result": "Aprovado"},
			],
		}
	).insert(ignore_permissions=True)

	for action in (
		"Iniciar diagnostico",
		"Enviar orcamento",
		"Aprovar orcamento",
		"Iniciar reparo",
	):
		order = apply_workflow(order, action)

	stock_entry = consume_parts(order.name)["name"]
	order.reload()
	for action in (
		"Iniciar testes",
		"Liberar para retirada",
		"Entregar",
	):
		order = apply_workflow(order, action)

	invoice = create_sales_invoice(order.name)["name"]
	frappe.db.commit()
	result = _full_flow_result(order.name, invoice, created=True)
	result["parts_stock_entry"] = stock_entry
	return result


def run_trade_in_flow():
	"""Executa uma avaliacao de troca completa e preserva o resultado para inspecao."""
	existing = frappe.db.get_value(
		"Trade In Evaluation", {"offer_notes": "POC-FULL-TRADE-IN"}, "name"
	)
	if existing:
		return _trade_in_flow_result(existing, created=False)

	company, customer, warehouse = _poc_masters()
	device = frappe.db.get_value(
		"Service Device", {"customer": customer, "imei_serial": "POCTRADEIN001"}, "name"
	)
	trade_in = frappe.get_doc(
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
			"seller_declaration_accepted": 1,
			"technical_notes": "Aparelho ficticio para validacao automatizada.",
			"expected_resale_value": 1200,
			"refurbishment_cost": 150,
			"target_margin_percent": 20,
			"offered_value": 750,
			"desired_item_price": 1800,
			"warehouse": warehouse,
			"offer_notes": "POC-FULL-TRADE-IN",
			"checklist": [
				{"check_name": "Tela e touch", "result": "Aprovado", "critical": 1},
				{"check_name": "Cameras", "result": "Aprovado"},
				{"check_name": "Conectividade", "result": "Aprovado"},
				{"check_name": "Carregamento", "result": "Aprovado", "critical": 1},
			],
		}
	).insert(ignore_permissions=True)

	for action in (
		"Iniciar avaliacao",
		"Preparar oferta",
		"Apresentar oferta",
		"Aceitar oferta",
		"Aprovar aquisicao",
		"Iniciar revisao",
		"Liberar para venda",
	):
		trade_in = apply_workflow(trade_in, action)

	frappe.db.commit()
	return _trade_in_flow_result(trade_in.name, created=True)


def run_workshop_controls():
	"""Valida prazo, encerramento sem conserto e vínculo de garantia."""
	company, customer, _warehouse = _poc_masters()
	device = frappe.db.get_value(
		"Service Device", {"customer": customer, "imei_serial": "POCDEVICE001"}, "name"
	)

	no_fix_name = frappe.db.get_value(
		"Repair Order", {"notes": "POC-WORKSHOP-NO-FIX"}, "name"
	)
	if not no_fix_name:
		no_fix = frappe.get_doc(
			{
				"doctype": "Repair Order",
				"company": company,
				"customer": customer,
				"device": device,
				"channel": "POC",
				"priority": "Normal",
				"intake_front_photo": POC_INTAKE_PHOTO,
				"intake_back_photo": POC_INTAKE_PHOTO,
				"service_type": "Reparo",
				"promised_at": add_days(now_datetime(), 1),
				"reported_issue": "Cenário demonstrativo sem conserto.",
				"intake_condition": "Registro fictício.",
				"notes": "POC-WORKSHOP-NO-FIX",
			}
		).insert(ignore_permissions=True)
		no_fix = apply_workflow(no_fix, "Iniciar diagnostico")
		no_fix.diagnosis = "Dano irreversível demonstrativo."
		no_fix.root_cause = "Placa sem viabilidade técnica."
		no_fix.no_repair_reason = "Sem viabilidade técnica"
		no_fix.save(ignore_permissions=True)
		no_fix = apply_workflow(no_fix, "Encerrar sem conserto")
		no_fix_name = no_fix.name

	no_fix = frappe.get_doc("Repair Order", no_fix_name)
	if no_fix.workflow_state != "Sem conserto" or no_fix.closure_outcome != "Sem conserto":
		raise AssertionError("Encerramento sem conserto não foi registrado corretamente.")

	late_name = frappe.db.get_value("Repair Order", {"notes": "POC-WORKSHOP-LATE"}, "name")
	if not late_name:
		late = frappe.get_doc(
			{
				"doctype": "Repair Order",
				"company": company,
				"customer": customer,
				"device": device,
				"channel": "POC",
				"priority": "Urgente",
				"intake_front_photo": POC_INTAKE_PHOTO,
				"intake_back_photo": POC_INTAKE_PHOTO,
				"service_type": "Reparo",
				"intake_at": add_days(now_datetime(), -2),
				"promised_at": add_days(now_datetime(), -1),
				"reported_issue": "Cenário demonstrativo atrasado.",
				"intake_condition": "Registro fictício.",
				"notes": "POC-WORKSHOP-LATE",
			}
		).insert(ignore_permissions=True)
		late_name = late.name
	late = frappe.get_doc("Repair Order", late_name)
	if late.sla_status != "Atrasado":
		raise AssertionError("SLA atrasado não foi calculado corretamente.")

	original_name = frappe.db.get_value(
		"Repair Order", {"approval_reference": "POC-FULL-FLOW"}, "name"
	)
	if not original_name:
		raise AssertionError("Execute run_full_flow antes de validar a garantia.")
	warranty_name = frappe.db.get_value(
		"Repair Order",
		{"original_repair_order": original_name, "service_type": "Garantia"},
		"name",
	)
	if not warranty_name:
		warranty = frappe.get_doc(
			{
				"doctype": "Repair Order",
				"company": company,
				"customer": customer,
				"device": device,
				"channel": "POC",
				"priority": "Normal",
				"intake_front_photo": POC_INTAKE_PHOTO,
				"intake_back_photo": POC_INTAKE_PHOTO,
				"service_type": "Garantia",
				"original_repair_order": original_name,
				"promised_at": add_days(now_datetime(), 1),
				"reported_issue": "Retorno demonstrativo em garantia.",
				"intake_condition": "Registro fictício.",
				"notes": "POC-WORKSHOP-WARRANTY",
			}
		).insert(ignore_permissions=True)
		warranty_name = warranty.name

	frappe.db.commit()
	return {
		"no_fix": {"name": no_fix.name, "state": no_fix.workflow_state},
		"late": {"name": late.name, "sla_status": late.sla_status},
		"warranty": {"name": warranty_name, "original": original_name},
		"status": "ok",
	}


def run_signature_controls():
	"""Valida link único, aceite auditável e aprovação sem iniciar reparo automaticamente."""
	from tecponto.www.os_aceite import generate_signature_link, submit_signature

	company, customer, _warehouse = _poc_masters()
	device = frappe.db.get_value(
		"Service Device", {"customer": customer, "imei_serial": "POCDEVICE001"}, "name"
	)
	order_name = frappe.db.get_value(
		"Repair Order", {"notes": "POC-SIGNATURE-FLOW"}, "name"
	)
	if not order_name:
		order = frappe.get_doc(
			{
				"doctype": "Repair Order",
				"company": company,
				"customer": customer,
				"device": device,
				"channel": "POC",
				"priority": "Normal",
				"intake_front_photo": POC_INTAKE_PHOTO,
				"intake_back_photo": POC_INTAKE_PHOTO,
				"reported_issue": "Validação fictícia do aceite digital.",
				"intake_condition": "Registro fictício.",
				"diagnosis": "Diagnóstico fictício para assinatura.",
				"approval_status": "Pendente",
				"promised_at": add_days(now_datetime(), 2),
				"notes": "POC-SIGNATURE-FLOW",
				"items": [
					{"item_code": "SERV-DIAGNOSTICO-POC", "qty": 1, "rate": 50},
				],
			}
		).insert(ignore_permissions=True)
		order = apply_workflow(order, "Iniciar diagnostico")
		order = apply_workflow(order, "Enviar orcamento")
		order_name = order.name

	link = generate_signature_link(order_name)
	query = parse_qs(urlparse(link["path"]).query)
	token = (query.get("token") or [None])[0]
	if not token:
		raise AssertionError("Link de assinatura ficou sem token único.")
	phone = frappe.db.get_value(
		"TecPonto Contact Preference", customer, "whatsapp_number"
	)
	submit_signature(order_name, phone, token)
	order = frappe.get_doc("Repair Order", order_name)
	if not order.customer_signature_hash or not order.customer_signature_at:
		raise AssertionError("Aceite digital ficou sem trilha de auditoria.")
	if order.workflow_state != "Aprovado":
		raise AssertionError(
			f"Aceite digital deveria aprovar a OS, estado atual: {order.workflow_state}."
		)
	if order.repair_started_at:
		raise AssertionError("Aceite digital iniciou o reparo automaticamente.")
	frappe.db.commit()
	return {
		"repair_order": order.name,
		"workflow_state": order.workflow_state,
		"signature_recorded": True,
		"repair_started": False,
		"status": "ok",
	}


def run_operational_pages():
	"""Valida contratos, rotas e separação de informação por perfil."""
	from tecponto.operations import get_operational_page
	from tecponto.sales import create_sale_draft, get_sale_quote

	results = {}
	for page in ("repairs", "customers", "devices", "trades", "stock", "sales", "reports"):
		result = get_operational_page(page, filters={}, start=0, page_length=20)
		if result.get("page") != page or "rows" not in result or "total" not in result:
			raise AssertionError(f"Contrato da página operacional {page} está incompleto.")
		if page != "trades" and not result.get("metrics"):
			raise AssertionError(f"Página operacional {page} ficou sem indicadores.")
		if page == "trades" and len(result.get("pipeline") or []) != 6:
			raise AssertionError("Pipeline de trocas não retornou seis etapas.")
		results[page] = {
			"rows": len(result["rows"]),
			"total": result["total"],
		}

	for page_name in ("tecponto-sales", "tecponto-reports"):
		if not frappe.db.exists("Page", page_name):
			raise AssertionError(f"Página operacional {page_name} não foi sincronizada.")

	original_user = frappe.session.user
	role_access = {}
	sale_draft_name = None
	try:
		frappe.set_user("atendente@tecponto.local")
		attendant_sales = get_operational_page(
			"sales", filters={}, start=0, page_length=20
		)
		if attendant_sales["capabilities"]["can_view_finance"]:
			raise AssertionError("Atendente recebeu indicadores financeiros.")
		try:
			get_operational_page("reports", filters={}, start=0, page_length=20)
		except frappe.PermissionError:
			pass
		else:
			raise AssertionError("Atendente recebeu acesso aos relatórios de gestão.")
		quote = get_sale_quote("ACESSORIO-CABO-USBC-POC", 1)
		if quote["total"] <= 0 or quote["actual_qty"] < 1:
			raise AssertionError("Catálogo de acessórios ficou sem preço ou estoque.")
		customer = frappe.db.get_value(
			"Customer", {"customer_name": "Cliente Demonstracao POC"}, "name"
		)
		sale = create_sale_draft(
			{
				"customer": customer,
				"item_code": "ACESSORIO-CABO-USBC-POC",
				"qty": 1,
				"payment_method": "Pix",
				"notes": "Rascunho temporário do smoke.",
			}
		)
		sale_draft_name = sale["name"]
		if sale["can_open"] or frappe.db.get_value(
			"Sales Invoice", sale_draft_name, "docstatus"
		) != 0:
			raise AssertionError("Venda do atendente não ficou como rascunho protegido.")

		frappe.set_user("gestor@tecponto.local")
		manager_reports = get_operational_page(
			"reports", filters={}, start=0, page_length=20
		)
		if manager_reports["capabilities"]["can_view_finance"]:
			raise AssertionError("Gestor recebeu valores exclusivos da direção.")

		frappe.set_user("direcao@tecponto.local")
		direction_reports = get_operational_page(
			"reports", filters={}, start=0, page_length=20
		)
		if not direction_reports["capabilities"]["can_view_finance"]:
			raise AssertionError("Direção ficou sem indicadores financeiros.")
		role_access = {
			"attendant_sales": True,
			"attendant_reports": False,
			"manager_reports": True,
			"manager_finance": False,
			"direction_finance": True,
		}
	finally:
		frappe.set_user(original_user)
		if sale_draft_name and frappe.db.exists("Sales Invoice", sale_draft_name):
			frappe.delete_doc(
				"Sales Invoice",
				sale_draft_name,
				force=True,
				ignore_permissions=True,
			)
			frappe.db.commit()

	return {
		"pages": results,
		"role_access": role_access,
		"guided_sale": {
			"item": "ACESSORIO-CABO-USBC-POC",
			"draft_created": bool(sale_draft_name),
			"operator_finance_access": False,
		},
		"status": "ok",
	}


def run_inventory_controls():
	"""Valida catálogo, serialização, pedido e recebimento de compra."""
	from erpnext.buying.doctype.purchase_order.purchase_order import make_purchase_receipt

	company, _customer, warehouse = _poc_masters()
	supplier = frappe.db.get_value(
		"Supplier", {"supplier_name": "Fornecedor Demonstracao POC"}, "name"
	)
	profiles = frappe.get_all(
		"TecPonto Item Profile",
		filters={"active": 1},
		pluck="name",
	)
	if len(profiles) < 3:
		raise AssertionError("Catálogo operacional demonstrativo incompleto.")

	if not frappe.db.get_value("Item", "APARELHO-USADO-POC", "has_serial_no"):
		raise AssertionError("Aparelho demonstrativo sem controle serial.")

	po_name = frappe.db.get_value(
		"Purchase Order", {"order_confirmation_no": "POC-INVENTORY-CONTROL"}, "name"
	)
	if not po_name:
		po = frappe.get_doc(
			{
				"doctype": "Purchase Order",
				"company": company,
				"supplier": supplier,
				"schedule_date": add_days(now_datetime(), 2),
				"order_confirmation_no": "POC-INVENTORY-CONTROL",
				"order_confirmation_date": now_datetime(),
				"items": [
					{
						"item_code": "PECA-TESTE-POC",
						"qty": 2,
						"rate": 25,
						"warehouse": warehouse,
						"schedule_date": add_days(now_datetime(), 2),
					}
				],
			}
		).insert(ignore_permissions=True)
		po.submit()
		po_name = po.name

	receipt_name = frappe.db.get_value(
		"Purchase Receipt Item", {"purchase_order": po_name}, "parent"
	)
	if not receipt_name:
		receipt = make_purchase_receipt(po_name)
		receipt.insert(ignore_permissions=True)
		receipt.submit()
		receipt_name = receipt.name

	actual_qty = frappe.db.get_value(
		"Bin",
		{"item_code": "PECA-TESTE-POC", "warehouse": warehouse},
		"actual_qty",
	) or 0
	if actual_qty < 2:
		raise AssertionError("Recebimento de compra não atualizou o estoque.")

	frappe.db.commit()
	return {
		"profiles": len(profiles),
		"serialized_item": "APARELHO-USADO-POC",
		"purchase_order": po_name,
		"purchase_receipt": receipt_name,
		"part_balance": actual_qty,
		"status": "ok",
	}


def run_used_inventory_controls():
	"""Valida a trava fiscal e a criação auditável do aparelho usado."""
	from tecponto.tecponto.doctype.trade_in_evaluation.trade_in_evaluation import (
		create_used_inventory_internal,
	)

	trade_name = frappe.db.get_value(
		"Trade In Evaluation", {"offer_notes": "POC-FULL-TRADE-IN"}, "name"
	)
	if not trade_name:
		raise AssertionError("Execute run_trade_in_flow antes da entrada do usado.")

	settings = frappe.get_single("TecPonto Operations Settings")
	settings.used_fiscal_process_approved = 1
	settings.auto_create_used_inventory = 1
	settings.acquisition_document_label = "Documento demonstrativo POC"
	settings.save(ignore_permissions=True)

	trade = frappe.get_doc("Trade In Evaluation", trade_name)
	if not trade.seller_declaration_accepted:
		trade.db_set("seller_declaration_accepted", 1)
	if not trade.final_acquisition_cost:
		trade.db_set(
			"final_acquisition_cost",
			(trade.offered_value or 0) + (trade.refurbishment_cost or 0),
		)

	result = create_used_inventory_internal(trade_name)
	trade.reload()
	if not trade.stock_item or not trade.serial_no or not trade.stock_entry:
		raise AssertionError("Item, série ou entrada do usado não foram criados.")
	if not frappe.db.exists("Serial No", trade.serial_no):
		raise AssertionError("Número de série do usado não foi registrado.")
	if frappe.db.get_value("Stock Entry", trade.stock_entry, "docstatus") != 1:
		raise AssertionError("Entrada do usado não foi submetida.")

	settings.used_fiscal_process_approved = 0
	settings.save(ignore_permissions=True)
	frappe.db.commit()
	return {
		"trade_in": trade.name,
		"item": trade.stock_item,
		"serial_no": trade.serial_no,
		"stock_entry": trade.stock_entry,
		"automation_reset": not bool(settings.auto_create_used_inventory),
		"created": result["created"],
		"status": "ok",
	}


def run_cash_controls():
	"""Valida abertura, movimentos, diferença e fechamento exclusivo da direção."""
	from tecponto.cash import close_cash, open_cash, register_movement

	settings = frappe.get_single("TecPonto Operations Settings")
	settings.finance_process_approved = 1
	settings.cash_control_enabled = 1
	settings.save(ignore_permissions=True)

	opened = open_cash(100)
	sale = register_movement("Venda", "Pix", 100, notes="Venda demonstrativa POC")
	withdrawal = register_movement("Sangria", "Dinheiro", 20, notes="Sangria demonstrativa POC")
	closed = close_cash(180)

	if closed["difference"] != 0 or closed["expected_amount"] != 180:
		raise AssertionError("Fechamento de caixa demonstrativo não conciliou.")
	if frappe.db.get_value("TecPonto Cash Session", opened["name"], "status") != "Fechado":
		raise AssertionError("Sessão de caixa não foi fechada.")

	settings.finance_process_approved = 0
	settings.save(ignore_permissions=True)
	frappe.db.commit()
	return {
		"cash_session": opened["name"],
		"movements": [sale["name"], withdrawal["name"]],
		"expected": closed["expected_amount"],
		"difference": closed["difference"],
		"control_reset": not bool(settings.cash_control_enabled),
		"status": "ok",
	}


def run_communication_controls():
	"""Valida telefone, consentimento, templates e idempotência dos eventos."""
	from tecponto.integrations import capture_repair_created

	customer = frappe.db.get_value(
		"Customer", {"customer_name": "Cliente Demonstracao POC"}, "name"
	)
	preference = frappe.get_doc("TecPonto Contact Preference", customer)
	if not preference.whatsapp_number.startswith("55") or not preference.operational_messages:
		raise AssertionError("Preferência operacional demonstrativa inválida.")

	templates = frappe.get_all(
		"TecPonto Message Template",
		filters={"active": 1},
		fields=["event_key", "category"],
	)
	if len(templates) < 6 or {row.category for row in templates} != {"Reparo", "Troca"}:
		raise AssertionError("Templates de Reparo e Troca incompletos.")

	order_name = frappe.db.get_value("Repair Order", {"notes": "POC-WORKSHOP-LATE"}, "name")
	order = frappe.get_doc("Repair Order", order_name)
	first_event = capture_repair_created(order)
	second_event = capture_repair_created(order)
	if first_event != second_event:
		raise AssertionError("Evento repetido não foi tratado de forma idempotente.")
	event = frappe.get_doc("TecPonto Automation Event", first_event)
	if preference.whatsapp_number not in event.payload:
		raise AssertionError("Evento não recebeu o contato operacional autorizado.")

	frappe.db.commit()
	return {
		"preference": preference.name,
		"templates": len(templates),
		"idempotent_event": first_event,
		"outbound_status": event.status,
		"status": "ok",
	}


def run_security_controls():
	"""Valida privacidade de anexos, retenção conservadora e isolamento da direção."""
	from tecponto.privacy import get_privacy_audit
	from frappe.utils.file_manager import save_file

	settings = frappe.get_single("TecPonto Privacy Settings")
	if not settings.enforce_private_sensitive_files or settings.automatic_deletion_enabled:
		raise AssertionError("Política conservadora de privacidade não está ativa.")

	order_name = frappe.db.get_value("Repair Order", {"channel": "POC"}, "name")
	test_file = save_file(
		"tecponto-privacy-smoke.txt",
		b"Arquivo ficticio para validar privacidade.",
		"Repair Order",
		order_name,
		is_private=0,
	)
	if not test_file.is_private:
		raise AssertionError("Anexo sensível permaneceu público.")
	test_file.delete(ignore_permissions=True)

	audit = get_privacy_audit(persist=True)
	if audit["automatic_deletion"] or "retention_candidates" not in audit:
		raise AssertionError("Auditoria de retenção retornou política insegura.")
	frappe.db.commit()
	return {
		"private_attachment": True,
		"audit_status": audit["status"],
		"production_ready": audit["production_ready"],
		"pilot_accounts": audit["pilot_accounts"],
		"automatic_deletion": audit["automatic_deletion"],
		"status": "ok",
	}


def run_role_based_ux_controls():
	"""Valida recepção guiada, fotos, Kanban e separação física dos estoques."""
	from tecponto.dashboard import _management_insights, _technician_board, move_repair_card
	from tecponto.intake import (
		create_customer_intake,
		create_device_intake,
		create_repair_intake,
		create_trade_intake,
	)

	company, customer, warehouse = _poc_masters()
	expected_warehouses = (
		"Varejo",
		"Peças",
		"Oficina",
		"Usados em revisão",
		"Quarentena",
	)
	missing_warehouses = [
		label
		for label in expected_warehouses
		if not frappe.db.exists(
			"Warehouse",
			{"company": company, "warehouse_name": label, "is_group": 0},
		)
	]
	if missing_warehouses:
		raise AssertionError(
			f"Estoques operacionais ausentes: {', '.join(missing_warehouses)}"
		)

	meta = frappe.get_meta("Repair Order")
	for fieldname in ("intake_front_photo", "intake_back_photo"):
		if not meta.get_field(fieldname) or not meta.get_field(fieldname).reqd:
			raise AssertionError(f"Foto obrigatória não configurada: {fieldname}")
	trade_meta = frappe.get_meta("Trade In Evaluation")
	for fieldname in ("device_front_photo", "device_back_photo"):
		if not trade_meta.get_field(fieldname):
			raise AssertionError(f"Foto guiada de troca não configurada: {fieldname}")

	previous_user = frappe.session.user
	try:
		frappe.set_user("atendente@tecponto.local")
		customer_result = create_customer_intake(
			frappe.as_json({
				"customer_name": "Cliente Jornada Guiada POC",
				"whatsapp_number": "11999990012",
				"operational_consent": 1,
			})
		)
	finally:
		frappe.set_user(previous_user)
	if not frappe.db.exists("Customer", customer_result["name"]):
		raise AssertionError("Jornada guiada não cadastrou o cliente.")

	workflow_name = frappe.db.get_value(
		"Workflow",
		{"document_type": "Repair Order", "is_active": 1},
		"name",
	)
	workflow = frappe.get_doc("Workflow", workflow_name)
	if not any(row.state == "Aguardando peca" for row in workflow.states):
		raise AssertionError("Estado Aguardando peça ausente do workflow.")
	required_transitions = {
		("Aprovado", "Aguardar peca", "Aguardando peca"),
		("Em reparo", "Aguardar peca", "Aguardando peca"),
		("Aguardando peca", "Retomar reparo", "Em reparo"),
	}
	actual_transitions = {
		(row.state, row.action, row.next_state) for row in workflow.transitions
	}
	if not required_transitions.issubset(actual_transitions):
		raise AssertionError("Transições de espera por peça incompletas.")

	guided_device = frappe.db.get_value(
		"Service Device",
		{"imei_serial": "POCDEVICEGUIDED001"},
		"name",
	)
	if not guided_device:
		previous_user = frappe.session.user
		try:
			frappe.set_user("atendente@tecponto.local")
			device_result = create_device_intake(
				frappe.as_json({
					"customer": customer,
					"device_type": "Celular",
					"brand": "TecPonto",
					"model": "Cadastro guiado POC",
					"imei_serial": "POC-DEVICE-GUIDED-001",
					"intake_condition": "Aparelho fictício para validar a jornada.",
					"ownership_confirmed": 1,
				})
			)
			guided_device = device_result["name"]
		finally:
			frappe.set_user(previous_user)
	if not frappe.db.exists("Service Device", guided_device):
		raise AssertionError("Jornada guiada não cadastrou o aparelho.")

	guided_trade_device = frappe.db.get_value(
		"Service Device",
		{"imei_serial": "POCTRADEGUIDED001"},
		"name",
	)
	guided_trade = (
		frappe.db.get_value(
			"Trade In Evaluation",
			{"device": guided_trade_device, "source_channel": "POC"},
			"name",
		)
		if guided_trade_device
		else None
	)
	if not guided_trade:
		previous_user = frappe.session.user
		try:
			frappe.set_user("atendente@tecponto.local")
			trade_result = create_trade_intake(
				frappe.as_json({
					"customer": customer,
					"device_type": "Celular",
					"brand": "TecPonto",
					"model": "Troca guiada POC",
					"imei_serial": "POC-TRADE-GUIDED-001",
					"color": "Preto",
					"storage_capacity": "128 GB",
					"current_condition": "Marcas de uso",
					"desired_type": "Ainda nao sei",
					"cash_budget": "Depende da avaliacao",
					"source_channel": "POC",
					"ownership_confirmed": 1,
					"device_front_photo": POC_INTAKE_PHOTO,
					"device_back_photo": POC_INTAKE_PHOTO,
				})
			)
			guided_trade = trade_result["name"]
		finally:
			frappe.set_user(previous_user)
	trade_doc = frappe.get_doc("Trade In Evaluation", guided_trade)
	if not trade_doc.device_front_photo or not trade_doc.device_back_photo:
		raise AssertionError("Triagem guiada de troca ficou sem frente ou traseira.")

	intake_device = frappe.db.get_value(
		"Service Device",
		{"imei_serial": "POCINTAKEUX001"},
		"name",
	)
	intake_order = (
		frappe.db.get_value(
			"Repair Order",
			{"device": intake_device, "reported_issue": "Teste do balcão guiado."},
			"name",
		)
		if intake_device
		else None
	)
	if not intake_order:
		previous_user = frappe.session.user
		try:
			frappe.set_user("atendente@tecponto.local")
			result = create_repair_intake(
				frappe.as_json({
					"customer_name": "Cliente Balcão POC UX",
					"whatsapp_number": "11999990011",
					"operational_consent": 1,
					"device_type": "Celular",
					"brand": "TecPonto",
					"model": "Aparelho de teste do balcão",
					"imei_serial": "POC-INTAKE-UX-001",
					"service_type": "Reparo",
					"reported_issue": "Teste do balcão guiado.",
					"intake_condition": "Registro totalmente fictício.",
					"accessories": "Nenhum",
					"priority": "Normal",
					"channel": "POC",
					"intake_front_photo": POC_INTAKE_PHOTO,
					"intake_back_photo": POC_INTAKE_PHOTO,
				})
			)
			intake_order = result["name"]
		finally:
			frappe.set_user(previous_user)
	intake_doc = frappe.get_doc("Repair Order", intake_order)
	if not intake_doc.intake_front_photo or not intake_doc.intake_back_photo:
		raise AssertionError("Recepção guiada criou OS sem as duas fotos.")

	device = frappe.db.get_value(
		"Service Device",
		{"customer": customer, "imei_serial": "POCDEVICE001"},
		"name",
	)
	order_name = frappe.db.get_value(
		"Repair Order",
		{"notes": "POC-ROLE-UX-WAITING-PART"},
		"name",
	)
	if order_name:
		existing_state = frappe.db.get_value("Repair Order", order_name, "workflow_state")
		if existing_state not in ("Aprovado", "Aguardando peca"):
			frappe.db.set_value(
				"Repair Order",
				order_name,
				"notes",
				f"POC-ROLE-UX-WAITING-PART-ARCHIVED-{frappe.generate_hash(length=8)}",
				update_modified=False,
			)
			order_name = None
	if not order_name:
		order = frappe.get_doc(
			{
				"doctype": "Repair Order",
				"company": company,
				"customer": customer,
				"device": device,
				"channel": "POC",
				"priority": "Normal",
				"service_type": "Reparo",
				"technician": "tecnico@tecponto.local",
				"intake_front_photo": POC_INTAKE_PHOTO,
				"intake_back_photo": POC_INTAKE_PHOTO,
				"reported_issue": "Cenário fictício aguardando peça.",
				"intake_condition": "Registro fictício.",
				"diagnosis": "Peça demonstrativa precisa ser substituída.",
				"approval_method": "Presencial",
				"notes": "POC-ROLE-UX-WAITING-PART",
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
		).insert(ignore_permissions=True)
		for action in (
			"Iniciar diagnostico",
			"Enviar orcamento",
			"Aprovar orcamento",
		):
			order = apply_workflow(order, action)
		order_name = order.name

	order = frappe.get_doc("Repair Order", order_name)
	if order.workflow_state == "Aprovado":
		move_repair_card(
			order.name,
			"Aguardando peca",
			waiting_part_details="Peça demonstrativa em compra.",
			part_expected_at=add_days(now_datetime(), 3),
		)
		order.reload()
	if order.workflow_state != "Aguardando peca":
		raise AssertionError("Kanban não moveu a OS para Aguardando peça.")
	if not order.waiting_part_details or not order.part_expected_at:
		raise AssertionError("Bloqueio de peça ficou sem detalhe ou previsão.")

	previous_user = frappe.session.user
	try:
		frappe.set_user("tecnico@tecponto.local")
		board = _technician_board()
	finally:
		frappe.set_user(previous_user)
	if not board or board["total"] < 1:
		raise AssertionError("Quadro do técnico não retornou OS atribuídas.")
	part_cards = next(
		column["cards"] for column in board["columns"] if column["key"] == "parts"
	)
	if not any(card.name == order.name for card in part_cards):
		raise AssertionError("OS aguardando peça não apareceu na coluna correta.")

	previous_user = frappe.session.user
	try:
		frappe.set_user("gestor@tecponto.local")
		management = _management_insights()
	finally:
		frappe.set_user(previous_user)
	if not management or len(management.get("insights") or []) != 4:
		raise AssertionError("Painel gerencial não retornou os quatro insights acionáveis.")

	frappe.db.commit()
	return {
		"warehouses": list(expected_warehouses),
		"guided_customer": customer_result["name"],
		"guided_device": guided_device,
		"guided_intake_order": intake_doc.name,
		"guided_trade": trade_doc.name,
		"waiting_part_order": order.name,
		"technician_board_total": board["total"],
		"management_insights": len(management["insights"]),
		"mandatory_photos": True,
		"status": "ok",
	}


def _poc_masters():
	company = frappe.db.get_value("Company", "TecPonto POC", "name")
	customer = frappe.db.get_value(
		"Customer", {"customer_name": "Cliente Demonstracao POC"}, "name"
	)
	warehouse = frappe.db.get_value(
		"Warehouse", {"company": company, "warehouse_name": "Peças"}, "name"
	)
	return company, customer, warehouse


def _full_flow_result(order_name, invoice_name, created):
	order = frappe.get_doc("Repair Order", order_name)
	print_html = frappe.get_print(
		"Repair Order", order.name, print_format="TecPonto Ordem de Servico"
	)
	return {
		"repair_order": order.name,
		"workflow_state": order.workflow_state,
		"approval_status": order.approval_status,
		"warranty_until": str(order.warranty_until),
		"sales_invoice": invoice_name,
		"sales_invoice_status": frappe.db.get_value("Sales Invoice", invoice_name, "docstatus"),
		"print_html_length": len(print_html),
		"created": created,
		"status": "ok",
	}


def _trade_in_flow_result(trade_in_name, created):
	trade_in = frappe.get_doc("Trade In Evaluation", trade_in_name)
	print_html = frappe.get_print(
		"Trade In Evaluation",
		trade_in.name,
		print_format="TecPonto Avaliacao de Troca",
	)
	return {
		"trade_in_evaluation": trade_in.name,
		"workflow_state": trade_in.workflow_state,
		"offer_status": trade_in.offer_status,
		"expected_margin_value": trade_in.expected_margin_value,
		"expected_margin_percent": trade_in.expected_margin_percent,
		"print_html_length": len(print_html),
		"created": created,
		"status": "ok",
	}
