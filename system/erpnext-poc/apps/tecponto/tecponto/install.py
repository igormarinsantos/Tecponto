import json
from pathlib import Path

import frappe


ROLES = (
	"TecPonto Atendente",
	"TecPonto Tecnico",
	"TecPonto Gestor",
	"TecPonto Direcao",
)

REPAIR_STATES = (
	"Recebido", "Em diagnostico", "Aguardando aprovacao", "Aprovado", "Em reparo",
	"Em testes", "Pronto para retirada", "Entregue", "Rejeitado", "Cancelado",
	"Sem conserto", "Aguardando peca",
)
TRADE_IN_STATES = (
	"Triagem de troca", "Avaliacao", "Oferta pendente", "Oferta apresentada",
	"Oferta aceita", "Oferta recusada", "Aquisicao aprovada", "Em revisao",
	"Pronto para venda", "Encerrado",
)
STATES = tuple(dict.fromkeys((*REPAIR_STATES, *TRADE_IN_STATES)))

REPAIR_ACTIONS = (
	"Iniciar diagnostico", "Enviar orcamento", "Aprovar orcamento", "Recusar orcamento",
	"Iniciar reparo", "Iniciar testes", "Liberar para retirada", "Entregar", "Cancelar",
	"Encerrar sem conserto", "Aguardar peca", "Retomar reparo",
)
TRADE_IN_ACTIONS = (
	"Iniciar avaliacao", "Preparar oferta", "Apresentar oferta", "Aceitar oferta",
	"Recusar oferta", "Aprovar aquisicao", "Iniciar revisao", "Liberar para venda", "Encerrar",
)
ACTIONS = tuple(dict.fromkeys((*REPAIR_ACTIONS, *TRADE_IN_ACTIONS)))

PRINT_FORMATS = (
	("TecPonto Ordem de Servico", "Repair Order", "repair_order.html"),
	("TecPonto Avaliacao de Troca", "Trade In Evaluation", "trade_in_evaluation.html"),
)

NUMBER_CARDS = (
	("TecPonto OS Abertas", "tecponto.number_cards.open_repairs", "#FE5000", "#FFF1E8"),
	("TecPonto OS Atrasadas", "tecponto.number_cards.late_repairs", "#EF4444", "#FFF1F2"),
	("TecPonto Aguardando Diagnostico", "tecponto.number_cards.awaiting_diagnosis", "#3B82F6", "#EFF6FF"),
	("TecPonto Aguardando Aprovacao", "tecponto.number_cards.awaiting_approval", "#FE5000", "#FFF1E8"),
	("TecPonto Prontas para Retirada", "tecponto.number_cards.ready_for_pickup", "#28C76F", "#ECFDF3"),
	("TecPonto Trocas Abertas", "tecponto.number_cards.open_trades", "#8286FF", "#F0F1FF"),
	("TecPonto Ofertas Pendentes", "tecponto.number_cards.trade_offers_pending", "#FF9F43", "#FFF7ED"),
	("TecPonto Usados Prontos", "tecponto.number_cards.used_devices_ready", "#28C76F", "#ECFDF3"),
	("TecPonto Itens em Baixa", "tecponto.number_cards.low_stock_items", "#FF9F43", "#FFF7ED"),
	("TecPonto Caixa Aberto", "tecponto.number_cards.open_cash_sessions", "#28C76F", "#ECFDF3"),
	("TecPonto Vendas Hoje", "tecponto.number_cards.sales_today", "#FE5000", "#FFF1E8"),
	("TecPonto Recebimentos Pendentes", "tecponto.number_cards.pending_receivables", "#EF4444", "#FFF1F2"),
)

ALL_DESK_ROLES = (*ROLES, "System Manager")


def after_install():
	ensure_setup()


def ensure_setup():
	ensure_roles()
	ensure_workflow_masters()
	ensure_repair_workflow()
	ensure_repair_workflow_extensions()
	ensure_trade_in_workflow()
	ensure_print_formats()
	ensure_number_cards()
	ensure_workspaces()


