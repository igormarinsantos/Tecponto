import frappe
from frappe import _
from frappe.model.workflow import apply_workflow
from frappe.utils import get_datetime, now_datetime, time_diff_in_hours


TECPONTO_ROLES = {
	"TecPonto Atendente",
	"TecPonto Tecnico",
	"TecPonto Gestor",
	"TecPonto Direcao",
}

OPEN_REPAIR_STATES = (
	"Recebido",
	"Em diagnostico",
	"Aguardando aprovacao",
	"Aprovado",
	"Aguardando peca",
	"Em reparo",
	"Em testes",
	"Pronto para retirada",
)

OPEN_TRADE_STATES = (
	"Triagem de troca",
	"Avaliacao",
	"Oferta pendente",
	"Oferta apresentada",
	"Oferta aceita",
	"Aquisicao aprovada",
	"Em revisao",
	"Pronto para venda",
)


def _ensure_operator():
	if not TECPONTO_ROLES.intersection(frappe.get_roles()):
		frappe.throw(_("Você não tem acesso ao painel operacional."), frappe.PermissionError)


def _count(doctype, filters=None):
	return frappe.db.count(doctype, filters=filters or {})


def _repair_stage(label, states, tone):
	return {
		"label": label,
		"count": _count("Repair Order", {"workflow_state": ["in", states]}),
		"tone": tone,
		"href": f"/desk/repair-order?workflow_state={states[0]}",
	}


def _stock_summary():
	roles = set(frappe.get_roles())
	if not {"TecPonto Gestor", "TecPonto Direcao", "System Manager"}.intersection(roles):
		return None

	profiles = frappe.get_all(
		"TecPonto Item Profile",
		filters={"active": 1, "operational_type": ["in", ("Aparelho", "Acessório", "Peça")]},
		fields=[
			"item",
			"operational_type",
			"minimum_stock",
			"default_warehouse",
		],
		order_by="operational_type, item",
	)
	items = []
	for profile in profiles:
		filters = {"item_code": profile.item}
		if profile.default_warehouse:
			filters["warehouse"] = profile.default_warehouse
		rows = frappe.get_all("Bin", filters=filters, fields=["actual_qty"])
		actual_qty = sum(float(row.actual_qty or 0) for row in rows)
		minimum_stock = float(profile.minimum_stock or 0)
		items.append(
			{
				"item": profile.item,
				"type": profile.operational_type,
				"actual_qty": actual_qty,
				"minimum_stock": minimum_stock,
				"is_low": minimum_stock > 0 and actual_qty <= minimum_stock,
			}
		)

	low_items = [item for item in items if item["is_low"]]
	return {
		"tracked_items": len(items),
		"low_count": len(low_items),
		"low_items": low_items[:6],
	}


def _cash_summary():
	if "TecPonto Direcao" not in frappe.get_roles() and "System Manager" not in frappe.get_roles():
		return None
	settings = frappe.get_single("TecPonto Operations Settings")
	session_name = frappe.db.get_value(
		"TecPonto Cash Session", {"status": "Aberto"}, "name"
	)
	data = {
		"enabled": bool(settings.finance_process_approved and settings.cash_control_enabled),
		"session": session_name,
		"status": "Aberto" if session_name else "Fechado",
	}
	if session_name:
		data.update(
			frappe.db.get_value(
				"TecPonto Cash Session",
				session_name,
				["opening_amount", "total_in", "total_out", "expected_amount"],
				as_dict=True,
			)
		)
	return data


def _role_profile():
	roles = set(frappe.get_roles())
	if "TecPonto Direcao" in roles:
		return "direction"
	if "TecPonto Gestor" in roles:
		return "manager"
	if "TecPonto Tecnico" in roles:
		return "technician"
	return "attendant"


