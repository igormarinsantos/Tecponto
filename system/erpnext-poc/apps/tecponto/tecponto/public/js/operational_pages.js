(() => {
	const ROUTES = {
		"/desk/repair-order": { page: "repairs", icon: "service", action: "Nova OS" },
		"/desk/service-device": { page: "devices", icon: "phone", action: "Cadastrar aparelho" },
		"/desk/trade-in-evaluation": { page: "trades", icon: "trade", action: "Nova avaliação de troca" },
		"/desk/customer": { page: "customers", icon: "customers", action: "Cadastrar cliente" },
		"/desk/item": { page: "stock", icon: "stock", action: "Cadastrar item" },
		"/desk/tecponto-sales": { page: "sales", icon: "stock", action: "Registrar venda" },
		"/desk/tecponto-reports": { page: "reports", icon: "finance", action: "" },
	};
	const OPERATOR_ROLES = [
		"TecPonto Atendente",
		"TecPonto Tecnico",
		"TecPonto Gestor",
		"TecPonto Direcao",
	];
	const PAGE_LENGTH = 20;

	function ui() {
		return window.TecPontoUI || {};
	}

	function icon(name) {
		return ui().icons?.[name] || ui().icons?.overview || "";
	}

	function esc(value) {
		return ui().escapeHtml ? ui().escapeHtml(value) : String(value ?? "");
	}

	function displayState(value) {
		return ui().displayState ? ui().displayState(value) : value || "Sem etapa";
	}

	function isOperator() {
		return Boolean(
			window.frappe &&
				frappe.session?.user !== "Administrator" &&
				OPERATOR_ROLES.some((role) => frappe.user?.has_role?.(role))
		);
	}

	function routeConfig() {
		return ROUTES[window.location.pathname.replace(/\/+$/, "")];
	}

	function formatDate(value, withTime = false) {
		if (!value) return "—";
		const date = new Date(String(value).replace(" ", "T"));
		if (Number.isNaN(date.getTime())) return esc(value);
		return new Intl.DateTimeFormat("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
		}).format(date);
	}

	function initials(value) {
		return String(value || "?")
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0] || "")
			.join("")
			.toUpperCase();
	}

	function statusBadge(label, tone = "neutral", detail = "") {
		return `
			<span class="tp-op-status tp-op-status--${esc(tone)}">
				<i></i><span>${esc(label || "Sem situação")}</span>
			</span>
			${detail ? `<small class="tp-op-cell-detail">${esc(detail)}</small>` : ""}
		`;
	}

	function priorityBadge(priority, isLate) {
		const label = priority === "Urgente" ? "Urgente" : isLate ? "Alta" : "Normal";
		const tone = priority === "Urgente" || isLate ? "danger" : "success";
		return `<span class="tp-op-priority tp-op-priority--${tone}">${esc(label)}</span>`;
	}

	function metricIcon(metric) {
		const map = {
			approval: "clock",
			signature: "automation",
			parts: "stock",
			repair: "service",
			ready: "check",
			customers: "customers",
			customer: "customers",
			late: "alert",
			active: "check",
			recent: "clock",
			unlinked: "trade",
			warranty: "shield",
			low: "alert",
			stale: "clock",
			retail: "stock",
			entries: "download",
			whatsapp: "whatsapp",
			sales: "stock",
			revenue: "finance",
			ticket: "finance",
			completed: "check",
		};
		return icon(map[metric.key] || metric.key || "overview");
	}

	function metricCards(metrics = []) {
		return `
			<div class="tp-op-metrics">
				${metrics
					.map(
						(metric) => {
							const value =
								["revenue", "ticket"].includes(metric.key) &&
								typeof metric.value === "number"
									? formatCurrency(metric.value)
									: metric.value;
							return `
							<article class="tp-op-metric tp-op-tone-${esc(metric.tone)}">
								<span class="tp-op-metric__icon">${metricIcon(metric)}</span>
								<div>
									<strong>${esc(metric.label)}</strong>
									<b>${esc(value)}</b>
									<small>${esc(metric.description)}</small>
								</div>
							</article>
						`;
						}
					)
					.join("")}
			</div>
		`;
	}

	function optionTags(options = [], selected, allLabel = "Todos") {
		const normalized = options.map((option) =>
			typeof option === "string" ? { value: option, label: displayState(option) } : option
		);
		return `
			<option value="">${esc(allLabel)}</option>
			${normalized
				.map(
					(option) =>
						`<option value="${esc(option.value)}"${String(selected || "") === String(option.value) ? " selected" : ""}>${esc(option.label)}</option>`
				)
				.join("")}
		`;
	}

	function selectFilter(name, label, options, selected, allLabel) {
		return `
			<label class="tp-op-filter">
				<span>${esc(label)}</span>
				<select data-op-filter="${esc(name)}">
					${optionTags(options, selected, allLabel)}
				</select>
			</label>
		`;
	}

	function searchFilter(value, placeholder) {
		return `
			<label class="tp-op-search">
				<span>${icon("search")}</span>
				<input type="search" value="${esc(value || "")}" data-op-search placeholder="${esc(placeholder)}">
			</label>
		`;
	}

	function tableShell(headers, rows, emptyMessage, total, state) {
		const hasPrevious = state.start > 0;
		const hasNext = state.start + state.pageLength < total;
		const colClass = (header) => {
			const h = String(header || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
			if (h.includes("codigo") || h.includes("os") || h === "id" || h.includes("sku") || h.includes("ref")) return "col-id";
			if (h.includes("cliente") || h.includes("nome") || h.includes("fornecedor")) return "col-client";
			if (h.includes("aparelho") || h.includes("dispositivo") || h.includes("celular")) return "col-device";
			if (h.includes("descricao") || h.includes("modelo") || h.includes("item") || h.includes("detalhe")) return "col-description";
			if (h.includes("situacao") || h.includes("status") || h.includes("etapa") || h.includes("garantia") || h.includes("urgencia")) return "col-status";
			if (h.includes("data") || h.includes("prazo") || h.includes("atualizacao") || h.includes("periodo")) return "col-date";
			if (h.includes("acoes") || h.includes("opcoes")) return "col-actions";
			return "";
		};
		return `
			<section class="tp-op-table-card">
				<div class="tp-op-table-scroll">
					<table class="tp-op-table">
						<thead><tr>${headers.map((header) => `<th class="${colClass(header)}">${esc(header)}</th>`).join("")}</tr></thead>
						<tbody>
							${rows || `<tr><td colspan="${headers.length}"><div class="tp-op-empty">${icon("search")}<strong>${esc(emptyMessage)}</strong><small>Revise os filtros ou cadastre um novo registro.</small></div></td></tr>`}
						</tbody>
					</table>
				</div>
				<footer class="tp-op-pagination">
					<span>Mostrando ${total ? state.start + 1 : 0}–${Math.min(state.start + state.pageLength, total)} de ${total}</span>
					<div>
						<button type="button" data-op-page="previous"${hasPrevious ? "" : " disabled"}>${icon("arrow")}</button>
						<strong>${Math.floor(state.start / state.pageLength) + 1}</strong>
						<button type="button" data-op-page="next"${hasNext ? "" : " disabled"}>${icon("arrow")}</button>
					</div>
				</footer>
			</section>
		`;
	}

	function applyResponsiveTableLabels(root) {
		root.querySelectorAll(".tp-op-table").forEach((table) => {
			const labels = [...table.querySelectorAll("thead th")].map((header) =>
				header.textContent.trim()
			);
			table.querySelectorAll("tbody tr").forEach((row) => {
				row.querySelectorAll("td").forEach((cell, index) => {
					if (labels[index]) cell.dataset.label = labels[index];
				});
			});
		});
	}

	function deviceCell(row) {
		return `
			<div class="tp-op-device">
				<span class="tp-op-device__photo">
					${row.device_photo || row.photo ? `<img src="${esc(row.device_photo || row.photo)}" alt="">` : icon("phone")}
				</span>
				<span><strong>${esc(row.device_label || row.model || row.device)}</strong><small>${esc(row.device_meta || row.imei_serial || "")}</small></span>
			</div>
		`;
	}

	function actionButtons(actions) {
		return `
			<div class="tp-op-actions">
				${actions
					.filter(Boolean)
					.map(
						(action) => `
							<${action.href ? "a" : "button"}
								${action.href ? `href="${esc(action.href)}"` : 'type="button"'}
								class="tp-op-action${action.tone ? ` tp-op-action--${action.tone}` : ""}"
								title="${esc(action.label)}"
								${action.action ? `data-op-action="${esc(action.action)}"` : ""}
								${Object.entries(action.data || {})
									.map(([key, value]) => `data-${esc(key)}="${esc(value || "")}"`)
									.join(" ")}
							>${action.icon || icon("arrow")}<span>${esc(action.compact ? "" : action.label)}</span></${action.href ? "a" : "button"}>
						`
					)
					.join("")}
			</div>
		`;
	}

	function renderRepairRows(data) {
		return (data.rows || [])
			.map(
				(row) => `
					<tr class="${row.is_late ? "is-critical" : ""}">
						<td>${priorityBadge(row.priority, row.is_late)}<small class="tp-op-cell-detail">${esc(row.name)}</small></td>
						<td><strong>${esc(row.customer_name)}</strong><small class="tp-op-cell-detail">${esc(row.whatsapp || "Contato protegido")}</small></td>
						<td>${deviceCell(row)}</td>
						<td>${statusBadge(row.workflow_label, row.is_late ? "danger" : row.customer_status_tone, row.reported_issue)}</td>
						<td><span class="tp-op-avatar">${esc(initials(row.technician_label))}</span><strong>${esc(row.technician_label)}</strong></td>
						<td><strong>${esc(row.deadline_label)}</strong><small class="tp-op-cell-detail">${formatDate(row.promised_at, true)}</small></td>
						<td>${statusBadge(row.customer_status, row.customer_status_tone)}</td>
						<td><span>${esc(row.updated_label)}</span><small class="tp-op-cell-detail">${formatDate(row.modified, true)}</small></td>
						<td>${actionButtons([
							{ href: `/desk/repair-order/${encodeURIComponent(row.name)}`, label: "Abrir OS", icon: icon("eye"), compact: true },
							row.whatsapp && { action: "whatsapp", label: "Enviar WhatsApp", icon: icon("whatsapp"), tone: "whatsapp", compact: true, data: { phone: row.whatsapp, name: row.customer_name, os: row.name } },
							!row.customer_signature_hash && { action: "signature", label: "Enviar assinatura", icon: icon("automation"), compact: true, data: { phone: row.whatsapp, name: row.customer_name, os: row.name } },
						])}</td>
					</tr>
				`
			)
			.join("");
	}

	function renderRepairKanban(data) {
		const groups = [
			["Recebido", "Entrada"],
			["Em diagnostico", "Diagnóstico"],
			["Aguardando aprovacao", "Aprovação"],
			["Aguardando peca", "Peça"],
			["Em reparo", "Reparo"],
			["Pronto para retirada", "Prontas"],
		];
		return `
			<div class="tp-op-kanban">
				${groups
					.map(([state, label]) => {
						const cards = (data.rows || []).filter((row) => row.workflow_state === state);
						return `
							<section class="tp-op-kanban__column">
								<header><strong>${esc(label)}</strong><b>${cards.length}</b></header>
								<div>
									${cards.length
										? cards
												.map(
													(row) => `
														<a class="tp-op-kanban__card${row.is_late ? " is-late" : ""}" href="/desk/repair-order/${encodeURIComponent(row.name)}">
															<span>${esc(row.name)}</span>
															<strong>${esc(row.device_label)}</strong>
															<small>${esc(row.customer_name)}</small>
															<footer><span>${esc(row.technician_label)}</span><b>${esc(row.deadline_label)}</b></footer>
														</a>
													`
												)
												.join("")
										: '<div class="tp-op-kanban__empty">Nenhuma OS</div>'}
								</div>
							</section>
						`;
					})
					.join("")}
			</div>
		`;
	}

	function repairPage(data, state) {
		const filters = state.filters;
		const filtersMarkup = `
			<div class="tp-op-filterbar">
				${searchFilter(filters.search, "Buscar por OS, cliente ou aparelho...")}
				${selectFilter("status", "Etapa", data.options.statuses, filters.status, "Todas")}
				${selectFilter("technician", "Técnico", data.options.technicians, filters.technician, "Todos")}
				${selectFilter("priority", "Prioridade", data.options.priorities, filters.priority, "Todas")}
				${selectFilter("channel", "Canal", data.options.channels, filters.channel, "Todos")}
				${selectFilter("period", "Período", data.options.periods, filters.period, "Todo período")}
				<label class="tp-op-toggle"><input type="checkbox" data-op-filter="late"${filters.late ? " checked" : ""}><span></span>Atrasadas</label>
				<button type="button" class="tp-op-clear" data-op-action="clear">${icon("refresh")} Limpar</button>
			</div>
		`;
		const content =
			state.view === "kanban"
				? renderRepairKanban(data)
				: tableShell(
						["Prioridade / OS", "Cliente", "Aparelho", "Etapa", "Técnico", "Prazo", "Status do cliente", "Atualização", "Ações"],
						renderRepairRows(data),
						"Nenhuma ordem encontrada",
						data.total,
						state
					);
		return `
			${pageHeader(data, "service", "Nova OS", "new-repair", `
				<div class="tp-op-view-toggle">
					<button type="button" data-op-view="list" class="${state.view === "list" ? "is-active" : ""}">${icon("list")} Lista</button>
					<button type="button" data-op-view="kanban" class="${state.view === "kanban" ? "is-active" : ""}">${icon("kanban")} Kanban</button>
				</div>
			`)}
			${metricCards(data.metrics)}
			<div class="tp-op-banner">${icon("alert")}<div><strong>Dica TecPonto</strong><span>Priorize atrasos e pendências de aprovação para manter o cliente informado.</span></div></div>
			${filtersMarkup}
			${content}
		`;
	}

	function renderCustomerRows(data) {
		return (data.rows || [])
			.map(
				(row) => `
					<tr>
						<td><span class="tp-op-avatar">${esc(initials(row.customer_name))}</span><strong>${esc(row.customer_name)}</strong></td>
						<td><strong>${esc(row.whatsapp || "Não cadastrado")}</strong></td>
						<td>${row.last_order ? `<a href="/desk/repair-order/${encodeURIComponent(row.last_order)}"><strong>${esc(row.last_order)}</strong></a><small class="tp-op-cell-detail">${formatDate(row.last_order_at, true)}</small>` : "—"}</td>
						<td>${row.last_sale ? `<a href="/desk/Sales%20Invoice/${encodeURIComponent(row.last_sale)}"><strong>${esc(row.last_sale)}</strong></a><small class="tp-op-cell-detail">${formatDate(row.last_sale_at, true)}</small>` : "—"}</td>
						<td><strong>${esc(row.devices_count)}</strong><small class="tp-op-cell-detail">aparelho(s)</small></td>
						<td>${statusBadge(row.status, row.status_tone)}</td>
						<td>${actionButtons([
							{ href: `/desk/customer/${encodeURIComponent(row.name)}`, label: "Abrir cliente", icon: icon("eye"), compact: true },
							{ action: "new-repair-customer", label: "Nova OS", icon: icon("plus"), compact: true, data: { customer: row.name } },
							{ href: `/desk/tecponto-sales?customer=${encodeURIComponent(row.name)}`, label: "Nova venda", icon: icon("finance"), compact: true },
							row.whatsapp && { action: "whatsapp-customer", label: "WhatsApp", icon: icon("whatsapp"), tone: "whatsapp", compact: true, data: { phone: row.whatsapp, name: row.customer_name } },
						])}</td>
					</tr>
				`
			)
			.join("");
	}

	function customerPage(data, state) {
		const filters = state.filters;
		return `
			${pageHeader(data, "customers", "Cadastrar cliente", "new-customer")}
			${metricCards(data.metrics)}
			<div class="tp-op-banner">${icon("search")}<div><strong>Pesquisa antes do cadastro</strong><span>Procure por nome ou WhatsApp para evitar duplicidade e manter o histórico do cliente inteiro.</span></div></div>
			<div class="tp-op-filterbar">
				${searchFilter(filters.search, "Buscar por nome, WhatsApp, e-mail ou código...")}
				${selectFilter("group", "Grupo", data.options.groups, filters.group, "Todos")}
				${selectFilter("territory", "Território", data.options.territories, filters.territory, "Todos")}
				${selectFilter("type", "Tipo", data.options.types, filters.type, "Todos")}
				${selectFilter("active", "Status", [{ value: "1", label: "Ativos" }, { value: "0", label: "Inativos" }], filters.active, "Todos")}
				${selectFilter("period", "Período", data.options.periods, filters.period, "Todo período")}
				<button type="button" class="tp-op-clear" data-op-action="clear">${icon("refresh")} Limpar</button>
			</div>
			${tableShell(
				["Cliente", "Telefone", "Última OS", "Últimas Vendas", "Aparelhos", "Status", "Ações"],
				renderCustomerRows(data),
				"Nenhum cliente encontrado",
				data.total,
				state
			)}
		`;
	}

	function renderDeviceRows(data) {
		return (data.rows || [])
			.map(
				(row) => `
					<tr>
						<td>${deviceCell(row)}</td>
						<td><strong>${esc(row.customer_name)}</strong><small class="tp-op-cell-detail">${esc(row.whatsapp || "Contato protegido")}</small></td>
						<td><strong>${esc(row.imei_serial || "Sem IMEI")}</strong><small class="tp-op-cell-detail">${esc(row.name)}</small></td>
						<td>${statusBadge(row.status, row.status_tone)}</td>
						<td>${row.last_order ? `<a href="/desk/repair-order/${encodeURIComponent(row.last_order)}"><strong>${esc(row.last_order)}</strong></a><small class="tp-op-cell-detail">${formatDate(row.last_order_at)}</small>` : "—"}</td>
						<td>${row.warranty_active ? statusBadge(`Válida até ${formatDate(row.warranty_until)}`, "success") : row.warranty_until ? statusBadge("Expirada", "danger", formatDate(row.warranty_until)) : "—"}</td>
						<td><strong>${esc(row.history_count)} atendimento(s)</strong><small class="tp-op-cell-detail">${row.last_order_at ? `Último em ${formatDate(row.last_order_at)}` : "Sem histórico"}</small></td>
						<td>${actionButtons([
							{ href: `/desk/service-device/${encodeURIComponent(row.name)}`, label: "Abrir aparelho", icon: icon("eye"), compact: true },
							{ action: "new-repair-device", label: "Nova OS", icon: icon("plus"), compact: true, data: { device: row.name, customer: row.customer } },
							row.whatsapp && { action: "whatsapp", label: "WhatsApp", icon: icon("whatsapp"), tone: "whatsapp", compact: true, data: { phone: row.whatsapp, name: row.customer_name } },
						])}</td>
					</tr>
				`
			)
			.join("");
	}

	function devicePage(data, state) {
		const filters = state.filters;
		return `
			${pageHeader(data, "phone", "Cadastrar aparelho", "new-device")}
			<div class="tp-op-split">
				<div>
					${metricCards(data.metrics)}
					<div class="tp-op-search-panel">
						${searchFilter(filters.search, "Buscar por IMEI, modelo, cliente ou número interno...")}
						<small>Pesquise primeiro pelo IMEI para evitar cadastros duplicados.</small>
					</div>
					<div class="tp-op-filterbar tp-op-filterbar--compact">
						${selectFilter("customer", "Cliente", data.options.customers, filters.customer, "Todos")}
						${selectFilter("brand", "Marca", data.options.brands, filters.brand, "Todas")}
						${selectFilter("model", "Modelo", data.options.models, filters.model, "Todos")}
						${selectFilter("device_type", "Tipo", data.options.types, filters.device_type, "Todos")}
						${selectFilter("active", "Status", [{ value: "1", label: "Ativos" }, { value: "0", label: "Inativos" }], filters.active, "Todos")}
						<button type="button" class="tp-op-clear" data-op-action="clear">${icon("refresh")} Limpar</button>
					</div>
					${tableShell(
						["Aparelho", "Cliente", "Identificação", "Status", "Última OS", "Garantia", "Histórico", "Ações"],
						renderDeviceRows(data),
						"Nenhum aparelho encontrado",
						data.total,
						state
					)}
				</div>
				<aside class="tp-op-guidance">
					<section><header>${icon("alert")}<strong>Fluxo sugerido</strong></header>
						<ol><li><b>1</b><span><strong>Localizar aparelho</strong><small>Pesquise por IMEI, modelo ou cliente.</small></span></li><li><b>2</b><span><strong>Revisar histórico</strong><small>Consulte atendimentos e garantia.</small></span></li><li><b>3</b><span><strong>Abrir nova OS</strong><small>Continue sem duplicar o aparelho.</small></span></li></ol>
					</section>
					<section class="tp-op-guidance__info"><header>${icon("search")}<strong>Evite cadastros duplicados</strong></header><p>Sempre pesquise antes de cadastrar. O histórico completo reduz retrabalho e erros de garantia.</p></section>
					<section class="tp-op-guidance__whatsapp"><header>${icon("whatsapp")}<strong>WhatsApp integrado</strong></header><p>Fale com o cliente a partir do aparelho ou da OS, mantendo o evento registrado.</p></section>
				</aside>
			</div>
		`;
	}

	function renderTradeRows(data) {
		return (data.rows || [])
			.map(
				(row) => `
					<tr>
						<td><a href="/desk/trade-in-evaluation/${encodeURIComponent(row.name)}"><strong>${esc(row.name)}</strong></a><small class="tp-op-cell-detail">${formatDate(row.intake_at, true)}</small></td>
						<td><strong>${esc(row.customer_name)}</strong><small class="tp-op-cell-detail">${esc(row.whatsapp || "Contato protegido")}</small></td>
						<td>${deviceCell(row)}</td>
						<td>${statusBadge(row.workflow_label, row.workflow_state === "Pronto para venda" ? "success" : row.workflow_state === "Avaliacao" ? "blue" : "warning")}</td>
						<td><strong>${row.offered_value ? formatCurrency(row.offered_value) : "A definir"}</strong><small class="tp-op-cell-detail">${esc(row.offer_status || "Sem oferta")}</small></td>
						<td>${statusBadge(row.customer_status, row.offer_status === "Aceita" ? "success" : row.offer_status === "Recusada" ? "danger" : "warning")}</td>
						<td><span class="tp-op-avatar">${esc(initials(row.technician_label))}</span><strong>${esc(row.technician_label)}</strong></td>
						<td><strong>${esc(row.updated_label)}</strong><small class="tp-op-cell-detail">${formatDate(row.modified, true)}</small></td>
						<td>${actionButtons([
							{ href: `/desk/trade-in-evaluation/${encodeURIComponent(row.name)}`, label: "Abrir avaliação", icon: icon("eye"), compact: true },
							row.whatsapp && { action: "whatsapp-trade", label: "Enviar oferta", icon: icon("whatsapp"), tone: "whatsapp", compact: true, data: { phone: row.whatsapp, name: row.customer_name, trade: row.name, value: row.offered_value } },
							{ href: `/desk/trade-in-evaluation/${encodeURIComponent(row.name)}`, label: "Atualizar etapa", icon: icon("trade"), compact: true },
						])}</td>
					</tr>
				`
			)
			.join("");
	}

	function tradePipeline(data, state) {
		return `
			<div class="tp-op-pipeline">
				${(data.pipeline || [])
					.map(
						(step, index) => `
							<button type="button" data-op-pipeline="${esc(step.states.join("|"))}" class="${state.filters.status === step.states.join("|") ? "is-active" : ""}">
								<span>${icon(index === 0 ? "trade" : index === 5 ? "check" : "overview")}</span>
								<div><strong>${esc(step.label)}</strong><small>${esc(step.description)}</small></div>
								<b>${esc(step.count)}</b>
							</button>
						`
					)
					.join("")}
			</div>
		`;
	}

	function tradePage(data, state) {
		const filters = state.filters;
		return `
			${pageHeader(data, "trade", "Nova avaliação de troca", "new-trade")}
			${tradePipeline(data, state)}
			<div class="tp-op-banner">${icon("alert")}<div><strong>Fluxo: cadastrar aparelho → avaliar estado → registrar oferta → acompanhar aceite</strong><span>Mantenha as informações atualizadas para ofertas rápidas e precisas.</span></div></div>
			<div class="tp-op-filterbar">
				${searchFilter(filters.search, "Buscar avaliação, cliente ou aparelho...")}
				${selectFilter("customer", "Cliente", data.options.customers, filters.customer, "Todos")}
				${selectFilter("device", "Aparelho", data.options.devices, filters.device, "Todos")}
				${selectFilter("status", "Etapa", (data.pipeline || []).map((step) => ({ value: step.states.join("|"), label: step.label })), filters.status, "Todas")}
				${selectFilter("technician", "Técnico", data.options.technicians, filters.technician, "Todos")}
				${selectFilter("offer_status", "Situação da oferta", data.options.offer_statuses, filters.offer_status, "Todas")}
				${selectFilter("period", "Período", data.options.periods, filters.period, "Todo período")}
				<button type="button" class="tp-op-clear" data-op-action="clear">${icon("refresh")} Limpar</button>
			</div>
			${tableShell(
				["Avaliação", "Cliente", "Aparelho", "Etapa atual", "Oferta", "Status do cliente", "Técnico", "Atualização", "Ações"],
				renderTradeRows(data),
				"Nenhuma avaliação encontrada",
				data.total,
				state
			)}
		`;
	}

	function renderStockRows(data) {
		return (data.rows || [])
			.map((row) => {
				const movement = row.last_movement || {};
				return `
					<tr>
						<td><div class="tp-op-device"><span class="tp-op-device__photo">${row.image ? `<img src="${esc(row.image)}" alt="">` : icon(row.operational_type === "Serviço" ? "service" : "stock")}</span><span><strong>${esc(row.item_name)}</strong><small>SKU: ${esc(row.item_code)}</small></span></div></td>
						<td>${esc(row.item_group || "—")}</td>
						<td>${statusBadge(row.operational_type, row.operational_type === "Serviço" ? "purple" : row.operational_type === "Peça" ? "blue" : "active")}</td>
						<td><strong class="${row.situation_tone === "danger" || row.situation_tone === "warning" ? "tp-op-stock-critical" : ""}">${row.actual_qty === null ? "—" : `${esc(row.actual_qty)} ${esc(row.stock_uom || "un")}`}</strong></td>
						<td>${row.minimum_stock === null ? "—" : `${esc(row.minimum_stock)} ${esc(row.stock_uom || "un")}`}</td>
						<td>${statusBadge(row.situation, row.situation_tone)}</td>
						<td><strong>${movement.posting_date ? formatDate(movement.posting_date, true) : "Sem movimentação"}</strong><small class="tp-op-cell-detail">${movement.voucher_no ? `${esc(movement.voucher_type)} ${esc(movement.voucher_no)}` : "—"}</small></td>
						<td><strong>${esc(row.destination || "Sem destino padrão")}</strong><small class="tp-op-cell-detail">${esc(row.supplier || "")}</small></td>
						<td>${actionButtons([
							{ href: `/desk/item/${encodeURIComponent(row.item_code)}`, label: "Abrir item", icon: icon("eye"), compact: true },
							row.actual_qty !== null && { action: "stock-entry", label: "Registrar entrada", icon: icon("plus"), compact: true, data: { item: row.item_code } },
							row.actual_qty !== null && { action: "stock-exit", label: "Registrar saída", icon: icon("download"), compact: true, data: { item: row.item_code } },
						])}</td>
					</tr>
				`;
			})
			.join("");
	}

	function stockPage(data, state) {
		const filters = state.filters;
		return `
			${pageHeader(data, "stock", "Cadastrar item", "new-item")}
			${metricCards(data.metrics)}
			<div class="tp-op-tabs">
				${[
					["", "Todos"],
					["Peça", "Peças"],
					["Acessório", "Acessórios"],
					["Serviço", "Serviços"],
					["__low__", "Estoque baixo"],
				]
					.map(
						([value, label]) => `<button type="button" data-op-stock-tab="${esc(value)}" class="${(value === "__low__" ? filters.status === "Estoque baixo" : filters.type === value && !filters.status) ? "is-active" : ""}">${esc(label)}</button>`
					)
					.join("")}
			</div>
			<div class="tp-op-banner">${icon("alert")}<div><strong>Baixa automática ao usar em OS</strong><span>Ao vincular uma peça e concluir o serviço, a movimentação fica registrada na ordem.</span></div></div>
			<div class="tp-op-filterbar">
				${searchFilter(filters.search, "Buscar por nome, código ou referência...")}
				${selectFilter("group", "Grupo", data.options.groups, filters.group, "Todos")}
				${selectFilter("type", "Tipo", data.options.types, filters.type, "Todos")}
				${selectFilter("status", "Situação", data.options.statuses, filters.status, "Todas")}
				${selectFilter("supplier", "Fornecedor", data.options.suppliers, filters.supplier, "Todos")}
				<button type="button" class="tp-op-clear" data-op-action="clear">${icon("refresh")} Limpar</button>
			</div>
			${tableShell(
				["Item", "Categoria", "Tipo", "Estoque atual", "Mínimo", "Situação", "Última movimentação", "Destino / uso", "Ações"],
				renderStockRows(data),
				"Nenhum item encontrado",
				data.total,
				state
			)}
		`;
	}

	function renderSalesRows(data) {
		return (data.rows || [])
			.map(
				(row) => `
					<tr>
						<td><div class="tp-op-device"><span class="tp-op-device__photo">${row.image ? `<img src="${esc(row.image)}" alt="">` : icon("stock")}</span><span><strong>${esc(row.item_name)}</strong><small>SKU: ${esc(row.item_code)}</small></span></div></td>
						<td>${statusBadge(row.operational_type, row.operational_type === "Acessório" ? "blue" : "purple", row.quality_level || "")}</td>
						<td><strong>${esc([row.brand_name, row.model_name].filter(Boolean).join(" ") || "Linha TecPonto")}</strong><small class="tp-op-cell-detail">${esc(row.item_group || "")}</small></td>
						<td><strong class="${row.situation_tone === "danger" || row.situation_tone === "warning" ? "tp-op-stock-critical" : ""}">${row.actual_qty === null ? "Sob consulta" : `${esc(row.actual_qty)} ${esc(row.stock_uom || "un")}`}</strong><small class="tp-op-cell-detail">Mínimo: ${esc(row.minimum_stock || 0)}</small></td>
						<td><strong>${row.price ? formatCurrency(row.price) : "Preço não definido"}</strong><small class="tp-op-cell-detail">${esc(row.currency || "BRL")}</small></td>
						<td>${statusBadge(row.situation, row.situation_tone)}</td>
						<td><strong>${esc(row.updated_label)}</strong><small class="tp-op-cell-detail">${formatDate(row.modified, true)}</small></td>
						<td>${actionButtons([
							{ href: `/desk/item/${encodeURIComponent(row.item_code)}`, label: "Abrir item", icon: icon("eye"), compact: true },
							data.capabilities?.can_create_invoice && row.situation !== "Sem estoque" && { action: "new-sale-item", label: "Vender item", icon: icon("plus"), compact: true, data: { item: row.item_code } },
						])}</td>
					</tr>
				`
			)
			.join("");
	}

	function salesPage(data, state) {
		const currentView = state.view || "catalog";
		const directionNote = data.capabilities?.can_view_finance
			? "A Direção pode registrar, revisar e concluir a venda com os totais financeiros."
			: "A equipe inicia a venda por um fluxo guiado; revisão, fechamento e financeiro permanecem com a Direção.";
		
		let tabbedContent = "";
		if (currentView === "catalog") {
			const filters = state.filters;
			tabbedContent = `
				<div class="tp-op-banner">${icon("shield")}<div><strong>Venda simples, controle protegido</strong><span>${esc(directionNote)}</span></div></div>
				<div class="tp-op-filterbar">
					${searchFilter(filters.search, "Buscar aparelho, acessório, marca ou SKU...")}
					${selectFilter("type", "Tipo", data.options.types, filters.type, "Todos")}
					${selectFilter("status", "Disponibilidade", data.options.statuses, filters.status, "Todas")}
					<button type="button" class="tp-op-clear" data-op-action="clear">${icon("refresh")} Limpar</button>
				</div>
				${tableShell(
					["Produto", "Tipo", "Linha", "Estoque", "Preço", "Situação", "Atualização", "Ações"],
					renderSalesRows(data),
					"Nenhum produto de venda encontrado",
					data.total,
					state
				)}
			`;
		} else {
			tabbedContent = `
				<div class="tp-metric-grid" style="margin-bottom: 24px;">
					<div class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(130, 134, 255, 0.1); color: var(--tp-purple); align-items: center; justify-content: center;">${icon("finance")}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${data.sales_overview?.vendas_hoje || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">Vendas hoje</div>
					</div>
					<div class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 159, 67, 0.1); color: var(--tp-yellow); align-items: center; justify-content: center;">${icon("clock")}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${data.sales_overview?.vendas_pendentes || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">Vendas pendentes</div>
					</div>
					<div class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); color: var(--tp-red); align-items: center; justify-content: center;">${icon("alert")}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${data.sales_overview?.pagamentos_pendentes || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">Pagamentos pendentes</div>
					</div>
					<div class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(40, 199, 111, 0.1); color: var(--tp-green); align-items: center; justify-content: center;">${icon("check")}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${data.sales_overview?.retiradas_pendentes || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">Retiradas pendentes</div>
					</div>
				</div>

				<div class="tp-bottom-layout-columns">
					<div class="tp-bottom-layout-main">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
							<div>
								<h2 style="font-size: 14px; font-weight: 700; margin: 0; color: var(--tp-text);">Tabela de vendas e faturamento</h2>
								<div style="font-size: 11px; color: var(--tp-text-muted);">Acompanhe o status e faça baixa automática no estoque.</div>
							</div>
						</div>
						<div class="tp-op-table-card">
							<div class="tp-op-table-scroll">
								<table class="tp-op-table">
									<thead>
										<tr>
											<th class="col-id">Venda</th>
											<th class="col-client">Cliente</th>
											<th class="col-description">Produtos</th>
											<th class="col-status">Total</th>
											<th class="col-status">Situação</th>
											<th class="col-date">Data/Hora</th>
											<th class="col-actions">Ações</th>
										</tr>
									</thead>
									<tbody>
										${data.sales_invoices && data.sales_invoices.length ? data.sales_invoices.map(inv => {
											let statusBadge = "tp-badge-sem--muted";
											if (inv.status === "Paid") statusBadge = "tp-badge-sem--success";
											else if (inv.status === "Draft") statusBadge = "tp-badge-sem--warning";
											else if (inv.status === "Unpaid") statusBadge = "tp-badge-sem--danger";
											
											return `
												<tr style="border-bottom: 1px solid var(--tp-border);">
													<td style="padding: 10px 8px; font-weight: 700; color: var(--tp-text);">${inv.name}</td>
													<td style="padding: 10px 8px;">
														<div style="font-weight: 600; color: var(--tp-text);">${esc(inv.customer_name)}</div>
													</td>
													<td style="padding: 10px 8px; font-weight: 500; color: var(--tp-text);">${esc((inv.items || []).join(", "))}</td>
													<td style="padding: 10px 8px; font-weight: 600; color: var(--tp-text);">${formatCurrency(inv.grand_total)}</td>
													<td style="padding: 10px 8px;">
														<span class="tp-badge-sem ${statusBadge}">
															${esc(inv.status)}
														</span>
													</td>
													<td style="padding: 10px 8px; color: var(--tp-text-muted); font-size: 11px;">
														<div>${inv.date}</div>
														<div style="font-size: 10px;">${inv.time}</div>
													</td>
													<td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
														<a href="/desk/Sales%20Invoice/${inv.name}" class="btn btn-default btn-xs" style="padding: 2px 4px; color: var(--tp-orange); border: none; background: transparent; font-size: 14px;" title="Abrir venda">${icon("arrow")}</a>
													</td>
												</tr>
											`;
										}).join("") : `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--tp-text-muted);">Nenhuma venda registrada hoje.</td></tr>`}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<aside class="tp-bottom-layout-sidebar">
						<div class="tp-sidebar-widget">
							<h2 style="font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--tp-text);">Acessórios mais vendidos</h2>
							<div class="tp-shortcut-list">
								${(data.sales_overview?.acessorios_mais_vendidos || []).map(item => `
									<div class="tp-shortcut-item" style="cursor: default; padding: 12px 14px;">
										<div style="display: flex; align-items: center; gap: 10px;">
											<span style="color: var(--tp-orange); display: flex;">${icon("finance")}</span>
											<div>
												<div style="font-weight: 700; font-size: 12px; color: var(--tp-text);">${esc(item.item_name)}</div>
												<div style="font-size: 10px; color: var(--tp-text-muted);">${item.sold_qty} unidades</div>
											</div>
										</div>
									</div>
								`).join("")}
							</div>
						</div>
						<div class="tp-sidebar-widget" style="background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
							<div style="display: flex; align-items: center; gap: 10px;">
								<span style="display: flex; width: 36px; height: 36px; border-radius: 50%; background: rgba(255, 75, 0, 0.1); color: var(--tp-orange); align-items: center; justify-content: center; font-size: 20px;">${icon("finance")}</span>
								<div>
									<div style="font-weight: 700; font-size: 13px; color: var(--tp-text);">Nova venda balcão</div>
									<div style="font-size: 11px; color: var(--tp-text-muted);">Lance acessórios com baixa automática.</div>
								</div>
							</div>
							<button class="btn btn-primary btn-block btn-sm" data-op-action="new-sale">Lançar venda</button>
						</div>
					</aside>
				</div>
			`;
		}

		return `
			${pageHeader(
				data,
				"stock",
				"Registrar venda",
				"new-sale"
			)}
			<div class="tp-op-view-tabs" style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--tp-border); padding-bottom: 8px;">
				<button class="btn ${currentView === "catalog" ? "btn-primary" : "btn-default"}" data-op-view="catalog">Catálogo de Produtos</button>
				<button class="btn ${currentView === "sales_panel" ? "btn-primary" : "btn-default"}" data-op-view="sales_panel">Painel de Vendas (Central)</button>
			</div>
			${tabbedContent}
		`;
	}

	function reportTrend(data) {
		const maximum = Math.max(
			1,
			...(data.trend || []).flatMap((item) => [Number(item.repairs || 0), Number(item.trades || 0)])
		);
		return `
			<section class="tp-op-report-chart">
				<header>
					<div><strong>Entradas na operação</strong><small>OS e avaliações abertas nos últimos dias</small></div>
					<div class="tp-op-report-legend"><span><i class="is-repair"></i> Reparos</span><span><i class="is-trade"></i> Trocas</span></div>
				</header>
				<div class="tp-op-report-bars">
					${(data.trend || [])
						.map(
							(item) => `
								<div class="tp-op-report-day" title="${esc(item.label)} — ${esc(item.repairs)} reparos, ${esc(item.trades)} trocas">
									<div class="tp-op-report-day__bars">
										<i class="is-repair" style="height:${Math.max(4, (Number(item.repairs || 0) / maximum) * 100)}%"></i>
										<i class="is-trade" style="height:${Math.max(4, (Number(item.trades || 0) / maximum) * 100)}%"></i>
									</div>
									<small>${esc(item.label)}</small>
								</div>
							`
						)
						.join("")}
				</div>
			</section>
		`;
	}

	function reportIndicators(data) {
		return `
			<section class="tp-op-report-indicators">
				<header><div><strong>Comparativo do período</strong><small>Período atual contra o período anterior equivalente</small></div></header>
				<div class="tp-op-report-indicator-grid">
					${(data.indicators || [])
						.map((item) => {
							const positive = Number(item.change || 0) >= 0;
							return `
								<article class="tp-op-report-indicator tp-op-tone-${esc(item.tone)}">
									<span>${positive ? "↗" : "↘"} ${Math.abs(Number(item.change || 0))}%</span>
									<strong>${esc(item.label)}</strong>
									<b>${esc(item.value)}</b>
									<small>Anterior: ${esc(item.previous)}</small>
								</article>
							`;
						})
						.join("")}
				</div>
			</section>
		`;
	}

	function reportsPage(data, state) {
		const filters = state.filters;
		return `
			${pageHeader(data, "finance", "", "")}
			<div class="tp-op-filterbar tp-op-filterbar--reports">
				${selectFilter("period", "Período analisado", data.options.periods, filters.period || data.period, "Últimos 30 dias")}
				<button type="button" class="tp-op-clear" data-op-action="clear">${icon("refresh")} Limpar</button>
			</div>
			${metricCards(data.metrics)}
			
			<h2 style="font-size: 14px; font-weight: 700; margin-top: 24px; margin-bottom: 16px; color: var(--tp-text);">Diretório de Relatórios</h2>
			<div class="tp-report-directory-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px;">
				<div class="tp-metric-card" style="min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-weight: 700; font-size: 14px; color: var(--tp-text); margin-bottom: 4px;">Relatório de Vendas</div>
						<div style="font-size: 11px; color: var(--tp-text-muted);">Acompanhe o faturamento, ticket médio e vendas de acessórios.</div>
					</div>
					<a href="/desk/query-report/Sales%20Register" class="btn btn-primary btn-xs" style="margin-top: 12px; align-self: flex-start; text-decoration: none;">Abrir relatório</a>
				</div>
				<div class="tp-metric-card" style="min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-weight: 700; font-size: 14px; color: var(--tp-text); margin-bottom: 4px;">Ordens de Serviço</div>
						<div style="font-size: 11px; color: var(--tp-text-muted);">Análise do ciclo de vida das OS, prazos e gargalos na oficina.</div>
					</div>
					<a href="/desk/repair-order" class="btn btn-primary btn-xs" style="margin-top: 12px; align-self: flex-start; text-decoration: none;">Abrir relatório</a>
				</div>
				<div class="tp-metric-card" style="min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-weight: 700; font-size: 14px; color: var(--tp-text); margin-bottom: 4px;">Estoque e Peças</div>
						<div style="font-size: 11px; color: var(--tp-text-muted);">Controle de saldos de peças, estoque mínimo e movimentações de entrada/saída.</div>
					</div>
					<a href="/desk/query-report/Stock%20Balance" class="btn btn-primary btn-xs" style="margin-top: 12px; align-self: flex-start; text-decoration: none;">Abrir relatório</a>
				</div>
				<div class="tp-metric-card" style="min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-weight: 700; font-size: 14px; color: var(--tp-text); margin-bottom: 4px;">Desempenho de Técnicos</div>
						<div style="font-size: 11px; color: var(--tp-text-muted);">Carga de trabalho por técnico, taxa de reparo e faturamento atribuído.</div>
					</div>
					<a href="/desk/repair-order?view=kanban" class="btn btn-primary btn-xs" style="margin-top: 12px; align-self: flex-start; text-decoration: none;">Abrir relatório</a>
				</div>
				<div class="tp-metric-card" style="min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-weight: 700; font-size: 14px; color: var(--tp-text); margin-bottom: 4px;">Desempenho de Atendentes</div>
						<div style="font-size: 11px; color: var(--tp-text-muted);">Conversão de orçamentos, velocidade de entrada e captação de clientes.</div>
					</div>
					<a href="/desk/tecponto" class="btn btn-primary btn-xs" style="margin-top: 12px; align-self: flex-start; text-decoration: none;">Abrir relatório</a>
				</div>
				<div class="tp-metric-card" style="min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-weight: 700; font-size: 14px; color: var(--tp-text); margin-bottom: 4px;">Financeiro</div>
						<div style="font-size: 11px; color: var(--tp-text-muted);">Fluxo de caixa, conciliação e margens operacionais da loja.</div>
					</div>
					<a href="/desk/query-report/General%20Ledger" class="btn btn-primary btn-xs" style="margin-top: 12px; align-self: flex-start; text-decoration: none;">Abrir relatório</a>
				</div>
				<div class="tp-metric-card" style="min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-weight: 700; font-size: 14px; color: var(--tp-text); margin-bottom: 4px;">Clientes e Histórico</div>
						<div style="font-size: 11px; color: var(--tp-text-muted);">Perfil dos clientes recorrentes, ordens vinculadas e canais de contato.</div>
					</div>
					<a href="/desk/customer" class="btn btn-primary btn-xs" style="margin-top: 12px; align-self: flex-start; text-decoration: none;">Abrir relatório</a>
				</div>
				<div class="tp-metric-card" style="min-height: 140px; display: flex; flex-direction: column; justify-content: space-between;">
					<div>
						<div style="font-weight: 700; font-size: 14px; color: var(--tp-text); margin-bottom: 4px;">Controle de Garantias</div>
						<div style="font-size: 11px; color: var(--tp-text-muted);">Status de aparelhos na garantia, reentradas e prazos vigentes.</div>
					</div>
					<a href="/desk/service-device" class="btn btn-primary btn-xs" style="margin-top: 12px; align-self: flex-start; text-decoration: none;">Abrir relatório</a>
				</div>
			</div>

			<div class="tp-op-report-grid">
				${reportTrend(data)}
				${reportIndicators(data)}
			</div>
			<div class="tp-op-banner">${icon("shield")}<div><strong>Informação por responsabilidade</strong><span>${data.capabilities?.can_view_finance ? "Indicadores financeiros liberados para a Direção." : "Este painel mostra operação e desempenho. Valores financeiros são exclusivos da Direção."}</span></div></div>
		`;
	}

	function pageHeader(data, iconName, actionLabel, action, extra = "") {
		return `
			<header class="tp-op-page-header">
				<div class="tp-op-page-header__copy">
					<span class="tp-op-page-header__icon">${icon(iconName)}</span>
					<div><h1>${esc(data.title)}</h1><p>${esc(data.description)}</p></div>
				</div>
				<div class="tp-op-page-header__actions">${extra}${action && actionLabel ? `<button type="button" class="tp-op-primary" data-op-action="${esc(action)}">${icon("plus")} ${esc(actionLabel)}</button>` : ""}</div>
			</header>
		`;
	}

	function formatCurrency(value) {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(Number(value || 0));
	}

	function pageMarkup(page, data, state) {
		if (page === "repairs") return repairPage(data, state);
		if (page === "customers") return customerPage(data, state);
		if (page === "devices") return devicePage(data, state);
		if (page === "trades") return tradePage(data, state);
		if (page === "sales") return salesPage(data, state);
		if (page === "reports") return reportsPage(data, state);
		return stockPage(data, state);
	}

	async function loadSurface(surface) {
		const state = surface._tpState;
		if (!state || state.loading) return;
		state.loading = true;
		surface.classList.add("is-loading");
		try {
			const response = await frappe.call({
				method: "tecponto.operations.get_operational_page",
				args: {
					page: state.page,
					filters: JSON.stringify(state.filters),
					start: state.start,
					page_length: state.pageLength,
				},
			});
			state.data = response.message || {};
			surface.innerHTML = pageMarkup(state.page, state.data, state);
			applyResponsiveTableLabels(surface);
			wireSurface(surface);
		} catch (error) {
			surface.innerHTML = `<div class="tp-op-error">${icon("alert")}<strong>Não foi possível carregar esta página operacional.</strong><button type="button" data-op-action="retry">Tentar novamente</button></div>`;
			wireSurface(surface);
			console.error(error);
		} finally {
			state.loading = false;
			surface.classList.remove("is-loading");
		}
	}

	function setFilter(surface, name, value) {
		const state = surface._tpState;
		if (value) state.filters[name] = value;
		else delete state.filters[name];
		state.start = 0;
		loadSurface(surface);
	}

	function openWhatsApp(phone, message) {
		const clean = String(phone || "").replace(/\D/g, "");
		if (!clean) {
			frappe.show_alert({ message: "WhatsApp do cliente não cadastrado.", indicator: "orange" });
			return;
		}
		window.open(`https://wa.me/${clean}?text=${encodeURIComponent(message)}`, "_blank");
	}

	function openSaleWizard(defaults = {}) {
		const steps = [
			{ title: "Cliente", description: "Localize quem está comprando." },
			{ title: "Produto", description: "Escolha o item, quantidade e forma prevista." },
			{ title: "Conferência", description: "Revise antes de enviar para o fechamento." },
		];
		let currentStep = 1;
		let quote = null;
		const dialog = new frappe.ui.Dialog({
			title: "Registrar venda",
			size: "large",
			fields: [
				{ fieldname: "step_header", fieldtype: "HTML" },
				{ fieldname: "customer", fieldtype: "Link", options: "Customer", label: "Cliente", reqd: 1, tp_step: 1 },
				{ fieldname: "item_code", fieldtype: "Link", options: "Item", label: "Produto", default: defaults.item_code, reqd: 1, tp_step: 2 },
				{ fieldname: "qty", fieldtype: "Float", label: "Quantidade", default: 1, reqd: 1, tp_step: 2 },
				{ fieldname: "quote", fieldtype: "HTML", tp_step: 2 },
				{ fieldname: "payment_method", fieldtype: "Select", label: "Forma prevista", options: "Pix\nDinheiro\nCartão de débito\nCartão de crédito\nA definir", default: "Pix", tp_step: 2 },
				{ fieldname: "notes", fieldtype: "Small Text", label: "Observação (opcional)", tp_step: 2 },
				{ fieldname: "review", fieldtype: "HTML", tp_step: 3 },
			],
		});
		dialog.fields_dict.item_code.get_query = () => ({
			filters: { disabled: 0, is_sales_item: 1 },
		});

		const values = () => ({
			customer: dialog.fields_dict.customer.get_value(),
			item_code: dialog.fields_dict.item_code.get_value(),
			qty: dialog.fields_dict.qty.get_value(),
			payment_method: dialog.fields_dict.payment_method.get_value(),
			notes: dialog.fields_dict.notes.get_value(),
		});
		const requireValue = (data, fieldname, message) => {
			if (String(data[fieldname] || "").trim()) return true;
			frappe.msgprint({ title: "Falta uma informação", message, indicator: "orange" });
			return false;
		};
		const loadQuote = async () => {
			const data = values();
			if (!data.item_code || Number(data.qty || 0) <= 0) {
				quote = null;
				dialog.fields_dict.quote.$wrapper.empty();
				return null;
			}
			dialog.fields_dict.quote.$wrapper.html('<div class="tp-sale-quote is-loading">Consultando estoque e preço...</div>');
			try {
				const response = await frappe.call({
					method: "tecponto.sales.get_sale_quote",
					args: { item_code: data.item_code, qty: data.qty },
				});
				quote = response.message;
				dialog.fields_dict.quote.$wrapper.html(`
					<div class="tp-sale-quote">
						<span>${icon("stock")}</span>
						<div><strong>${esc(quote.item_name)}</strong><small>${esc(quote.actual_qty)} ${esc(quote.stock_uom)} disponíveis</small></div>
						<b>${formatCurrency(quote.total)}</b>
					</div>
				`);
				return quote;
			} catch (error) {
				quote = null;
				dialog.fields_dict.quote.$wrapper.empty();
				throw error;
			}
		};
		const renderReview = () => {
			const data = values();
			dialog.fields_dict.review.$wrapper.html(`
				<div class="tp-intake-review">
					<div class="tp-intake-review__row"><div><span>Cliente</span><strong>${esc(data.customer)}</strong><small>Cadastro localizado</small></div><button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="1" type="button">Alterar</button></div>
					<div class="tp-intake-review__row"><div><span>Produto</span><strong>${esc(quote?.item_name || data.item_code)}</strong><small>${esc(data.qty)} unidade(s)</small></div><button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="2" type="button">Alterar</button></div>
					<div class="tp-intake-review__row"><div><span>Total previsto</span><strong>${quote ? formatCurrency(quote.total) : "A calcular"}</strong><small>${esc(data.payment_method)}</small></div><button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="2" type="button">Alterar</button></div>
					<div class="tp-photo-instruction">${icon("shield")}<div><strong>Fechamento protegido</strong><span>A venda ficará em rascunho para revisão e conclusão pela Direção.</span></div></div>
				</div>
			`);
			dialog.fields_dict.review.$wrapper.off("click", ".tp-btn-edit-step").on("click", ".tp-btn-edit-step", function () {
				showStep(Number($(this).data("tp-step-target")));
			});
		};
		const validateStep = async () => {
			const data = values();
			if (currentStep === 1) {
				return requireValue(data, "customer", "Selecione o cliente.");
			}
			if (currentStep === 2) {
				if (!requireValue(data, "item_code", "Selecione o produto.")) return false;
				if (Number(data.qty || 0) <= 0) {
					frappe.msgprint({ title: "Quantidade inválida", message: "Informe uma quantidade maior que zero.", indicator: "orange" });
					return false;
				}
				if (!quote) await loadQuote();
				return Boolean(quote);
			}
			return true;
		};
		const showStep = (step) => {
			currentStep = Math.max(1, Math.min(steps.length, step));
			const meta = steps[currentStep - 1];
			dialog.fields_dict.step_header.$wrapper.html(`
				<div class="tp-wizard-progress">
					<div class="tp-wizard-progress__copy"><span>Etapa ${currentStep} de ${steps.length}</span><strong>${esc(meta.title)}</strong><small>${esc(meta.description)}</small></div>
					<div class="tp-wizard-progress__bar"><i style="width:${(currentStep / steps.length) * 100}%"></i></div>
				</div>
			`);
			Object.values(dialog.fields_dict).forEach((field) => {
				if (field.df.tp_step) field.$wrapper.toggle(Number(field.df.tp_step) === currentStep);
			});
			if (currentStep === 2) loadQuote().catch(() => {});
			if (currentStep === 3) renderReview();
			dialog.set_primary_action(currentStep === 3 ? "Registrar rascunho" : "Continuar", async () => {
				if (!(await validateStep())) return;
				if (currentStep < 3) return showStep(currentStep + 1);
				frappe.call({
					method: "tecponto.sales.create_sale_draft",
					args: { payload: JSON.stringify(values()) },
					freeze: true,
					freeze_message: "Registrando venda...",
				}).then((response) => {
					dialog.hide();
					const sale = response.message;
					frappe.show_alert({ message: `Venda ${sale.name} registrada em rascunho.`, indicator: "green" });
					if (sale.can_open) frappe.set_route("Form", "Sales Invoice", sale.name);
					else {
						const surface = document.querySelector(".tp-operations-surface");
						if (surface) loadSurface(surface);
					}
				});
			});
			backButton.toggle(currentStep > 1);
		};

		dialog.show();
		dialog.$wrapper.addClass("tp-intake-dialog tp-sale-dialog");
		const backButton = $('<button type="button" class="btn btn-default tp-wizard-back">Voltar</button>');
		backButton.on("click", () => showStep(currentStep - 1));
		dialog.$wrapper.find(".modal-footer .standard-actions").prepend(backButton);
		dialog.fields_dict.item_code.$input.on("change", () => {
			quote = null;
			loadQuote().catch(() => {});
		});
		dialog.fields_dict.qty.$input.on("change", () => {
			quote = null;
			loadQuote().catch(() => {});
		});
		showStep(1);
	}

	function wireSurface(surface) {
		let searchTimer;
		surface.querySelector("[data-op-search]")?.addEventListener("input", (event) => {
			window.clearTimeout(searchTimer);
			searchTimer = window.setTimeout(() => setFilter(surface, "search", event.target.value.trim()), 350);
		});
		surface.querySelectorAll("[data-op-filter]").forEach((control) => {
			control.addEventListener("change", () => {
				const value = control.type === "checkbox" ? (control.checked ? "1" : "") : control.value;
				setFilter(surface, control.dataset.opFilter, value);
			});
		});
		surface.querySelectorAll("[data-op-view]").forEach((button) => {
			button.addEventListener("click", () => {
				surface._tpState.view = button.dataset.opView;
				surface.innerHTML = pageMarkup(surface._tpState.page, surface._tpState.data, surface._tpState);
				applyResponsiveTableLabels(surface);
				wireSurface(surface);
			});
		});
		surface.querySelectorAll("[data-op-page]").forEach((button) => {
			button.addEventListener("click", () => {
				const state = surface._tpState;
				state.start = Math.max(0, state.start + (button.dataset.opPage === "next" ? state.pageLength : -state.pageLength));
				loadSurface(surface);
			});
		});
		surface.querySelectorAll("[data-op-pipeline]").forEach((button) => {
			button.addEventListener("click", () => setFilter(surface, "status", button.dataset.opPipeline));
		});
		surface.querySelectorAll("[data-op-stock-tab]").forEach((button) => {
			button.addEventListener("click", () => {
				const state = surface._tpState;
				delete state.filters.type;
				delete state.filters.status;
				if (button.dataset.opStockTab === "__low__") state.filters.status = "Estoque baixo";
				else if (button.dataset.opStockTab) state.filters.type = button.dataset.opStockTab;
				state.start = 0;
				loadSurface(surface);
			});
		});
		surface.querySelectorAll("[data-op-action]").forEach((button) => {
			button.addEventListener("click", () => {
				const action = button.dataset.opAction;
				if (action === "clear") {
					surface._tpState.filters = {};
					surface._tpState.start = 0;
					loadSurface(surface);
				} else if (action === "retry") loadSurface(surface);
				else if (action === "new-repair") ui().openRepairIntakeWizard?.();
				else if (action === "new-customer") ui().openCustomerWizard?.();
				else if (action === "new-device") ui().openDeviceWizard?.();
				else if (action === "new-trade") ui().openTradeIntakeWizard?.();
				else if (action === "new-item") frappe.new_doc("Item");
				else if (action === "new-sale") openSaleWizard();
				else if (action === "new-sale-item") openSaleWizard({ item_code: button.dataset.item });
				else if (action === "new-repair-customer") {
					ui().openRepairIntakeWizard?.({
						customer: button.dataset.customer,
					});
				}
				else if (action === "new-repair-device") {
					ui().openRepairIntakeWizard?.({
						device: button.dataset.device,
						customer: button.dataset.customer,
					});
				} else if (action === "whatsapp") {
					openWhatsApp(
						button.dataset.phone,
						`Olá, ${button.dataset.name || ""}! A TecPonto está entrando em contato sobre a ordem ${button.dataset.os || ""}.`
					);
				} else if (action === "whatsapp-customer") {
					openWhatsApp(
						button.dataset.phone,
						`Olá, ${button.dataset.name || ""}! Aqui é da TecPonto. Como podemos ajudar no seu atendimento?`
					);
				} else if (action === "whatsapp-trade") {
					const offer = button.dataset.value
						? ` A oferta atual é ${formatCurrency(button.dataset.value)}.`
						: "";
					openWhatsApp(
						button.dataset.phone,
						`Olá, ${button.dataset.name || ""}! Temos uma atualização da avaliação ${button.dataset.trade || ""}.${offer}`
					);
				} else if (action === "signature") {
					frappe.call({
						method: "tecponto.www.os_aceite.generate_signature_link",
						args: { repair_order: button.dataset.os },
					}).then((response) => {
						const link = `${window.location.origin}${response.message.path}`;
						openWhatsApp(
							button.dataset.phone,
							`Olá, ${button.dataset.name || ""}! Para revisar e aceitar os termos da ordem ${button.dataset.os || ""}, acesse: ${link}`
						);
					});
				} else if (action === "stock-entry") {
					frappe.new_doc("Stock Entry", { stock_entry_type: "Material Receipt" });
				} else if (action === "stock-exit") {
					frappe.new_doc("Stock Entry", { stock_entry_type: "Material Issue" });
				}
			});
		});
	}

	function enhanceTopbar() {
		const navbar = document.querySelector(".navbar .container, .navbar .container-fluid");
		if (!navbar) return;
		
		// Add topbar classes
		const navEl = document.querySelector(".navbar");
		if (navEl && !navEl.classList.contains("tecponto-topbar")) {
			navEl.classList.add("tecponto-topbar");
		}
		
		const searchContainer = document.querySelector(".navbar .search-bar, .navbar .navbar-search");
		if (searchContainer && !searchContainer.classList.contains("tecponto-global-search")) {
			searchContainer.classList.add("tecponto-global-search");
		}

		const searchInput = document.querySelector(
			".navbar input[type='search'], .search-bar input, input[data-target='navbar-search']"
		);
		if (searchInput) {
			searchInput.placeholder = "Buscar atendimento, cliente, aparelho...";
		}

		// Add Store/Unit label if not present
		if (!navbar.querySelector(".tp-topbar-unit")) {
			const unit = document.createElement("span");
			unit.className = "tp-topbar-unit";
			unit.innerHTML = `<strong>TecPonto Matriz</strong>`;
			navbar.append(unit);
		}

		// Add Date/Time if not present
		if (!navbar.querySelector(".tp-topbar-date")) {
			const date = document.createElement("span");
			date.className = "tp-topbar-date";
			date.innerHTML = `<strong>${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())}</strong><small>${new Intl.DateTimeFormat("pt-BR", { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date())}</small>`;
			navbar.append(date);
		}

		// Add WhatsApp integrated button to navbar-right / navbar-nav if not present
		const rightMenu = navbar.querySelector(".navbar-nav, .navbar-right");
		if (rightMenu && !rightMenu.querySelector(".tp-topbar-whatsapp")) {
			const whatsappBtn = document.createElement("a");
			whatsappBtn.className = "tp-topbar-whatsapp btn btn-default";
			whatsappBtn.href = "https://web.whatsapp.com";
			whatsappBtn.target = "_blank";
			whatsappBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 16px; height: 16px;"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.799.002-2.592-1.01-5.029-2.852-6.874-1.841-1.843-4.288-2.857-6.877-2.858-5.393 0-9.786 4.398-9.788 9.802-.001 1.505.381 2.977 1.11 4.279l-.951 3.473 3.568-.936zm11.367-5.26c-.302-.151-1.787-.881-2.063-.982-.277-.1-.478-.151-.68.151-.202.302-.782.982-.958 1.183-.176.2-.353.226-.655.076-.3-.15-1.267-.467-2.413-1.489-.892-.796-1.493-1.778-1.669-2.079-.176-.301-.019-.464.132-.613.136-.134.302-.353.453-.529.151-.176.202-.302.302-.503.1-.2.05-.377-.025-.529-.076-.151-.68-1.637-.932-2.24-.246-.59-.496-.51-.68-.52-.176-.01-.377-.01-.579-.01-.201 0-.529.076-.805.378-.276.301-1.057 1.031-1.057 2.515 0 1.484 1.082 2.918 1.232 3.119.15.2 2.13 3.25 5.159 4.557.72.311 1.282.497 1.721.637.723.23 1.379.197 1.9.12.579-.085 1.787-.73 2.039-1.434.252-.703.252-1.307.176-1.433-.076-.127-.277-.202-.579-.353z"/></svg> WhatsApp`;
			whatsappBtn.style.display = "inline-flex";
			whatsappBtn.style.alignItems = "center";
			whatsappBtn.style.gap = "6px";
			whatsappBtn.style.padding = "6px 12px";
			whatsappBtn.style.borderRadius = "10px";
			whatsappBtn.style.border = "1px solid var(--tp-border)";
			whatsappBtn.style.fontSize = "12px";
			whatsappBtn.style.fontWeight = "600";
			whatsappBtn.style.textDecoration = "none";
			whatsappBtn.style.color = "var(--tp-green)";
			rightMenu.prepend(whatsappBtn);
		}
	}

	function mount() {
		if (!isOperator() || !ui().icons) return;
		enhanceTopbar();
		const config = routeConfig();
		document.body.classList.toggle("tp-custom-operations-page", Boolean(config));
		if (!config) return;
		const main = document.querySelector(".layout-main-section");
		if (!main) return;
		const existing = main.querySelector(".tp-operations-surface");
		if (existing?.dataset.page === config.page) return;
		existing?.remove();
		const surface = document.createElement("section");
		surface.className = "tp-operations-surface";
		surface.dataset.page = config.page;
		surface.innerHTML = `<div class="tp-op-loading"><i></i><i></i><i></i><span>Organizando a operação...</span></div>`;
		surface._tpState = {
			page: config.page,
			filters: {},
			start: 0,
			pageLength: PAGE_LENGTH,
			view: "list",
			loading: false,
		};
		main.prepend(surface);
		loadSurface(surface);
	}

	function start() {
		mount();
		setInterval(() => {
			enhanceTopbar();
		}, 1000);
		const observer = new MutationObserver(() => mount());
		observer.observe(document.body, { childList: true, subtree: true });
		frappe.router?.on?.("change", () => window.requestAnimationFrame(mount));
		window.addEventListener("popstate", mount);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", start, { once: true });
	} else {
		start();
	}
})();