def ensure_roles():
	for role_name in ROLES:
		if not frappe.db.exists("Role", role_name):
			frappe.get_doc(
				{"doctype": "Role", "role_name": role_name, "desk_access": 1}
			).insert(ignore_permissions=True)
		else:
			frappe.db.set_value("Role", role_name, "desk_access", 1, update_modified=False)

	administrator = frappe.get_doc("User", "Administrator")
	administrator_roles = set(frappe.get_roles("Administrator"))
	for role_name in ROLES:
		if role_name not in administrator_roles:
			administrator.add_roles(role_name)


def ensure_workflow_masters():
	for state_name in STATES:
		if not frappe.db.exists("Workflow State", state_name):
			frappe.get_doc(
				{"doctype": "Workflow State", "workflow_state_name": state_name}
			).insert(ignore_permissions=True)

	for action_name in ACTIONS:
		if not frappe.db.exists("Workflow Action Master", action_name):
			frappe.get_doc(
				{"doctype": "Workflow Action Master", "workflow_action_name": action_name}
			).insert(ignore_permissions=True)


def ensure_repair_workflow():
	workflow_name = "Fluxo de Ordem de Servico TecPonto"
	if frappe.db.exists("Workflow", workflow_name):
		return

	attendant, technician, manager = ROLES[:3]
	frappe.get_doc(
		{
			"doctype": "Workflow",
			"workflow_name": workflow_name,
			"document_type": "Repair Order",
			"workflow_state_field": "workflow_state",
			"is_active": 1,
			"send_email_alert": 0,
			"enable_action_confirmation": 1,
			"states": [
				{"state": "Recebido", "doc_status": "0", "allow_edit": attendant},
				{"state": "Em diagnostico", "doc_status": "0", "allow_edit": technician},
				{"state": "Aguardando aprovacao", "doc_status": "0", "allow_edit": attendant, "update_field": "approval_status", "update_value": "Pendente"},
				{"state": "Aprovado", "doc_status": "0", "allow_edit": technician, "update_field": "approval_status", "update_value": "Aprovado"},
				{"state": "Em reparo", "doc_status": "0", "allow_edit": technician},
				{"state": "Em testes", "doc_status": "0", "allow_edit": technician},
				{"state": "Pronto para retirada", "doc_status": "0", "allow_edit": attendant},
				{"state": "Entregue", "doc_status": "0", "allow_edit": manager},
				{"state": "Sem conserto", "doc_status": "0", "allow_edit": technician},
				{"state": "Rejeitado", "doc_status": "0", "allow_edit": attendant, "update_field": "approval_status", "update_value": "Recusado"},
				{"state": "Cancelado", "doc_status": "0", "allow_edit": manager},
			],
			"transitions": [
				_transition("Recebido", "Iniciar diagnostico", "Em diagnostico", technician),
				_transition("Em diagnostico", "Enviar orcamento", "Aguardando aprovacao", technician),
				_transition("Aguardando aprovacao", "Aprovar orcamento", "Aprovado", attendant),
				_transition("Aguardando aprovacao", "Recusar orcamento", "Rejeitado", attendant),
				_transition("Aprovado", "Iniciar reparo", "Em reparo", technician),
				_transition("Em reparo", "Iniciar testes", "Em testes", technician),
				_transition("Em testes", "Liberar para retirada", "Pronto para retirada", technician),
				_transition("Pronto para retirada", "Entregar", "Entregue", attendant),
				_transition("Em diagnostico", "Encerrar sem conserto", "Sem conserto", technician),
				_transition("Em reparo", "Encerrar sem conserto", "Sem conserto", technician),
				_transition("Rejeitado", "Cancelar", "Cancelado", manager),
			],
		}
	).insert(ignore_permissions=True)