def _management_insights():
	"""Transforma a fila operacional em poucas decisões claras para gestão."""
	if _role_profile() not in {"manager", "direction"}:
		return None

	rows = frappe.get_all(
		"Repair Order",
		filters={"workflow_state": ["in", OPEN_REPAIR_STATES]},
		fields=[
			"workflow_state",
			"technician",
			"promised_at",
			"part_expected_at",
			"stage_changed_at",
			"modified",
		],
		limit_page_length=0,
	)
	state_labels = {
		"Recebido": "Entrada",
		"Em diagnostico": "Diagnóstico",
		"Aguardando aprovacao": "Aprovação do cliente",
		"Aprovado": "Início do reparo",
		"Aguardando peca": "Peças",
		"Em reparo": "Reparo",
		"Em testes": "Testes",
		"Pronto para retirada": "Retirada",
	}
	state_counts = {}
	loads = {}
	unassigned = 0
	late = 0
	waiting_parts = 0
	overdue_parts = 0
	ages = []
	now = now_datetime()
	for row in rows:
		state_counts[row.workflow_state] = state_counts.get(row.workflow_state, 0) + 1
		is_late = bool(row.promised_at and get_datetime(row.promised_at) < now)
		late += int(is_late)
		if not row.technician:
			unassigned += 1
		else:
			load = loads.setdefault(row.technician, {"count": 0, "late": 0})
			load["count"] += 1
			load["late"] += int(is_late)
		if row.workflow_state == "Aguardando peca":
			waiting_parts += 1
			overdue_parts += int(
				bool(row.part_expected_at and get_datetime(row.part_expected_at) < now)
			)
		changed_at = row.stage_changed_at or row.modified
		if changed_at:
			ages.append(max(0, time_diff_in_hours(now, get_datetime(changed_at))))

	bottleneck_state = max(state_counts, key=state_counts.get) if state_counts else None
	bottleneck_count = state_counts.get(bottleneck_state, 0)
	late_rate = round((late / len(rows)) * 100) if rows else 0
	user_names = {
		user: frappe.db.get_value("User", user, "full_name") or user
		for user in loads
	}
	technician_load = sorted(
		(
			{
				"user": user,
				"label": user_names[user],
				"count": values["count"],
				"late": values["late"],
			}
			for user, values in loads.items()
		),
		key=lambda item: (-item["count"], -item["late"], item["label"]),
	)[:6]

	return {
		"insights": [
			{
				"label": "Gargalo atual",
				"value": bottleneck_count,
				"title": state_labels.get(bottleneck_state, "Fila equilibrada"),
				"description": (
					"É a etapa com mais aparelhos agora. Priorize a saída desta coluna."
					if bottleneck_state
					else "Não há reparos abertos."
				),
				"tone": "orange",
				"href": (
					f"/desk/repair-order?workflow_state={bottleneck_state}"
					if bottleneck_state
					else "/desk/repair-order"
				),
				"action": "Abrir fila",
			},
			{
				"label": "Sem responsável",
				"value": unassigned,
				"title": "OS para distribuir" if unassigned else "Bancada distribuída",
				"description": (
					"Atribua um técnico antes que o prazo comece a escapar."
					if unassigned
					else "Toda OS aberta tem um técnico responsável."
				),
				"tone": "red" if unassigned else "green",
				"href": "/desk/repair-order?technician=%5B%22is%22%2C%22not%20set%22%5D",
				"action": "Distribuir",
			},
			{
				"label": "Dependência externa",
				"value": waiting_parts,
				"title": "Aguardando peça",
				"description": (
					f"{overdue_parts} previsão(ões) já vencida(s)."
					if overdue_parts
					else "Nenhuma previsão de peça está vencida."
				),
				"tone": "red" if overdue_parts else "yellow",
				"href": "/desk/repair-order?workflow_state=Aguardando%20peca",
				"action": "Ver peças",
			},
			{
				"label": "Saúde dos prazos",
				"value": f"{late_rate}%",
				"title": f"{late} OS atrasada(s)",
				"description": "Percentual calculado sobre toda a oficina aberta.",
				"tone": "red" if late else "green",
				"href": "/desk/repair-order?sla_status=Atrasado",
				"action": "Tratar atrasos",
			},
		],
		"technician_load": technician_load,
		"health": {
			"open": len(rows),
			"late": late,
			"late_rate": late_rate,
			"oldest_stage_hours": round(max(ages), 1) if ages else 0,
		},
	}