def ensure_repair_workflow_extensions():
	"""Acrescenta estados operacionais novos sem recriar o workflow existente."""
	workflow_name = "Fluxo de Ordem de Servico TecPonto"
	if not frappe.db.exists("Workflow", workflow_name):
		return

	workflow = frappe.get_doc("Workflow", workflow_name)
	technician = "TecPonto Tecnico"
	changed = False
	for state in ("Sem conserto", "Aguardando peca"):
		if not any(row.state == state for row in workflow.states):
			workflow.append(
				"states",
				{"state": state, "doc_status": "0", "allow_edit": technician},
			)
			changed = True

	existing_transitions = {
		(row.state, row.action, row.next_state) for row in workflow.transitions
	}
	transitions = (
		("Em diagnostico", "Encerrar sem conserto", "Sem conserto"),
		("Em reparo", "Encerrar sem conserto", "Sem conserto"),
		("Aguardando peca", "Encerrar sem conserto", "Sem conserto"),
		("Aprovado", "Aguardar peca", "Aguardando peca"),
		("Em reparo", "Aguardar peca", "Aguardando peca"),
		("Aguardando peca", "Retomar reparo", "Em reparo"),
	)
	for state, action, next_state in transitions:
		key = (state, action, next_state)
		if key not in existing_transitions:
			workflow.append(
				"transitions",
				_transition(state, action, next_state, technician),
			)
			changed = True

	if changed:
		workflow.save(ignore_permissions=True)


def ensure_trade_in_workflow():
	workflow_name = "Fluxo de Avaliacao de Troca TecPonto"
	if frappe.db.exists("Workflow", workflow_name):
		return

	attendant, technician, manager = ROLES[:3]
	frappe.get_doc(
		{
			"doctype": "Workflow",
			"workflow_name": workflow_name,
			"document_type": "Trade In Evaluation",
			"workflow_state_field": "workflow_state",
			"is_active": 1,
			"send_email_alert": 0,
			"enable_action_confirmation": 1,
			"states": [
				{"state": "Triagem de troca", "doc_status": "0", "allow_edit": attendant},
				{"state": "Avaliacao", "doc_status": "0", "allow_edit": technician},
				{"state": "Oferta pendente", "doc_status": "0", "allow_edit": manager, "update_field": "offer_status", "update_value": "Pendente"},
				{"state": "Oferta apresentada", "doc_status": "0", "allow_edit": attendant, "update_field": "offer_status", "update_value": "Apresentada"},
				{"state": "Oferta aceita", "doc_status": "0", "allow_edit": manager, "update_field": "offer_status", "update_value": "Aceita"},
				{"state": "Oferta recusada", "doc_status": "0", "allow_edit": attendant, "update_field": "offer_status", "update_value": "Recusada"},
				{"state": "Aquisicao aprovada", "doc_status": "0", "allow_edit": technician},
				{"state": "Em revisao", "doc_status": "0", "allow_edit": technician},
				{"state": "Pronto para venda", "doc_status": "0", "allow_edit": manager},
				{"state": "Encerrado", "doc_status": "0", "allow_edit": manager},
			],
			"transitions": [
				_transition("Triagem de troca", "Iniciar avaliacao", "Avaliacao", technician),
				_transition("Avaliacao", "Preparar oferta", "Oferta pendente", technician),
				_transition("Oferta pendente", "Apresentar oferta", "Oferta apresentada", manager),
				_transition("Oferta apresentada", "Aceitar oferta", "Oferta aceita", attendant),
				_transition("Oferta apresentada", "Recusar oferta", "Oferta recusada", attendant),
				_transition("Oferta aceita", "Aprovar aquisicao", "Aquisicao aprovada", manager),
				_transition("Aquisicao aprovada", "Iniciar revisao", "Em revisao", technician),
				_transition("Em revisao", "Liberar para venda", "Pronto para venda", technician),
				_transition("Oferta recusada", "Encerrar", "Encerrado", attendant),
				_transition("Pronto para venda", "Encerrar", "Encerrado", manager),
			],
		}
	).insert(ignore_permissions=True)


def _transition(state, action, next_state, allowed):
	return {
		"state": state,
		"action": action,
		"next_state": next_state,
		"allowed": allowed,
		"allow_self_approval": 1,
	}


def ensure_print_formats():
	for print_format_name, doc_type, template_name in PRINT_FORMATS:
		template_path = Path(
			frappe.get_app_path("tecponto", "templates", "print_formats", template_name)
		)
		html = template_path.read_text(encoding="utf-8")
		if frappe.db.exists("Print Format", print_format_name):
			print_format = frappe.get_doc("Print Format", print_format_name)
			if print_format.html != html:
				print_format.html = html
				print_format.save(ignore_permissions=True)
			continue

		frappe.get_doc(
			{
				"doctype": "Print Format",
				"name": print_format_name,
				"print_format_name": print_format_name,
				"doc_type": doc_type,
				"custom_format": 1,
				"print_format_type": "Jinja",
				"html": html,
			}
		).insert(ignore_permissions=True)


def ensure_number_cards():
	for label, method, color, background_color in NUMBER_CARDS:
		name = frappe.db.get_value("Number Card", {"label": label}, "name")
		if name:
			card = frappe.get_doc("Number Card", name)
		else:
			card = frappe.get_doc({"doctype": "Number Card", "label": label})

		card.update(
			{
				"is_standard": 1,
				"module": "TecPonto",
				"label": label,
				"type": "Custom",
				"method": method,
				"is_public": 1,
				"show_percentage_stats": 0,
				"show_full_number": 1,
				"color": color,
				"background_color": background_color,
			}
		)
		card.save(ignore_permissions=True)