def _technician_board(selected_technician=None):
	profile = _role_profile()
	if profile not in {"technician", "gestor", "direcao"}:
		return None

	filters = {"workflow_state": ["in", OPEN_REPAIR_STATES]}
	if profile == "technician":
		filters["technician"] = frappe.session.user
	elif selected_technician:
		filters["technician"] = selected_technician

	rows = frappe.get_list(
		"Repair Order",
		filters=filters,
		fields=[
			"name",
			"customer_name",
			"device",
			"workflow_state",
			"priority",
			"service_type",
			"promised_at",
			"sla_status",
			"reported_issue",
			"intake_front_photo",
			"intake_back_photo",
			"waiting_part_details",
			"part_expected_at",
			"stage_changed_at",
			"modified",
			"technician",
		],
		order_by="promised_at asc, priority desc, modified asc",
		limit_page_length=100,
	)
	device_names = {
		row.device: frappe.db.get_value(
			"Service Device",
			row.device,
			["brand", "model"],
			as_dict=True,
		)
		for row in rows
	}
	column_map = {
		"Recebido": "diagnosis",
		"Em diagnostico": "diagnosis",
		"Aguardando aprovacao": "approval",
		"Aguardando peca": "parts",
		"Aprovado": "repair",
		"Em reparo": "repair",
		"Em testes": "tests",
		"Pronto para retirada": "ready",
	}
	columns = [
		{"key": "diagnosis", "label": "Para diagnosticar", "tone": "blue", "cards": []},
		{"key": "approval", "label": "Aguardando aprovação", "tone": "orange", "cards": []},
		{"key": "parts", "label": "Aguardando peça", "tone": "yellow", "cards": []},
		{"key": "repair", "label": "Em reparo", "tone": "purple", "cards": []},
		{"key": "tests", "label": "Em testes", "tone": "blue", "cards": []},
		{"key": "ready", "label": "Pronto", "tone": "green", "cards": []},
	]
	by_key = {column["key"]: column for column in columns}
	for row in rows:
		device = device_names.get(row.device) or {}
		changed_at = row.stage_changed_at or row.modified
		row["device_label"] = " ".join(
			value for value in (device.get("brand"), device.get("model")) if value
		) or row.device
		row["stage_hours"] = max(
			0,
			round(time_diff_in_hours(now_datetime(), get_datetime(changed_at)), 1),
		)
		row["photos_complete"] = bool(
			row.intake_front_photo and row.intake_back_photo
		)
		row["is_late"] = bool(
			row.promised_at
			and get_datetime(row.promised_at) < now_datetime()
		)
		column_key = column_map.get(row.workflow_state)
		if column_key:
			by_key[column_key]["cards"].append(row)
	return {
		"columns": columns,
		"total": len(rows),
		"user": frappe.session.user,
	}


@frappe.whitelist()
def move_repair_card(
	repair_order,
	target_state,
	waiting_part_details=None,
	part_expected_at=None,
	no_repair_reason=None,
):
	"""Move uma OS pelo Kanban respeitando as mesmas transições do workflow."""
	roles = set(frappe.get_roles())
	allowed_roles = {"TecPonto Técnico", "TecPonto Gestor", "TecPonto Direcao", "TecPonto Tecnico"}
	if (
		frappe.session.user != "Administrator"
		and not roles.intersection(allowed_roles)
	):
		frappe.throw(_("Seu perfil não pode movimentar a bancada."), frappe.PermissionError)

	order = frappe.get_doc("Repair Order", repair_order)
	order.check_permission("write")
	if (
		"TecPonto Tecnico" in roles or "TecPonto Técnico" in roles
	) and not {"TecPonto Gestor", "TecPonto Direcao"}.intersection(roles):
		if order.technician and order.technician != frappe.session.user:
			frappe.throw(_("Esta ordem está atribuída a outro técnico."))
		if not order.technician:
			order.technician = frappe.session.user

	if target_state == order.workflow_state:
		return {"name": order.name, "workflow_state": order.workflow_state}

	action_map = {
		("Recebido", "Em diagnostico"): "Iniciar diagnostico",
		("Em diagnostico", "Aguardando aprovacao"): "Enviar orcamento",
		("Recebido", "Sem conserto"): "Encerrar sem conserto",
		("Em diagnostico", "Sem conserto"): "Encerrar sem conserto",
		("Aprovado", "Em reparo"): "Iniciar reparo",
		("Aprovado", "Aguardando peca"): "Aguardar peca",
		("Em reparo", "Aguardando peca"): "Aguardar peca",
		("Aguardando peca", "Em reparo"): "Retomar reparo",
		("Em reparo", "Em testes"): "Iniciar testes",
		("Em testes", "Pronto para retirada"): "Liberar para retirada",
	}
	action = action_map.get((order.workflow_state, target_state))
	if not action:
		frappe.throw(
			_("Movimento inválido: {0} → {1}.").format(
				order.workflow_state,
				target_state,
			)
		)

	if target_state == "Aguardando peca":
		order.waiting_part_details = waiting_part_details
		order.part_expected_at = part_expected_at
		order.save(ignore_permissions=True)
	elif target_state == "Sem conserto":
		order.no_repair_reason = no_repair_reason
		order.save(ignore_permissions=True)
	elif order.has_value_changed("technician"):
		order.save(ignore_permissions=True)

	order = apply_workflow(order, action)
	frappe.db.commit()
	return {"name": order.name, "workflow_state": order.workflow_state}