def ensure_workspaces():
	def card_break(label, icon=None, description=None):
		row = {"type": "Card Break", "label": label, "hidden": 0, "link_count": 0}
		if icon:
			row["icon"] = icon
		if description:
			row["description"] = description
		return row

	def link(label, link_type, link_to, onboard=1, is_query_report=0):
		return {
			"type": "Link",
			"label": label,
			"link_type": link_type,
			"link_to": link_to,
			"is_query_report": is_query_report,
			"onboard": onboard,
			"hidden": 0,
			"link_count": 0,
		}

	def shortcut(label, shortcut_type, link_to, doc_view=None, color="#FE5000"):
		row = {
			"type": shortcut_type,
			"label": label,
			"link_to": link_to,
			"color": color,
			"format": "{}",
			"stats_filter": "[]",
		}
		if doc_view:
			row["doc_view"] = doc_view
		return row

	def number_card(number_card_name, label=None):
		return {"number_card_name": number_card_name, "label": label or number_card_name}

	def workspace_content(spec):
		blocks = []

		def add(block_type, data):
			blocks.append(
				{
					"id": f"tp-{spec['label'].lower()}-{len(blocks) + 1:02d}",
					"type": block_type,
					"data": data,
				}
			)

		number_cards = spec.get("number_cards", [])
		shortcuts = spec.get("shortcuts", [])
		card_breaks = [row for row in spec.get("links", []) if row.get("type") == "Card Break"]

		if number_cards:
			add("header", {"text": "<span class=\"h4\"><b>Indicadores</b></span>", "col": 12})
			for row in number_cards:
				add("number_card", {"number_card_name": row["number_card_name"], "col": 3})

		if shortcuts:
			add("spacer", {"col": 12})
			add("header", {"text": "<span class=\"h4\"><b>Atalhos</b></span>", "col": 12})
			for row in shortcuts:
				add("shortcut", {"shortcut_name": row["label"], "col": 3})

		if card_breaks:
			add("spacer", {"col": 12})
			add("header", {"text": "<span class=\"h4\"><b>Rotinas</b></span>", "col": 12})
			for row in card_breaks:
				add("card", {"card_name": row["label"], "col": 4})

		return json.dumps(blocks, ensure_ascii=True, separators=(",", ":"))

	workspaces = (
		{
			"label": "TecPonto",
			"title": "TecPonto",
			"icon": "tool",
			"indicator_color": "orange",
			"sequence_id": 1,
			"roles": ALL_DESK_ROLES,
			"number_cards": [
				number_card("TecPonto OS Abertas", "OS abertas"),
				number_card("TecPonto Trocas Abertas", "Trocas abertas"),
				number_card("TecPonto Itens em Baixa", "Itens em baixa"),
				number_card("TecPonto Caixa Aberto", "Caixa aberto"),
			],
			"shortcuts": [
				shortcut("Nova OS", "DocType", "Repair Order", "New"),
				shortcut("Nova troca", "DocType", "Trade In Evaluation", "New"),
				shortcut("Vendas e acessorios", "Page", "tecponto-sales"),
				shortcut("Relatorios", "Page", "tecponto-reports", color="#25292C"),
			],
			"links": [
				card_break("Repare", "tool", "Atendimento, diagnostico, orcamento e bancada."),
				link("Ordens de servico", "DocType", "Repair Order"),
				link("Aparelhos dos clientes", "DocType", "Service Device"),
				link("Clientes", "DocType", "Customer"),
				card_break("Troque", "repeat", "Avaliacao de usados, oferta e revisao."),
				link("Avaliacoes de troca", "DocType", "Trade In Evaluation"),
				card_break("Compre", "shopping-cart", "Vendas, acessorios e estoque de varejo."),
				link("Vendas e acessorios", "Page", "tecponto-sales"),
				link("Pecas, servicos e produtos", "DocType", "Item"),
				card_break("Financeiro", "credit-card", "Caixa, faturamento e relatorios de gestao."),
				link("Faturas de venda", "DocType", "Sales Invoice"),
				link("Relatorios TecPonto", "Page", "tecponto-reports"),
			],
		},
		{
			"label": "Repare",
			"title": "Repare",
			"parent_page": "TecPonto",
			"icon": "tool",
			"indicator_color": "orange",
			"sequence_id": 2,
			"roles": ALL_DESK_ROLES,
			"number_cards": [
				number_card("TecPonto OS Abertas", "OS abertas"),
				number_card("TecPonto OS Atrasadas", "Atrasadas"),
				number_card("TecPonto Aguardando Diagnostico", "Diagnostico"),
				number_card("TecPonto Aguardando Aprovacao", "Aguardando aprovacao"),
				number_card("TecPonto Prontas para Retirada", "Prontas"),
			],
			"shortcuts": [
				shortcut("Nova OS", "DocType", "Repair Order", "New"),
				shortcut("Lista de OS", "DocType", "Repair Order", "List", color="#25292C"),
				shortcut("Kanban de OS", "DocType", "Repair Order", "Kanban", color="#25292C"),
				shortcut("Cadastrar aparelho", "DocType", "Service Device", "New"),
			],
			"links": [
				card_break("Atendimento"),
				link("Nova ordem de servico", "DocType", "Repair Order"),
				link("Aparelhos dos clientes", "DocType", "Service Device"),
				link("Clientes", "DocType", "Customer"),
				card_break("Oficina"),
				link("Pecas e servicos", "DocType", "Item"),
				link("Movimentacoes de estoque", "DocType", "Stock Entry", onboard=0),
				link("Saldo de estoque", "Report", "Stock Balance", is_query_report=1),
			],
		},
		{
			"label": "Troque",
			"title": "Troque",
			"parent_page": "TecPonto",
			"icon": "refresh-cw",
			"indicator_color": "purple",
			"sequence_id": 3,
			"roles": ALL_DESK_ROLES,
			"number_cards": [
				number_card("TecPonto Trocas Abertas", "Trocas abertas"),
				number_card("TecPonto Ofertas Pendentes", "Ofertas pendentes"),
				number_card("TecPonto Usados Prontos", "Prontos para venda"),
			],
			"shortcuts": [
				shortcut("Nova avaliacao", "DocType", "Trade In Evaluation", "New"),
				shortcut("Avaliacoes", "DocType", "Trade In Evaluation", "List", color="#25292C"),
				shortcut("Cadastrar aparelho", "DocType", "Service Device", "New"),
			],
			"links": [
				card_break("Fluxo de troca"),
				link("Avaliacoes de troca", "DocType", "Trade In Evaluation"),
				link("Checklist de avaliacao", "DocType", "Trade In Checklist Item"),
				link("Aparelhos dos clientes", "DocType", "Service Device"),
				card_break("Usados e revisao"),
				link("Itens usados", "DocType", "Item"),
				link("Perfis de item TecPonto", "DocType", "TecPonto Item Profile"),
				link("Entrada de estoque", "DocType", "Stock Entry", onboard=0),
			],
		},
		{
			"label": "Compre",
			"title": "Compre",
			"parent_page": "TecPonto",
			"icon": "shopping-cart",
			"indicator_color": "green",
			"sequence_id": 4,
			"roles": ("TecPonto Atendente", "TecPonto Gestor", "TecPonto Direcao", "System Manager"),
			"number_cards": [
				number_card("TecPonto Vendas Hoje", "Vendas hoje"),
				number_card("TecPonto Itens em Baixa", "Itens em baixa"),
			],
			"shortcuts": [
				shortcut("Registrar venda", "Page", "tecponto-sales"),
				shortcut("Novo cliente", "DocType", "Customer", "New"),
				shortcut("Itens de varejo", "DocType", "Item", "List", color="#25292C"),
			],
			"links": [
				card_break("Vendas"),
				link("Vendas e acessorios", "Page", "tecponto-sales"),
				link("Faturas de venda", "DocType", "Sales Invoice"),
				link("Clientes", "DocType", "Customer"),
				card_break("Estoque de varejo"),
				link("Pecas, acessorios e aparelhos", "DocType", "Item"),
				link("Perfis de item TecPonto", "DocType", "TecPonto Item Profile"),
				link("Saldo de estoque", "Report", "Stock Balance", is_query_report=1),
			],
		},
		{
			"label": "Financeiro",
			"title": "Financeiro",
			"parent_page": "TecPonto",
			"icon": "credit-card",
			"indicator_color": "blue",
			"sequence_id": 5,
			"roles": ("TecPonto Gestor", "TecPonto Direcao", "System Manager"),
			"number_cards": [
				number_card("TecPonto Caixa Aberto", "Caixa aberto"),
				number_card("TecPonto Vendas Hoje", "Vendas hoje"),
				number_card("TecPonto Recebimentos Pendentes", "Recebimentos pendentes"),
			],
			"shortcuts": [
				shortcut("Relatorios TecPonto", "Page", "tecponto-reports"),
				shortcut("Caixa", "DocType", "TecPonto Cash Session", "List"),
				shortcut("Faturas", "DocType", "Sales Invoice", "List", color="#25292C"),
			],
			"links": [
				card_break("Caixa"),
				link("Sessoes de caixa", "DocType", "TecPonto Cash Session"),
				link("Movimentos de caixa", "DocType", "TecPonto Cash Movement"),
				card_break("Faturamento"),
				link("Faturas de venda", "DocType", "Sales Invoice"),
				link("Relatorios TecPonto", "Page", "tecponto-reports"),
				card_break("Configuracao"),
				link("Politicas operacionais", "DocType", "TecPonto Operations Settings", onboard=0),
				link("Integracoes", "DocType", "TecPonto Integration Settings", onboard=0),
			],
		},
	)

	for spec in workspaces:
		workspace = (
			frappe.get_doc("Workspace", spec["label"])
			if frappe.db.exists("Workspace", spec["label"])
			else frappe.get_doc({"doctype": "Workspace", "label": spec["label"]})
		)
		workspace.update(
			{
				"app": "tecponto",
				"module": "TecPonto",
				"title": spec["title"],
				"parent_page": spec.get("parent_page", ""),
				"public": 1,
				"is_hidden": 0,
				"hide_custom": 0,
				"icon": spec.get("icon", "tool"),
				"indicator_color": spec.get("indicator_color", "orange"),
				"sequence_id": spec.get("sequence_id", 1),
				"type": "Workspace",
				"content": workspace_content(spec),
			}
		)
		workspace.set("roles", [{"role": role} for role in spec["roles"]])
		workspace.set("number_cards", spec.get("number_cards", []))
		workspace.set("shortcuts", spec.get("shortcuts", []))
		workspace.set("links", spec.get("links", []))
		workspace.set("charts", [])
		workspace.set("quick_lists", [])
		workspace.set("custom_blocks", [])
		workspace.save(ignore_permissions=True)

	frappe.clear_cache()