@frappe.whitelist()
def get_summary():
	"""Resumo mínimo para orientar a operação sem expor a complexidade do ERPNext."""
	_ensure_operator()

	open_repairs = _count(
		"Repair Order", {"workflow_state": ["in", OPEN_REPAIR_STATES]}
	)
	urgent_repairs = _count(
		"Repair Order",
		{
			"workflow_state": ["in", OPEN_REPAIR_STATES],
			"priority": "Urgente",
		},
	)
	late_repairs = _count(
		"Repair Order",
		{
			"workflow_state": ["in", OPEN_REPAIR_STATES],
			"promised_at": ["<", now_datetime()],
		},
	)
	awaiting_approval = _count(
		"Repair Order", {"workflow_state": "Aguardando aprovacao"}
	)
	ready_for_pickup = _count(
		"Repair Order", {"workflow_state": "Pronto para retirada"}
	)
	open_trades = _count(
		"Trade In Evaluation", {"workflow_state": ["in", OPEN_TRADE_STATES]}
	)
	trades_to_evaluate = _count(
		"Trade In Evaluation",
		{"workflow_state": ["in", ("Triagem de troca", "Avaliacao")]},
	)
	trade_offers = _count(
		"Trade In Evaluation",
		{"workflow_state": ["in", ("Oferta pendente", "Oferta apresentada")]},
	)
	trades_in_review = _count(
		"Trade In Evaluation",
		{"workflow_state": ["in", ("Aquisicao aprovada", "Em revisao")]},
	)

	repairs = frappe.get_list(
		"Repair Order",
		filters={"workflow_state": ["in", OPEN_REPAIR_STATES]},
		fields=[
			"name",
			"customer_name",
			"device",
			"workflow_state",
			"priority",
			"service_type",
			"promised_at",
			"modified",
		],
		order_by="modified desc",
		limit_page_length=6,
	)
	for repair in repairs:
		repair["is_late"] = bool(
			repair.promised_at
			and get_datetime(repair.promised_at) < now_datetime()
		)

	trades = frappe.get_list(
		"Trade In Evaluation",
		filters={"workflow_state": ["in", OPEN_TRADE_STATES]},
		fields=[
			"name",
			"customer_name",
			"device",
			"workflow_state",
			"offer_status",
			"modified",
		],
		order_by="modified desc",
		limit_page_length=4,
	)

	role_profile = _role_profile()
	selected_technician = frappe.form_dict.get("selected_technician")
	
	techs = frappe.get_all(
		"Has Role",
		filters={"role": ["in", ("TecPonto Tecnico", "TecPonto Técnico")]},
		fields=["parent as user"]
	)
	techs_list = sorted(list(set(t.user for t in techs)))

	# Fetch combined list of attention items
	repair_items = frappe.get_all(
		"Repair Order",
		filters={"workflow_state": ["in", ("Recebido", "Em diagnostico", "Aguardando aprovacao", "Aguardando peca", "Pronto para retirada")]},
		fields=["name", "customer_name", "customer", "device", "workflow_state", "priority", "modified", "promised_at", "customer_signature_hash"],
		order_by="modified desc",
		limit=10
	)
	for item in repair_items:
		brand = ""
		model = ""
		if item.device:
			dev_val = frappe.db.get_value("Service Device", item.device, ["brand", "model"], as_dict=True)
			if dev_val:
				brand = dev_val.brand or ""
				model = dev_val.model or ""
		item["device_label"] = f"{brand} {model}".strip() or item.device
		whatsapp = frappe.db.get_value("TecPonto Contact Preference", item.customer, "whatsapp_number") or ""
		item["whatsapp"] = whatsapp
		if item.promised_at and get_datetime(item.promised_at) < now_datetime():
			item["urgency"] = "Alta"
		elif item.priority in ("Urgente", "Alta"):
			item["urgency"] = "Alta"
		elif item.priority in ("Normal", "Média"):
			item["urgency"] = "Média"
		else:
			item["urgency"] = "Baixa"
		item["type"] = "repair"

	trade_items = frappe.get_all(
		"Trade In Evaluation",
		filters={"workflow_state": ["in", ("Triagem de troca", "Avaliacao", "Oferta pendente", "Oferta apresentada", "Em revisao")]},
		fields=["name", "customer_name", "customer", "device", "workflow_state", "modified"],
		order_by="modified desc",
		limit=10
	)
	for item in trade_items:
		brand = ""
		model = ""
		if item.device:
			dev_val = frappe.db.get_value("Service Device", item.device, ["brand", "model"], as_dict=True)
			if dev_val:
				brand = dev_val.brand or ""
				model = dev_val.model or ""
		item["device_label"] = f"{brand} {model}".strip() or item.device
		whatsapp = frappe.db.get_value("TecPonto Contact Preference", item.customer, "whatsapp_number") or ""
		item["whatsapp"] = whatsapp
		item["urgency"] = "Baixa"
		item["type"] = "trade"
		
	combined_items = sorted(repair_items + trade_items, key=lambda x: x.modified, reverse=True)[:6]

	# Count of awaiting signature: Recebido or Aguardando aprovacao without signature hash
	awaiting_signature = _count("Repair Order", {
		"workflow_state": ["in", ("Recebido", "Aguardando aprovacao")],
		"customer_signature_hash": ["is", "not set"]
	})

	from frappe.utils import today
	today_sales_count = _count("Sales Invoice", {"creation": [">=", today() + " 00:00:00"]})
	waiting_customers_count = _count("Repair Order", {"workflow_state": "Recebido"})

	return {
		"role_profile": role_profile,
		"technicians_list": techs_list,
		"technician_board": _technician_board(selected_technician),
		"management": _management_insights(),
		"awaiting_approval_count": awaiting_approval,
		"awaiting_signature_count": awaiting_signature,
		"ready_for_pickup_count": ready_for_pickup,
		"late_repairs_count": late_repairs,
		"awaiting_parts_count": _count("Repair Order", {"workflow_state": "Aguardando peca"}),
		"new_repairs_count": _count("Repair Order", {"workflow_state": "Recebido"}),
		"today_sales_count": today_sales_count,
		"waiting_customers_count": waiting_customers_count,
		"attendant_attention_items": combined_items,
		"repair_attention": [
			{
				"label": "Atrasados",
				"description": "Prazo prometido vencido",
				"count": late_repairs,
				"tone": "red",
				"href": "/desk/repair-order?sla_status=Atrasado",
			},
			{
				"label": "Aguardando cliente",
				"description": "Orçamentos para aprovar",
				"count": awaiting_approval,
				"tone": "orange",
				"href": "/desk/repair-order?workflow_state=Aguardando%20aprovacao",
			},
			{
				"label": "Prontos para retirada",
				"description": "Avisar e entregar",
				"count": ready_for_pickup,
				"tone": "green",
				"href": "/desk/repair-order?workflow_state=Pronto%20para%20retirada",
			},
			{
				"label": "Urgentes",
				"description": "Prioridade máxima",
				"count": urgent_repairs,
				"tone": "red",
				"href": "/desk/repair-order?priority=Urgente",
			},
		],
		"trade_attention": [
			{
				"label": "Para avaliar",
				"description": "Aparelhos aguardando análise",
				"count": trades_to_evaluate,
				"tone": "blue",
				"href": "/desk/trade-in-evaluation?workflow_state=Triagem%20de%20troca",
			},
			{
				"label": "Ofertas",
				"description": "Preparar ou confirmar",
				"count": trade_offers,
				"tone": "orange",
				"href": "/desk/trade-in-evaluation?workflow_state=Oferta%20pendente",
			},
			{
				"label": "Em revisão",
				"description": "Preparar para revenda",
				"count": trades_in_review,
				"tone": "purple",
				"href": "/desk/trade-in-evaluation?workflow_state=Em%20revisao",
			},
		],
		"totals": {
			"open_repairs": open_repairs,
			"open_trades": open_trades,
		},
		"stages": [
			_repair_stage("Entrada", ("Recebido",), "neutral"),
			_repair_stage("Diagnóstico", ("Em diagnostico",), "blue"),
			_repair_stage(
				"Orçamento",
				("Aguardando aprovacao", "Aprovado"),
				"orange",
			),
			_repair_stage("Reparo", ("Em reparo",), "purple"),
			_repair_stage("Peça", ("Aguardando peca",), "orange"),
			_repair_stage("Testes", ("Em testes",), "blue"),
			_repair_stage("Retirada", ("Pronto para retirada",), "green"),
		],
		"repairs": repairs,
		"trades": trades,
		"stock": _stock_summary(),
		"cash": _cash_summary(),
	}


@frappe.whitelist()
def get_devices_thumbnails(devices):
	import json
	if isinstance(devices, str):
		devices = json.loads(devices)
	
	result = {}
	for dev in devices:
		photo = frappe.db.get_value(
			"Repair Order",
			{"device": dev, "intake_front_photo": ["is", "set"]},
			"intake_front_photo",
			order_by="modified desc"
		)
		if not photo:
			photo = frappe.db.get_value(
				"Trade In Evaluation",
				{"device": dev, "device_front_photo": ["is", "set"]},
				"device_front_photo",
				order_by="modified desc"
			)
		result[dev] = photo or ""
	return result


@frappe.whitelist()
def get_items_stock_status(items):
	import json
	if isinstance(items, str):
		items = json.loads(items)
		
	result = {}
	for code in items:
		profile = frappe.db.get_value(
			"TecPonto Item Profile",
			{"item": code},
			["minimum_stock", "default_warehouse", "operational_type"],
			as_dict=True
		)
		
		is_stock = frappe.db.get_value("Item", code, "is_stock_item")
		
		if not is_stock:
			result[code] = {
				"actual_qty": None,
				"minimum_stock": None,
				"situation": "Serviço",
				"is_low": False
			}
			continue
			
		minimum_stock = float(profile.minimum_stock or 0) if profile else 0.0
		warehouse = profile.default_warehouse if profile else None
		
		filters = {"item_code": code}
		if warehouse:
			filters["warehouse"] = warehouse
		bins = frappe.get_all("Bin", filters=filters, fields=["actual_qty"])
		actual_qty = sum(float(b.actual_qty or 0) for b in bins)
		
		is_low = minimum_stock > 0 and actual_qty <= minimum_stock
		situation = "Saudável"
		if actual_qty == 0:
			situation = "Sem estoque"
		elif is_low:
			situation = "Estoque baixo"
			
		result[code] = {
			"actual_qty": actual_qty,
			"minimum_stock": minimum_stock,
			"situation": situation,
			"is_low": is_low
		}
	return result
