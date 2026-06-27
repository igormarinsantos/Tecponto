(() => {
	const TECPONTO_ROLES = [
		"TecPonto Atendente",
		"TecPonto Tecnico",
		"TecPonto Gestor",
		"TecPonto Direcao",
	];

	let currentSelectedTechnician = null;

	const ICONS = {
		overview: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
		service: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5-5L7.4 3.6l3 3-6.8 6.8a2.1 2.1 0 0 0 3 3l6.8-6.8 3 3 2.3-2.3a4 4 0 0 0 1-4"/><path d="m14 14 6 6"/></svg>',
		phone: '<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/></svg>',
		trade: '<svg viewBox="0 0 24 24"><path d="m17 3 4 4-4 4"/><path d="M3 7h18"/><path d="m7 21-4-4 4-4"/><path d="M21 17H3"/></svg>',
		customers: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
		stock: '<svg viewBox="0 0 24 24"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>',
		finance: '<svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/><path d="M16 15h2"/></svg>',
		automation: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
		plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
		search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
		arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
		refresh: '<svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>',
		alert: '<svg viewBox="0 0 24 24"><path d="M12 3 2.7 19h18.6L12 3Z"/><path d="M12 9v4M12 17h.01"/></svg>',
		check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
		shield: '<svg viewBox="0 0 24 24"><path d="M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
		camera: '<svg viewBox="0 0 24 24"><path d="M14.5 5 13 3h-2L9.5 5H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4.5Z"/><circle cx="12" cy="12.5" r="3.5"/></svg>',
		clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
		whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.805-9.799.002-2.592-1.01-5.029-2.852-6.874-1.841-1.843-4.288-2.857-6.877-2.858-5.393 0-9.786 4.398-9.788 9.802-.001 1.505.381 2.977 1.11 4.279l-.951 3.473 3.568-.936zm11.367-5.26c-.302-.151-1.787-.881-2.063-.982-.277-.1-.478-.151-.68.151-.202.302-.782.982-.958 1.183-.176.2-.353.226-.655.076-.3-.15-1.267-.467-2.413-1.489-.892-.796-1.493-1.778-1.669-2.079-.176-.301-.019-.464.132-.613.136-.134.302-.353.453-.529.151-.176.202-.302.302-.503.1-.2.05-.377-.025-.529-.076-.151-.68-1.637-.932-2.24-.246-.59-.496-.51-.68-.52-.176-.01-.377-.01-.579-.01-.201 0-.529.076-.805.378-.276.301-1.057 1.031-1.057 2.515 0 1.484 1.082 2.918 1.232 3.119.15.2 2.13 3.25 5.159 4.557.72.311 1.282.497 1.721.637.723.23 1.379.197 1.9.12.579-.085 1.787-.73 2.039-1.434.252-.703.252-1.307.176-1.433-.076-.127-.277-.202-.579-.353z"/></svg>',
		list: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
		kanban: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="10" rx="1"/><rect x="17" y="4" width="4" height="13" rx="1"/></svg>',
		filter: '<svg viewBox="0 0 24 24"><path d="M4 5h16M7 12h10M10 19h4"/></svg>',
		eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
		more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
		download: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>',
	};

	const NAV_GROUPS = [
		{
			label: "Início",
			items: [
				{
					label: "Privacidade e auditoria",
					description: "LGPD, retenção e anexos privados",
					href: "/desk/tecponto-privacy-settings",
					icon: ICONS.shield,
					roles: ["TecPonto Direcao"],
				},
				{
					label: "Visão geral",
					description: "O que precisa de você",
					href: "/desk/tecponto",
					icon: ICONS.overview,
				},
			],
		},
		{
			label: "Reparos",
			tone: "repair",
			items: [
				{
					label: "Ordens de serviço",
					description: "Consertos e garantias",
					href: "/desk/repair-order",
					icon: ICONS.service,
				},
				{
					label: "Aparelhos",
					description: "Cadastro e histórico",
					href: "/desk/service-device",
					icon: ICONS.phone,
				},
			],
		},
		{
			label: "Trocas",
			tone: "trade",
			items: [
				{
					label: "Avaliações",
					description: "Usados, ofertas e revisão",
					href: "/desk/trade-in-evaluation",
					icon: ICONS.trade,
				},
			],
		},
		{
			label: "Apoio",
			items: [
				{
					label: "Clientes",
					description: "Pessoas atendidas",
					href: "/desk/customer",
					icon: ICONS.customers,
				},
				{
					label: "Peças e estoque",
					description: "Itens disponíveis",
					href: "/desk/item",
					icon: ICONS.stock,
				},
				{
					label: "Vendas",
					description: "Catálogo e balcão",
					href: "/desk/tecponto-sales",
					icon: ICONS.finance,
				},
			],
		},
		{
			label: "Acompanhamento",
			collapsible: true,
			roles: ["TecPonto Gestor", "TecPonto Direcao"],
			items: [
				{
					label: "Catálogo e mínimos",
					description: "Tipos, compatibilidade e reposição",
					href: "/desk/tecponto-item-profile",
					icon: ICONS.stock,
				},
				{
					label: "Compras",
					description: "Pedidos aos fornecedores",
					href: "/desk/purchase-order",
					icon: ICONS.stock,
				},
				{
					label: "Recebimentos",
					description: "Entrada das compras",
					href: "/desk/purchase-receipt",
					icon: ICONS.stock,
				},
				{
					label: "Mensagens automáticas",
					description: "Eventos de reparo e troca",
					href: "/desk/tecponto-automation-event",
					icon: ICONS.automation,
				},
				{
					label: "Preferências de contato",
					description: "WhatsApp e consentimentos",
					href: "/desk/tecponto-contact-preference",
					icon: ICONS.customers,
				},
				{
					label: "Templates de mensagem",
					description: "Textos de Reparo e Troca",
					href: "/desk/tecponto-message-template",
					icon: ICONS.automation,
				},
				{
					label: "Relatórios",
					description: "Operação e desempenho",
					href: "/desk/tecponto-reports",
					icon: ICONS.finance,
				},
			],
		},
		{
			label: "Direção",
			collapsible: true,
			roles: ["TecPonto Direcao"],
			items: [
				{
					label: "Políticas operacionais",
					description: "Garantia e travas fiscais",
					href: "/desk/tecponto-operations-settings",
					icon: ICONS.automation,
				},
				{
					label: "Caixa",
					description: "Abertura, movimentos e fechamento",
					href: "/desk/tecponto-cash-session",
					icon: ICONS.finance,
				},
				{
					label: "Financeiro",
					description: "Faturas e recebimentos",
					href: "/desk/sales-invoice",
					icon: ICONS.finance,
				},
				{
					label: "Integrações",
					description: "WhatsApp, API e webhooks",
					href: "/desk/tecponto-integration-settings",
					icon: ICONS.automation,
				},
			],
		},
	];

	const ROUTE_ALIASES = new Map([
		["/desk/getting-started", "/desk/tecponto"],
		["/desk/vendas-acessorios", "/desk/tecponto-sales"],
		["/desk/vendas-e-acessorios", "/desk/tecponto-sales"],
		["/desk/tecponto-vendas-acessorios", "/desk/tecponto-sales"],
		["/desk/relatorios", "/desk/tecponto-reports"],
		["/desk/relatorios-tecponto", "/desk/tecponto-reports"],
		["/desk/tecponto-relatorios", "/desk/tecponto-reports"],
		["/desk/dashboard-atendente", "/desk/tecponto"],
		["/desk/dashboard-tecnico", "/desk/tecponto"],
		["/desk/dashboard-gestor", "/desk/tecponto"],
		["/desk/dashboard-diretor", "/desk/tecponto"],
		["/desk/tecponto-dashboard-atendente", "/desk/tecponto"],
		["/desk/tecponto-dashboard-tecnico", "/desk/tecponto"],
		["/desk/tecponto-dashboard-gestor", "/desk/tecponto"],
		["/desk/tecponto-dashboard-diretor", "/desk/tecponto"],
	]);

	const HIDDEN_MENU_LABELS = new Set([
		"Desktop",
		"Workspaces",
		"Website",
		"Session Defaults",
		"Help",
		"Aplicativos",
		"Área de trabalho",
		"Espaços de trabalho",
		"Site",
		"Padrões da sessão",
		"Ajuda",
	]);

	const DISPLAY_STATE = {
		"Em diagnostico": "Em diagnóstico",
		"Aguardando aprovacao": "Aguardando aprovação",
		"Aguardando peca": "Aguardando peça",
		"Avaliacao": "Avaliação",
		"Aquisicao aprovada": "Aquisição aprovada",
		"Em revisao": "Em revisão",
	};

	function hasRole(role) {
		return Boolean(window.frappe?.user?.has_role?.(role));
	}

	function isTecPontoOperator() {
		if (!window.frappe || frappe.session?.user === "Administrator") return false;
		return TECPONTO_ROLES.some(hasRole);
	}

	function canSee(item) {
		return !item.roles || item.roles.some(hasRole);
	}

	function escapeHtml(value) {
		return String(value ?? "")
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");
	}

	function displayState(value) {
		return DISPLAY_STATE[value] || value || "Sem etapa";
	}

	const CHOICE_ICONS = {
		customer: ICONS.customers,
		device: ICONS.phone,
		repair: ICONS.service,
		trade: ICONS.trade,
		whatsapp: ICONS.automation,
		priority: ICONS.alert,
		channel: ICONS.arrow,
		condition: ICONS.shield,
		photo: ICONS.camera,
		check: ICONS.check,
	};

	function mountChoiceCards(dialog, fieldname, choices, options = {}) {
		const field = dialog.fields_dict[fieldname];
		if (!field || field.$wrapper.data("tp-choice-mounted")) return;
		field.$wrapper.data("tp-choice-mounted", true).addClass("tp-choice-field");
		field.$input.addClass("tp-choice-native").attr("tabindex", "-1");
		const host = $(
			`<div class="tp-choice-grid tp-choice-grid--${options.columns || "auto"}" role="group" aria-label="${escapeHtml(field.df.label || fieldname)}"></div>`
		);
		field.$wrapper.find(".control-input").append(host);

		const normalized = choices.map((choice) =>
			typeof choice === "string"
				? { value: choice, label: displayState(choice), icon: options.icon }
				: choice
		);
		const render = (selectedValue) => {
			const selected = String(selectedValue ?? field.get_value() ?? "");
			host.html(
				normalized
					.map((choice) => {
						const active = String(choice.value) === selected;
						return `
							<button class="tp-choice-card${active ? " is-selected" : ""}" type="button" data-tp-choice="${escapeHtml(choice.value)}" aria-pressed="${active}">
								<span class="tp-choice-card__icon">${choice.icon || CHOICE_ICONS[choice.tone] || ICONS.check}</span>
								<span class="tp-choice-card__copy">
									<strong>${escapeHtml(choice.label)}</strong>
									${choice.description ? `<small>${escapeHtml(choice.description)}</small>` : ""}
								</span>
							</button>
						`;
					})
					.join("")
			);
		};
		host.on("click", "[data-tp-choice]", function () {
			const value = this.dataset.tpChoice;
			field.$input.val(value);
			field.set_value(value);
			render(value);
			field.$input.trigger("change");
		});
		field.$input.on("change.tp-choice", render);
		render();
	}

	function mountCommonChoices(dialog, definitions) {
		Object.entries(definitions).forEach(([fieldname, definition]) => {
			mountChoiceCards(
				dialog,
				fieldname,
				definition.choices || definition,
				definition.choices ? definition : {}
			);
		});
	}

	function requireDialogValue(data, fieldname, message) {
		if (String(data[fieldname] || "").trim()) return true;
		frappe.msgprint({ title: "Falta uma informação", message, indicator: "orange" });
		return false;
	}

	function customerModeFields(dialog, currentStep, modeField = "customer_mode") {
		const existing = dialog.fields_dict[modeField]?.get_value() !== "Novo cliente";
		dialog.fields_dict.customer?.$wrapper.toggle(currentStep === 1 && existing);
		dialog.fields_dict.customer_name?.$wrapper.toggle(currentStep === 1 && !existing);
		dialog.fields_dict.whatsapp_number?.$wrapper.toggle(currentStep === 1 && !existing);
		return existing;
	}

	function operationalConsentChoices() {
		return [
			{
				value: "1",
				label: "Sim, enviar atualizações",
				description: "Mensagens somente sobre este atendimento.",
				icon: CHOICE_ICONS.whatsapp,
			},
			{
				value: "0",
				label: "Não enviar mensagens",
				description: "O acompanhamento será feito presencialmente.",
				icon: ICONS.shield,
			},
		];
	}

	function isWorkspaceRoute() {
		const path = window.location.pathname.replace(/\/+$/, "");
		const route = window.frappe?.get_route?.() || [];
		return (
			path === "/desk/tecponto" ||
			(route[0] === "Workspaces" && route[1] === "TecPonto")
		);
	}

	function redirectGenericDesk() {
		if (!isTecPontoOperator()) return;
		const path = window.location.pathname.replace(/\/+$/, "");
		const alias = ROUTE_ALIASES.get(path);
		if (alias && alias !== path) {
			window.location.replace(alias);
			return;
		}
		if (path === "/desk" || path === "/apps") {
			window.location.replace("/desk/tecponto");
		}
	}

	function setupBrand(sidebar) {
		const header = sidebar.querySelector(".sidebar-header");
		if (!header || header.querySelector(".tp-sidebar-brand")) return;

		const brand = document.createElement("span");
		brand.className = "tp-sidebar-brand";
		brand.innerHTML = `
			<span class="tp-sidebar-brand__full">
				<img src="/assets/tecponto/images/tecponto-logo.png" alt="TecPonto">
				<small>Central de operação</small>
			</span>
			<span class="tp-sidebar-brand__compact" aria-hidden="true">
				<img src="/assets/tecponto/images/favicon.svg" alt="">
			</span>
		`;
		header.prepend(brand);
	}

	function closeMobileSidebar() {
		if (window.innerWidth >= 768) return;
		window.frappe?.app?.sidebar?.close?.();
		document.querySelector(".body-sidebar-container")?.classList.remove("expanded");
		document.body.classList.remove("tp-mobile-menu-open");
	}

	function setupOperatorNavigation(sidebar) {
		if (window.innerWidth >= 768) {
			document.querySelector(".body-sidebar-container")?.classList.add("expanded");
		}
		let nav = sidebar.querySelector(".tp-operator-nav");
		if (!nav) {
			nav = document.createElement("nav");
			nav.className = "tp-operator-nav";
			nav.setAttribute("aria-label", "Navegação TecPonto");
			sidebar.querySelector(".sidebar-header")?.insertAdjacentElement("afterend", nav);
		}

		const groups = NAV_GROUPS
			.filter(canSee)
			.map((group) => ({
				...group,
				items: group.items.filter(canSee),
			}))
			.filter((group) => group.items.length);
		const signature = groups
			.flatMap((group) => group.items.map((item) => item.href))
			.join("|");
		if (nav.dataset.signature !== signature) {
			nav.dataset.signature = signature;
			const currentPath = window.location.pathname.replace(/\/+$/, "");
			nav.innerHTML = `
				${groups
					.map(
						(group) => {
							const hasActiveItem = group.items.some(
								(item) =>
									currentPath === item.href ||
									currentPath.startsWith(`${item.href}/`)
							);
							const isOpen = !group.collapsible || hasActiveItem;
							return `
								<section class="tp-operator-nav__group tp-nav-group--${group.tone || "neutral"}${group.collapsible && !isOpen ? " is-collapsed" : ""}" data-tp-nav-group>
									${
										group.collapsible
											? `<button class="tp-operator-nav__label tp-operator-nav__label--toggle" type="button" data-tp-group-toggle aria-expanded="${isOpen}">
												<span>${group.label}</span>
												<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg>
											</button>`
											: `<div class="tp-operator-nav__label">${group.label}</div>`
									}
									<div class="tp-operator-nav__items">
										${group.items
											.map(
												(item) => `
													<a class="tp-operator-nav__link" href="${item.href}" data-tp-href="${item.href}" aria-label="${item.label}" title="${item.label}">
														<span class="tp-operator-nav__icon" aria-hidden="true">${item.icon}</span>
														<span class="tp-operator-nav__copy">
															<strong>${item.label}</strong>
															<small>${item.description}</small>
														</span>
													</a>
												`
											)
											.join("")}
									</div>
								</section>
							`;
						}
					)
					.join("")}
			`;
			nav.querySelectorAll("[data-tp-group-toggle]").forEach((button) => {
				button.addEventListener("click", () => {
					const group = button.closest("[data-tp-nav-group]");
					const collapsed = group.classList.toggle("is-collapsed");
					button.setAttribute("aria-expanded", String(!collapsed));
				});
			});
		}
		if (!nav.dataset.mobileNavigationBound) {
			nav.dataset.mobileNavigationBound = "1";
			nav.addEventListener("click", (event) => {
				if (window.innerWidth >= 768 || !event.target.closest("[data-tp-href]")) return;
				closeMobileSidebar();
			});
		}
		updateActiveNavigation(nav);
	}

	function updateActiveNavigation(nav = document.querySelector(".tp-operator-nav")) {
		if (!nav) return;
		const path = window.location.pathname.replace(/\/+$/, "");
		nav.querySelectorAll("[data-tp-href]").forEach((link) => {
			const href = link.dataset.tpHref;
			const isActive = path === href || path.startsWith(`${href}/`);
			link.classList.toggle("is-active", isActive);
			if (isActive) link.setAttribute("aria-current", "page");
			else link.removeAttribute("aria-current");
		});
		nav.querySelectorAll("[data-tp-nav-group]").forEach((group) => {
			const activeLink = group.querySelector(".tp-operator-nav__link.is-active");
			const toggle = group.querySelector("[data-tp-group-toggle]");
			if (activeLink && toggle) {
				group.classList.remove("is-collapsed");
				toggle.setAttribute("aria-expanded", "true");
			}
		});
	}

	function simplifyAppMenu(root = document) {
		root.querySelectorAll?.(".frappe-menu-item").forEach((item) => {
			const label = item.querySelector(".menu-item-title")?.textContent?.trim();
			if (HIDDEN_MENU_LABELS.has(label)) item.remove();
		});
	}

	const INTERFACE_TRANSLATIONS = {
		Notification: "Notificações",
		Notifications: "Notificações",
		"Last Updated On": "Última atualização",
		"List View": "Lista",
		"Add Customer": "Cadastrar cliente",
		"Add Trade In Evaluation": "Nova avaliação de troca",
		"Add Service Device": "Cadastrar aparelho",
		"Add Repair Order": "Registrar reparo",
		"Filter by": "Filtrar por",
		"Clear All": "Limpar tudo",
		"Assign To": "Atribuir a",
		"Created By": "Criado por",
		"Search": "Buscar",
		"Refresh": "Atualizar",
		"Cancel": "Cancelar",
		"Edit": "Editar",
		"Delete": "Excluir",
		"Save": "Salvar",
		"Status": "Situação",
		"Owner": "Criador",
		"Modified": "Modificado",
		"Created": "Criado",
		"Import": "Importar",
		"Export": "Exportar",
		"Actions": "Ações",
		"Settings": "Configurações",
		"Help": "Ajuda",
		"Report": "Relatório",
		"Search or type a command (Ctrl + G)": "Buscar ou digitar um comando (Ctrl + G)",
		"No notifications": "Sem notificações",
		"No results found": "Nenhum resultado encontrado",
		"Assign": "Atribuir",
		"Add Filter": "Adicionar filtro",
		"ID": "Código",
	};

	const OPERATIONAL_LISTS = {
		"/desk/repair-order": {
			className: "tp-list-repair",
			icon: ICONS.service,
			eyebrow: "Oficina",
			title: "Ordens de serviço",
			description: "Cada cartão mostra etapa, prazo e responsável sem abrir a OS.",
			filters: [
				["Todas", "/desk/repair-order"],
				["Atrasadas", "/desk/repair-order?sla_status=Atrasado"],
				["Sem técnico", "/desk/repair-order?technician=%5B%22is%22%2C%22not%20set%22%5D"],
				["Aguardando peça", "/desk/repair-order?workflow_state=Aguardando%20peca"],
				["Prontas", "/desk/repair-order?workflow_state=Pronto%20para%20retirada"],
			],
		},
		"/desk/trade-in-evaluation": {
			className: "tp-list-trade",
			icon: ICONS.trade,
			eyebrow: "Trocas",
			title: "Avaliações de troca",
			description: "Triagem, oferta e revisão separadas por estado visual.",
			filters: [
				["Todas", "/desk/trade-in-evaluation"],
				["Para avaliar", "/desk/trade-in-evaluation?workflow_state=Triagem%20de%20troca"],
				["Oferta pendente", "/desk/trade-in-evaluation?workflow_state=Oferta%20pendente"],
				["Em revisão", "/desk/trade-in-evaluation?workflow_state=Em%20revisao"],
				["Prontas", "/desk/trade-in-evaluation?workflow_state=Pronto%20para%20venda"],
			],
		},
		"/desk/service-device": {
			className: "tp-list-device",
			icon: ICONS.phone,
			eyebrow: "Aparelhos",
			title: "Aparelhos dos clientes",
			description: "Identificação rápida, titularidade e histórico de atendimento.",
			filters: [
				["Ativos", "/desk/service-device?active=1"],
				["Todos", "/desk/service-device"],
			],
		},
		"/desk/customer": {
			className: "tp-list-customer",
			icon: ICONS.customers,
			eyebrow: "Relacionamento",
			title: "Clientes",
			description: "Localize pelo nome ou WhatsApp antes de criar um novo cadastro.",
			filters: [
				["Todos", "/desk/customer"],
				["Recentes", "/desk/customer?disabled=0"],
			],
		},
	};

	function translateInterfaceLeaks(root = document) {
		root.querySelectorAll?.(
			".sidebar-item-label, .dropdown-text, .btn, .page-title, .list-row-head, .filter-box, .sort-selector, .filter-label, .filter-button, .sort-label, .meta-item, .page-actions, .ellipsis"
		).forEach((element) => {
			element.childNodes.forEach((node) => {
				if (node.nodeType !== Node.TEXT_NODE) return;
				const text = node.textContent.trim();
				if (!INTERFACE_TRANSLATIONS[text]) return;
				node.textContent = node.textContent.replace(text, INTERFACE_TRANSLATIONS[text]);
			});
		});

		root.querySelectorAll?.("input[placeholder]").forEach((input) => {
			const text = input.getAttribute("placeholder")?.trim();
			if (text && INTERFACE_TRANSLATIONS[text]) {
				input.setAttribute("placeholder", INTERFACE_TRANSLATIONS[text]);
			}
		});
	}

	function rowTone(text) {
		if (/Atrasado|Bloqueado|Recusad|Cancelad|Sem conserto|Urgente/i.test(text)) return "danger";
		if (/Aguardando|Pendente|Triagem|Vence em breve/i.test(text)) return "waiting";
		if (/Pronto|Entregue|Aceita|Concluído/i.test(text)) return "success";
		if (/Diagnóstico|diagnostico|Avaliação|Avaliacao|Em reparo|Em testes|Em revisão|Em revisao/i.test(text)) return "active";
		return "neutral";
	}

	function enhanceOperationalList(root = document) {
		const path = window.location.pathname.replace(/\/+$/, "");
		const config = OPERATIONAL_LISTS[path];
		document.body.classList.remove(
			"tp-operational-list",
			"tp-list-repair",
			"tp-list-trade",
			"tp-list-device",
			"tp-list-customer"
		);
		if (!config) return;
		document.body.classList.add("tp-operational-list", config.className);

		const main = root.querySelector?.(".layout-main-section") || document.querySelector(".layout-main-section");
		if (main && !main.querySelector(".tp-list-context")) {
			const context = document.createElement("section");
			context.className = "tp-list-context";
			context.innerHTML = `
				<header>
					<span class="tp-list-context__icon">${config.icon}</span>
					<div>
						<small>${config.eyebrow}</small>
						<h2>${config.title}</h2>
						<p>${config.description}</p>
					</div>
				</header>
				<nav aria-label="Filtros rápidos">
					${config.filters
						.map(([label, href]) => `<a href="${href}" class="${`${window.location.pathname}${window.location.search}` === href ? "is-active" : ""}">${escapeHtml(label)}</a>`)
						.join("")}
				</nav>
			`;
			const list = main.querySelector(".frappe-list, .list-view");
			if (list) main.insertBefore(context, list);
			else main.prepend(context);
		}

		document.querySelectorAll(".list-row-container").forEach((row) => {
			row.classList.remove("tp-row-danger", "tp-row-waiting", "tp-row-success", "tp-row-active", "tp-row-neutral");
			row.classList.add(`tp-row-${rowTone(row.textContent || "")}`);
		});
	}

	function attentionCard(item) {
		return `
			<a class="tp-attention-card tp-tone-${item.tone}" href="${item.href}">
				<span class="tp-attention-card__icon">${item.tone === "green" ? ICONS.check : ICONS.alert}</span>
				<span class="tp-attention-card__copy">
					<strong>${escapeHtml(item.label)}</strong>
					<small>${escapeHtml(item.description)}</small>
				</span>
				<b>${item.count}</b>
			</a>
		`;
	}

	function stageCard(item) {
		return `
			<a class="tp-stage tp-tone-${item.tone}" href="${item.href}">
				<span>${escapeHtml(item.label)}</span>
				<strong>${item.count}</strong>
			</a>
		`;
	}

	function operationRow(item, type) {
		const isRepair = type === "repair";
		const title = item.customer_name || (isRepair ? "Ordem de serviço" : "Avaliação");
		const meta = (isRepair
			? [item.service_type, item.device, item.name]
			: [item.device, item.name]
		)
			.filter(Boolean)
			.join(" · ");
		const state = item.is_late
			? `Atrasado · ${displayState(item.workflow_state)}`
			: displayState(item.workflow_state);
		const href = isRepair
			? `/desk/repair-order/${encodeURIComponent(item.name)}`
			: `/desk/trade-in-evaluation/${encodeURIComponent(item.name)}`;

		return `
			<a class="tp-operation-row" href="${href}">
				<span class="tp-operation-row__icon">${isRepair ? ICONS.service : ICONS.trade}</span>
				<span class="tp-operation-row__copy">
					<strong>${escapeHtml(title)}</strong>
					<small>${escapeHtml(meta)}</small>
				</span>
				<span class="tp-status${item.is_late ? " tp-status--late" : ""}">${escapeHtml(state)}</span>
				<span class="tp-operation-row__arrow">${ICONS.arrow}</span>
			</a>
		`;
	}

	function emptyState(message) {
		return `<div class="tp-empty">${ICONS.check}<span>${escapeHtml(message)}</span></div>`;
	}

	function stockSection(stock) {
		if (!stock) return "";
		const rows = stock.low_items?.length
			? stock.low_items
					.map(
						(item) => `
							<a class="tp-operation-row" href="/desk/item/${encodeURIComponent(item.item)}">
								<span class="tp-operation-row__icon">${ICONS.stock}</span>
								<span class="tp-operation-row__copy">
									<strong>${escapeHtml(item.item)}</strong>
									<small>${escapeHtml(item.type)} · mínimo ${item.minimum_stock}</small>
								</span>
								<span class="tp-status tp-status--late">Saldo ${item.actual_qty}</span>
								<span class="tp-operation-row__arrow">${ICONS.arrow}</span>
							</a>
						`
					)
					.join("")
			: emptyState("Nenhum item abaixo do mínimo.");
		return `
			<section class="tp-dashboard-section">
				<div class="tp-section-heading tp-section-heading--inline">
					<div>
						<span>Estoque · Gestor</span>
						<h2>${stock.low_count} itens precisam de reposição</h2>
					</div>
					<a href="/desk/tecponto-item-profile">Abrir catálogo ${ICONS.arrow}</a>
				</div>
				<div class="tp-operation-list">${rows}</div>
			</section>
		`;
	}

	function cashSection(cash) {
		if (!cash) return "";
		if (!cash.enabled) {
			return `
				<section class="tp-dashboard-section">
					<div class="tp-section-heading"><span>Direção · Caixa</span><h2>Controle protegido</h2></div>
					<div class="tecponto-privacy-note">O caixa permanece desligado até a aprovação do processo financeiro. <a href="/desk/tecponto-operations-settings"><strong>Revisar políticas</strong></a></div>
				</section>
			`;
		}
		if (!cash.session) {
			return `
				<section class="tp-dashboard-section">
					<div class="tp-section-heading"><span>Direção · Caixa</span><h2>Caixa fechado</h2></div>
					<button class="btn btn-primary" type="button" data-tp-open-cash>Abrir caixa</button>
				</section>
			`;
		}
		return `
			<section class="tp-dashboard-section">
				<div class="tp-section-heading tp-section-heading--inline">
					<div><span>Direção · Caixa aberto</span><h2>Esperado: ${formatCurrency(cash.expected_amount)}</h2></div>
					<a href="/desk/tecponto-cash-session/${encodeURIComponent(cash.session)}">Ver caixa ${ICONS.arrow}</a>
				</div>
				<div class="tp-service-category__actions tp-cash-actions">
					<button type="button" data-tp-cash-movement>${ICONS.plus} Registrar movimento</button>
					<button type="button" data-tp-close-cash>${ICONS.check} Fechar caixa</button>
				</div>
			</section>
		`;
	}

	function formatCurrency(value) {
		return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
			Number(value || 0)
		);
	}

	function formatDeadline(value) {
		if (!value) return "Sem prazo";
		const date = new Date(String(value).replace(" ", "T"));
		if (Number.isNaN(date.getTime())) return value;
		return new Intl.DateTimeFormat("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	}

	function attendantDashboardMarkup(summary) {
		const firstName =
			frappe.boot?.user?.first_name ||
			frappe.session?.user?.split("@")[0] ||
			"atendimento";
		return `
			<section class="tp-command-center tp-role-home tp-role-home--attendant" aria-label="Novo atendimento">
				<header class="tp-command-header" style="align-items: center;">
					<div>
						<h1 style="font-size: 24px; font-weight: 700; color: var(--tp-text);">Olá, Atendente TecPonto.</h1>
						<p style="margin-top: 4px; font-size: 13px; color: var(--tp-text-muted);">Escolha a necessidade do cliente. O sistema conduz o restante.</p>
					</div>
					<div style="display: flex; align-items: center; gap: 16px;">
						<div style="display: flex; flex-direction: column; align-items: flex-end;">
							<span style="font-size: 10px; color: var(--tp-text-muted); font-weight: bold; text-transform: uppercase;">Loja</span>
							<select class="form-control" style="background: var(--tp-surface-raised); border: 1px solid var(--tp-border); color: var(--tp-text); font-size: 12px; height: 30px; padding: 2px 8px; border-radius: 6px;">
								<option>TecPonto Matriz</option>
							</select>
						</div>
						<div style="display: flex; flex-direction: column; align-items: flex-end;">
							<span style="font-size: 10px; color: var(--tp-text-muted); font-weight: bold; text-transform: uppercase;">Conexão WhatsApp</span>
							<span class="tp-badge-sem tp-badge-sem--success" style="font-size: 11px; padding: 2px 8px; border-radius: 4px;">
								<span style="width: 6px; height: 6px; border-radius: 50%; background-color: var(--tp-green); display: inline-block; margin-right: 4px;"></span>
								Conectado
							</span>
						</div>
						<button class="tp-icon-button" type="button" data-tp-refresh aria-label="Atualizar painel">${ICONS.refresh}</button>
						<button class="tp-icon-button" type="button" onclick="frappe.app.logout()" aria-label="Sair" title="Sair"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>
					</div>
				</header>

				<h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--tp-text); display: flex; align-items: center; gap: 6px;">
					O que fazer agora
					<span style="cursor: pointer; color: var(--tp-text-muted); display: inline-flex;" title="Ações rápidas do balcão">${ICONS.alert}</span>
				</h2>
				<div class="tp-actions-now-grid">
					<a href="/desk/tecponto-sales" class="tp-action-now-card tp-action-now-card--active" style="text-decoration: none; color: inherit;">
						<div class="tp-action-now-card__icon">${ICONS.finance}</div>
						<div>
							<div class="tp-action-now-card__title">Lançar venda</div>
							<div class="tp-action-now-card__sub">Aparelhos e acessórios</div>
						</div>
					</a>
					<div class="tp-action-now-card" data-tp-guided-repair>
						<div class="tp-action-now-card__icon">${ICONS.plus}</div>
						<div>
							<div class="tp-action-now-card__title">Nova ordem de serviço</div>
							<div class="tp-action-now-card__sub">Abrir uma nova OS</div>
						</div>
					</div>
					<a href="/desk/repair-order" class="tp-action-now-card" style="text-decoration: none; color: inherit;">
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.search}</div>
						<div>
							<div class="tp-action-now-card__title">Buscar atendimento</div>
							<div class="tp-action-now-card__sub">Localizar OS, cliente ou aparelho</div>
						</div>
					</a>
					<div class="tp-action-now-card" data-tp-guided-customer>
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.customers}</div>
						<div>
							<div class="tp-action-now-card__title">Cadastrar cliente</div>
							<div class="tp-action-now-card__sub">Novo cliente no sistema</div>
						</div>
					</div>
					<div class="tp-action-now-card" data-tp-guided-device>
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.phone}</div>
						<div>
							<div class="tp-action-now-card__title">Cadastrar aparelho</div>
							<div class="tp-action-now-card__sub">Adicionar aparelho do cliente</div>
						</div>
					</div>
					<div class="tp-action-now-card" data-tp-guided-trade>
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.trade}</div>
						<div>
							<div class="tp-action-now-card__title">Avaliar troca</div>
							<div class="tp-action-now-card__sub">Triagem, oferta e revisão</div>
						</div>
					</div>
					<div class="tp-action-now-card" id="tp-btn-send-sig-link">
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.whatsapp}</div>
						<div>
							<div class="tp-action-now-card__title">Enviar link de assinatura</div>
							<div class="tp-action-now-card__sub">Gerar e enviar para o cliente</div>
						</div>
					</div>
				</div>

				<div class="tp-section-heading" style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid var(--tp-border); padding-bottom: 8px;">
					<h2 style="font-size: 14px; font-weight: 700; margin: 0; color: var(--tp-text);">Resumo operacional <span style="font-size: 11px; font-weight: normal; color: var(--tp-text-muted); margin-left: 8px;">Visão rápida do balcão</span></h2>
				</div>
				<div class="tp-metric-grid">
					<a href="/desk/tecponto-sales" class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(40, 199, 111, 0.1); color: var(--tp-green); align-items: center; justify-content: center;">${ICONS.finance}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.today_sales_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">Vendas do dia</div>
						<div style="font-size: 9px; color: var(--tp-text-muted);">Ver catálogo -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Aguardando%20aprovacao" class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 159, 67, 0.1); color: var(--tp-yellow); align-items: center; justify-content: center;">${ICONS.clock}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.awaiting_approval_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">OS aguardando aprovação</div>
						<div style="font-size: 9px; color: var(--tp-text-muted);">Ver detalhes -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Pronto%20para%20retirada" class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(40, 199, 111, 0.1); color: var(--tp-green); align-items: center; justify-content: center;">${ICONS.check}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.ready_for_pickup_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">OS prontas para retirada</div>
						<div style="font-size: 9px; color: var(--tp-text-muted);">Ver detalhes -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Recebido" class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(130, 134, 255, 0.1); color: var(--tp-purple); align-items: center; justify-content: center;">${ICONS.overview}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.awaiting_signature_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">Assinaturas pendentes</div>
						<div style="font-size: 9px; color: var(--tp-text-muted);">Ver detalhes -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Aguardando%20peca" class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 159, 67, 0.1); color: var(--tp-yellow); align-items: center; justify-content: center;">${ICONS.stock}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.awaiting_parts_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">Aguardando peça</div>
						<div style="font-size: 9px; color: var(--tp-text-muted);">Ver detalhes -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Recebido" class="tp-metric-card">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); color: var(--tp-blue); align-items: center; justify-content: center;">${ICONS.customers}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.waiting_customers_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted);">Clientes aguardando</div>
						<div style="font-size: 9px; color: var(--tp-text-muted);">Ver detalhes -></div>
					</a>
				</div>

				<div class="tp-bottom-layout-columns">
					<div class="tp-bottom-layout-main">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
							<div>
								<h2 style="font-size: 14px; font-weight: 700; margin: 0; color: var(--tp-text);">Atendimentos e vendas que precisam de você</h2>
								<div style="font-size: 11px; color: var(--tp-text-muted);">Priorize e avance os atendimentos do dia.</div>
							</div>
							<a href="/desk/repair-order" style="font-size: 12px; color: var(--tp-orange); font-weight: bold; text-decoration: none;">Ver todos os atendimentos -></a>
						</div>
						<div class="tp-op-table-card">
							<div class="tp-op-table-scroll">
								<table class="tp-op-table">
									<thead>
										<tr>
											<th class="col-id">ID</th>
											<th class="col-client">Cliente</th>
											<th class="col-description">Aparelho</th>
											<th class="col-status">Etapa atual</th>
											<th class="col-status">Urgência</th>
											<th class="col-date">Atualização</th>
											<th class="col-actions">Ações</th>
										</tr>
									</thead>
									<tbody>
										${summary.attendant_attention_items && summary.attendant_attention_items.length ? summary.attendant_attention_items.map(item => {
											let badgeClass = "tp-badge-sem--muted";
											let subLabel = "";
											let stateLabel = item.workflow_state;
											
											if (item.type === "repair") {
												if (item.workflow_state === "Recebido" && !item.customer_signature_hash) {
													badgeClass = "tp-badge-sem--purple";
													stateLabel = "Aguardando assinatura";
													subLabel = "Link enviado";
												} else if (item.workflow_state === "Aguardando aprovacao") {
													badgeClass = "tp-badge-sem--warning";
													subLabel = "Orçamento enviado";
												} else if (item.workflow_state === "Aguardando peca") {
													badgeClass = "tp-badge-sem--warning";
													subLabel = "Peça solicitada";
												} else if (item.workflow_state === "Pronto para retirada") {
													badgeClass = "tp-badge-sem--success";
													subLabel = "Aguardando cliente";
												} else if (item.workflow_state === "Recebido") {
													badgeClass = "tp-badge-sem--info";
													subLabel = "Recebido no balcão";
												} else if (item.workflow_state === "Em diagnostico") {
													badgeClass = "tp-badge-sem--info";
													subLabel = "Em diagnóstico";
												}
											} else {
												badgeClass = "tp-badge-sem--teal";
												stateLabel = "Triagem de troca";
												subLabel = "Avaliação em andamento";
											}
											
											let urgencyClass = "tp-badge-sem--muted";
											if (item.urgency === "Alta") urgencyClass = "tp-badge-sem--danger";
											else if (item.urgency === "Média") urgencyClass = "tp-badge-sem--warning";
											else if (item.urgency === "Baixa") urgencyClass = "tp-badge-sem--success";
											
											let actionBtnHtml = "";
											if (item.type === "repair") {
												actionBtnHtml = `
													<button class="btn btn-default btn-xs tp-btn-row-wa" data-phone="${item.whatsapp || ''}" data-name="${item.customer_name || ''}" data-os="${item.name}" style="padding: 2px 4px; color: var(--tp-green); border: none; background: transparent; font-size: 14px;" title="WhatsApp">${ICONS.whatsapp}</button>
													<a href="/desk/repair-order/${item.name}" class="btn btn-default btn-xs" style="padding: 2px 4px; color: var(--tp-orange); border: none; background: transparent; font-size: 14px;" title="Editar/Ver">${ICONS.arrow}</a>
												`;
											} else {
												actionBtnHtml = `
													<a href="/desk/trade-in-evaluation/${item.name}" class="btn btn-default btn-xs" style="padding: 2px 4px; color: var(--tp-orange); border: none; background: transparent; font-size: 14px;" title="Ver troca">${ICONS.arrow}</a>
												`;
											}
											
											return `
												<tr style="border-bottom: 1px solid var(--tp-border);">
													<td style="padding: 10px 8px; font-weight: 700; color: var(--tp-text);">${item.name}</td>
													<td style="padding: 10px 8px;">
														<div style="font-weight: 600; color: var(--tp-text);">${escapeHtml(item.customer_name)}</div>
														<div style="font-size: 10px; color: var(--tp-text-muted);">${escapeHtml(item.whatsapp || '')}</div>
													</td>
													<td style="padding: 10px 8px; font-weight: 500; color: var(--tp-text);">${escapeHtml(item.device_label)}</td>
													<td style="padding: 10px 8px;">
														<span class="tp-badge-sem ${badgeClass}">
															${escapeHtml(stateLabel)}
														</span>
														${subLabel ? `<div style="font-size: 10px; color: var(--tp-text-muted); margin-top: 2px;">${subLabel}</div>` : ''}
													</td>
													<td style="padding: 10px 8px;">
														<span class="tp-badge-sem ${urgencyClass}">
															${item.urgency || 'Baixa'}
														</span>
													</td>
													<td style="padding: 10px 8px; color: var(--tp-text-muted); font-size: 11px;">Recente</td>
													<td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
														${actionBtnHtml}
													</td>
												</tr>
											`;
										}).join("") : `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--tp-text-muted);">Nenhum atendimento pendente.</td></tr>`}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<aside class="tp-bottom-layout-sidebar">
						<div class="tp-sidebar-widget">
							<h2 style="font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--tp-text);">Atalhos do balcão</h2>
							<div class="tp-shortcut-list">
								<a href="/desk/tecponto-sales" class="tp-shortcut-item" style="text-decoration: none;">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-orange); display: flex;">${ICONS.finance}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px; color: var(--tp-text);">Lançar venda</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Aparelhos e acessórios</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</a>
								<div class="tp-shortcut-item" data-tp-guided-repair>
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-orange); display: flex;">${ICONS.service}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Abrir OS</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Iniciar atendimento</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</div>
								<div class="tp-shortcut-item" id="tp-shortcut-send-wa">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-green); display: flex;">${ICONS.whatsapp}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Enviar WhatsApp</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Falar com o cliente</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</div>
								<div class="tp-shortcut-item" id="tp-shortcut-sig-link">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-purple); display: flex;">${ICONS.overview}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Reenviar assinatura</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Enviar link novamente</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</div>
								<a href="/desk/repair-order" class="tp-shortcut-item">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-blue); display: flex;">${ICONS.refresh}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Atualizar status</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Avançar etapa da OS</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</a>
								<div class="tp-shortcut-item" id="tp-shortcut-ready">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-green); display: flex;">${ICONS.check}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Registrar retirada</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Confirmar retirada do cliente</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</div>
							</div>
						</div>

						<div class="tp-sidebar-widget">
							<h2 style="font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--tp-text);">Alertas e pendências</h2>
							<div class="tp-alert-pills-list" style="margin-bottom: 20px;">
								<a href="/desk/repair-order?sla_status=Atrasado" class="tp-alert-pill" style="text-decoration: none; color: inherit;">
									<div class="tp-alert-pill__left">
										<span class="tp-alert-pill__dot tp-alert-pill__dot--danger"></span>
										<span style="font-weight: 600;">${summary.late_repairs_count || 0} OS atrasadas</span>
									</div>
									<span style="color: var(--tp-text-muted); font-size: 10px;">Precisam de atenção imediata -></span>
								</a>
								<a href="/desk/repair-order?workflow_state=Aguardando%20aprovacao" class="tp-alert-pill" style="text-decoration: none; color: inherit;">
									<div class="tp-alert-pill__left">
										<span class="tp-alert-pill__dot tp-alert-pill__dot--warning"></span>
										<span style="font-weight: 600;">${summary.awaiting_approval_count || 0} aguardando aprovação</span>
									</div>
									<span style="color: var(--tp-text-muted); font-size: 10px;">Sem retorno do cliente -></span>
								</a>
								<a href="/desk/repair-order" class="tp-alert-pill" style="text-decoration: none; color: inherit;">
									<div class="tp-alert-pill__left">
										<span class="tp-alert-pill__dot tp-alert-pill__dot--purple"></span>
										<span style="font-weight: 600;">${summary.awaiting_signature_count || 0} assinaturas pendentes</span>
									</div>
									<span style="color: var(--tp-text-muted); font-size: 10px;">Link expirando em breve -></span>
								</a>
								<a href="/desk/repair-order?workflow_state=Aguardando%20peca" class="tp-alert-pill" style="text-decoration: none; color: inherit;">
									<div class="tp-alert-pill__left">
										<span class="tp-alert-pill__dot tp-alert-pill__dot--warning" style="background-color: var(--tp-yellow);"></span>
										<span style="font-weight: 600;">${summary.awaiting_parts_count || 0} aguardando peça</span>
									</div>
									<span style="color: var(--tp-text-muted); font-size: 10px;">Peças não recebidas -></span>
								</a>
							</div>
						</div>

						<div class="tp-sidebar-widget" style="background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
							<div style="display: flex; align-items: center; gap: 10px;">
								<span style="display: flex; width: 36px; height: 36px; border-radius: 50%; background: rgba(40, 199, 111, 0.1); color: var(--tp-green); align-items: center; justify-content: center; font-size: 20px;">${ICONS.whatsapp}</span>
								<div>
									<div style="font-weight: 700; font-size: 13px; color: var(--tp-text);">WhatsApp integrado</div>
									<div style="font-size: 11px; color: var(--tp-text-muted);">Comunicação e histórico dentro da OS.</div>
								</div>
							</div>
							<a href="/desk/tecponto-contact-preference" class="btn btn-default btn-block btn-sm" style="background: var(--tp-surface-raised); border: 1px solid var(--tp-border); font-size: 11px; font-weight: bold; text-align: center; color: var(--tp-text); padding: 8px 12px; border-radius: 6px; text-decoration: none;">Abrir conversas ></a>
						</div>
					</aside>
				</div>

				<div class="tp-bottom-banner" id="tp-sig-banner">
					<div class="tp-bottom-banner__left">
						<span class="tp-bottom-banner__icon">${ICONS.overview}</span>
						<div>
							<strong style="color: var(--tp-text);">Assinatura digital integrada</strong>
							<span style="color: var(--tp-text-muted); margin-left: 8px;">Links de assinatura são gerados e armazenados no sistema. Mais segurança e agilidade.</span>
						</div>
					</div>
					<div style="display: flex; align-items: center; gap: 12px;">
						<a href="/desk/tecponto-operations-settings" class="btn btn-default btn-sm" style="background: var(--tp-surface-raised); border: 1px solid var(--tp-border); color: var(--tp-text); text-decoration: none; font-weight: bold; font-size: 11px; padding: 6px 12px; border-radius: 6px;">Saiba mais</a>
						<button type="button" class="btn btn-default btn-sm" id="btn-close-sig-banner" style="border: none; background: transparent; color: var(--tp-text-muted); font-size: 14px; font-weight: bold; padding: 0 4px; cursor: pointer;">X</button>
					</div>
				</div>
			</section>
		`;
	}

	function managementSection(management) {
		if (!management?.insights?.length) return "";
		const insights = management.insights
			.map(
				(item) => `
					<a class="tp-insight-card tp-insight-card--${escapeHtml(item.tone)}" href="${item.href}">
						<div class="tp-insight-card__top"><span>${escapeHtml(item.label)}</span><b>${escapeHtml(item.value)}</b></div>
						<strong>${escapeHtml(item.title)}</strong>
						<p>${escapeHtml(item.description)}</p>
						<small>${escapeHtml(item.action)} ${ICONS.arrow}</small>
					</a>
				`
			)
			.join("");
		const technicians = management.technician_load?.length
			? management.technician_load
					.map(
						(item) => `
							<a class="tp-load-row" href="/desk/repair-order?technician=${encodeURIComponent(item.user)}">
								<span><strong>${escapeHtml(item.label)}</strong><small>${item.late ? `${item.late} atrasada(s)` : "Tudo no prazo"}</small></span>
								<b>${item.count}</b>
							</a>
						`
					)
					.join("")
			: `<div class="tp-empty">Nenhuma OS atribuída à bancada.</div>`;
		return `
			<section class="tp-dashboard-section tp-management-insights">
				<div class="tp-section-heading tp-section-heading--inline">
					<div><span>Gestão · leitura rápida</span><h2>O que fazer agora</h2></div>
					<small class="tp-health-note">Etapa mais antiga: ${management.health.oldest_stage_hours}h</small>
				</div>
				<div class="tp-insight-grid">${insights}</div>
				<div class="tp-load-panel">
					<header><span>${ICONS.service}</span><div><strong>Carga da bancada</strong><small>OS abertas por técnico</small></div></header>
					<div class="tp-load-list">${technicians}</div>
				</div>
			</section>
		`;
	}

	function technicianCard(card) {
		const badges = [
			card.service_type,
			card.priority === "Urgente" ? "Urgente" : null,
			card.photos_complete ? null : "Fotos incompletas",
		].filter(Boolean);
		return `
			<article
				class="tp-kanban-card${card.is_late ? " is-late" : ""}${card.sla_status === "Vence em breve" ? " is-soon" : ""}"
				draggable="${card.workflow_state === "Aguardando aprovacao" ? "false" : "true"}"
				data-tp-order="${escapeHtml(card.name)}"
				data-tp-state="${escapeHtml(card.workflow_state)}"
			>
				<a href="/desk/repair-order/${encodeURIComponent(card.name)}" class="tp-kanban-card__main">
					<div class="tp-kanban-card__top">
						<strong>${escapeHtml(card.device_label)}</strong>
						<span>${escapeHtml(card.name)}</span>
					</div>
					<p>${escapeHtml(card.reported_issue)}</p>
					<div class="tp-kanban-card__badges">
						${badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join("")}
						${card.technician ? `<span style="background: rgba(52, 120, 199, 0.15); color: #3478c7; border: 1px solid rgba(52, 120, 199, 0.2);">${escapeHtml(card.technician.split('@')[0])}</span>` : ""}
					</div>
					${card.waiting_part_details ? `<div class="tp-kanban-card__block">${ICONS.alert}<span>${escapeHtml(card.waiting_part_details)}</span></div>` : ""}
					<footer>
						<span class="${card.is_late ? "is-late" : ""}">${ICONS.clock} ${formatDeadline(card.promised_at)}</span>
						<span>${card.stage_hours}h nesta etapa</span>
					</footer>
				</a>
			</article>
		`;
	}

	function technicianDashboardMarkup(summary) {
		const board = summary.technician_board || { columns: [], total: 0 };
		const firstName =
			frappe.boot?.user?.first_name ||
			frappe.session?.user?.split("@")[0] ||
			"técnico";
		return `
			<section class="tp-command-center tp-role-home tp-role-home--technician" aria-label="Minha bancada">
				<header class="tp-command-header">
					<div>
						<span class="tp-command-header__eyebrow">Minha bancada</span>
						<h1>Olá, ${escapeHtml(firstName)}.</h1>
						<p>${board.total} ordens atribuídas. Arraste somente quando a etapa estiver realmente concluída.</p>
					</div>
					<button class="tp-icon-button" type="button" data-tp-refresh aria-label="Atualizar bancada">${ICONS.refresh}</button>
				</header>
				<div class="tp-kanban-help">
					${ICONS.alert}
					<span>Orçamentos aguardando cliente ficam visíveis, mas não podem ser avançados pelo técnico.</span>
				</div>
				<div class="tp-kanban-board">
					${board.columns.map((column) => `
						<section class="tp-kanban-column tp-kanban-column--${column.tone}" data-tp-kanban-target="${escapeHtml(column.key)}">
							<header><span>${escapeHtml(column.label)}</span><b>${column.cards.length}</b></header>
							<div class="tp-kanban-column__cards">
								${column.cards.length ? column.cards.map(technicianCard).join("") : `<div class="tp-kanban-empty">Nenhuma OS</div>`}
							</div>
						</section>
					`).join("")}
				</div>
			</section>
		`;
	}

	function managerDashboardMarkup(summary) {
		const firstName =
			frappe.boot?.user?.first_name ||
			frappe.session?.user?.split("@")[0] ||
			"gestão";
		
		let kanbanHtml = "";
		if (summary.technician_board) {
			const board = summary.technician_board;
			const techs = summary.technicians_list || [];
			kanbanHtml = `
				<section class="tp-dashboard-section" style="margin-top: 24px;">
					<div class="tp-section-heading" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid var(--tp-border); padding-bottom: 10px;">
						<div>
							<span>Operação</span>
							<h2>Quadro Kanban de Reparos</h2>
						</div>
						<div style="display: flex; align-items: center; gap: 8px;">
							<label for="tp-tech-filter" style="font-size: 11px; font-weight: bold; margin-bottom: 0;">Filtrar Técnico:</label>
							<select id="tp-tech-filter" class="form-control input-sm" style="width: 200px; display: inline-block; height: 30px; padding: 4px 8px;">
								<option value="">[Todos os Técnicos]</option>
								${techs.map((t) => `<option value="${escapeHtml(t)}" ${currentSelectedTechnician === t ? "selected" : ""}>${escapeHtml(t)}</option>`).join("")}
							</select>
						</div>
					</div>
					<div class="tp-kanban-board">
						${board.columns.map((column) => `
							<section class="tp-kanban-column tp-kanban-column--${column.tone}" data-tp-kanban-target="${escapeHtml(column.key)}">
								<header><span>${escapeHtml(column.label)}</span><b>${column.cards.length}</b></header>
								<div class="tp-kanban-column__cards">
									${column.cards.length ? column.cards.map(technicianCard).join("") : `<div class="tp-kanban-empty">Nenhuma OS</div>`}
								</div>
							</section>
						`).join("")}
					</div>
				</section>
			`;
		}

		return `
			<section class="tp-command-center tp-role-home tp-role-home--manager" aria-label="Visão geral de gestão">
				<header class="tp-command-header" style="align-items: center;">
					<div>
						<h1 style="font-size: 24px; font-weight: 700; color: var(--tp-text);">Olá, ${escapeHtml(firstName)}.</h1>
						<p style="margin-top: 4px; font-size: 13px; color: var(--tp-text-muted);">Aqui está o status em tempo real e as pendências da operação da loja.</p>
					</div>
					<div style="display: flex; align-items: center; gap: 16px;">
						<div style="display: flex; flex-direction: column; align-items: flex-end;">
							<span style="font-size: 10px; color: var(--tp-text-muted); font-weight: bold; text-transform: uppercase;">Loja</span>
							<select class="form-control" style="background: var(--tp-surface-raised); border: 1px solid var(--tp-border); color: var(--tp-text); font-size: 12px; height: 30px; padding: 2px 8px; border-radius: 6px;">
								<option>TecPonto Matriz</option>
							</select>
						</div>
						<div style="display: flex; flex-direction: column; align-items: flex-end;">
							<span style="font-size: 10px; color: var(--tp-text-muted); font-weight: bold; text-transform: uppercase;">Conexão WhatsApp</span>
							<span class="tp-badge-sem tp-badge-sem--success" style="font-size: 11px; padding: 2px 8px; border-radius: 4px;">
								<span style="width: 6px; height: 6px; border-radius: 50%; background-color: var(--tp-green); display: inline-block; margin-right: 4px;"></span>
								Conectado
							</span>
						</div>
						<button class="tp-icon-button" type="button" data-tp-refresh aria-label="Atualizar painel">${ICONS.refresh}</button>
						<button class="tp-icon-button" type="button" onclick="frappe.app.logout()" aria-label="Sair" title="Sair"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>
					</div>
				</header>

				<h2 style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: var(--tp-text); display: flex; align-items: center; gap: 6px;">
					Ações rápidas da gestão
					<span style="cursor: pointer; color: var(--tp-text-muted); display: inline-flex;" title="Atalhos rápidos">${ICONS.alert}</span>
				</h2>
				<div class="tp-actions-now-grid">
					<a href="/desk/tecponto-sales" class="tp-action-now-card tp-action-now-card--active" style="text-decoration: none; color: inherit;">
						<div class="tp-action-now-card__icon">${ICONS.finance}</div>
						<div>
							<div class="tp-action-now-card__title">Lançar venda</div>
							<div class="tp-action-now-card__sub">Aparelhos e acessórios</div>
						</div>
					</a>
					<div class="tp-action-now-card" data-tp-guided-repair>
						<div class="tp-action-now-card__icon">${ICONS.plus}</div>
						<div>
							<div class="tp-action-now-card__title">Nova ordem de serviço</div>
							<div class="tp-action-now-card__sub">Abrir uma nova OS</div>
						</div>
					</div>
					<a href="/desk/repair-order" class="tp-action-now-card" style="text-decoration: none; color: inherit;">
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.search}</div>
						<div>
							<div class="tp-action-now-card__title">Buscar atendimento</div>
							<div class="tp-action-now-card__sub">Localizar OS, cliente ou aparelho</div>
						</div>
					</a>
					<div class="tp-action-now-card" data-tp-guided-customer>
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.customers}</div>
						<div>
							<div class="tp-action-now-card__title">Cadastrar cliente</div>
							<div class="tp-action-now-card__sub">Novo cliente no sistema</div>
						</div>
					</div>
					<div class="tp-action-now-card" data-tp-guided-device>
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.phone}</div>
						<div>
							<div class="tp-action-now-card__title">Cadastrar aparelho</div>
							<div class="tp-action-now-card__sub">Adicionar aparelho do cliente</div>
						</div>
					</div>
					<div class="tp-action-now-card" data-tp-guided-trade>
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.trade}</div>
						<div>
							<div class="tp-action-now-card__title">Avaliar troca</div>
							<div class="tp-action-now-card__sub">Triagem, oferta e revisão</div>
						</div>
					</div>
					<div class="tp-action-now-card" id="tp-btn-send-sig-link">
						<div class="tp-action-now-card__icon" style="color: var(--tp-orange);">${ICONS.whatsapp}</div>
						<div>
							<div class="tp-action-now-card__title">Enviar link de assinatura</div>
							<div class="tp-action-now-card__sub">Gerar e enviar para o cliente</div>
						</div>
					</div>
				</div>

				<div class="tp-section-heading" style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid var(--tp-border); padding-bottom: 8px;">
					<h2 style="font-size: 14px; font-weight: 700; margin: 0; color: var(--tp-text);">Resumo da operação da loja <span style="font-size: 11px; font-weight: normal; color: var(--tp-text-muted); margin-left: 8px;">KPIs operacionais</span></h2>
				</div>
				<div class="tp-metric-grid">
					<a href="/desk/tecponto-sales" class="tp-metric-card" style="text-decoration: none;">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(40, 199, 111, 0.1); color: var(--tp-green); align-items: center; justify-content: center;">${ICONS.finance}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.today_sales_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted); margin-top: 8px;">Vendas do dia</div>
						<div style="font-size: 9px; color: var(--tp-text-muted); margin-top: 4px;">Ver catálogo -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Aguardando%20aprovacao" class="tp-metric-card" style="text-decoration: none;">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 159, 67, 0.1); color: var(--tp-yellow); align-items: center; justify-content: center;">${ICONS.clock}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.awaiting_approval_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted); margin-top: 8px;">OS aguardando aprovação</div>
						<div style="font-size: 9px; color: var(--tp-text-muted); margin-top: 4px;">Ver detalhes -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Pronto%20para%20retirada" class="tp-metric-card" style="text-decoration: none;">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(40, 199, 111, 0.1); color: var(--tp-green); align-items: center; justify-content: center;">${ICONS.check}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.ready_for_pickup_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted); margin-top: 8px;">OS prontas para retirada</div>
						<div style="font-size: 9px; color: var(--tp-text-muted); margin-top: 4px;">Ver detalhes -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Recebido" class="tp-metric-card" style="text-decoration: none;">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(130, 134, 255, 0.1); color: var(--tp-purple); align-items: center; justify-content: center;">${ICONS.overview}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.awaiting_signature_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted); margin-top: 8px;">Assinaturas pendentes</div>
						<div style="font-size: 9px; color: var(--tp-text-muted); margin-top: 4px;">Ver detalhes -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Aguardando%20peca" class="tp-metric-card" style="text-decoration: none;">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 159, 67, 0.1); color: var(--tp-yellow); align-items: center; justify-content: center;">${ICONS.stock}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.awaiting_parts_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted); margin-top: 8px;">Aguardando peça</div>
						<div style="font-size: 9px; color: var(--tp-text-muted); margin-top: 4px;">Ver detalhes -></div>
					</a>
					<a href="/desk/repair-order?workflow_state=Recebido" class="tp-metric-card" style="text-decoration: none;">
						<div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
							<span style="display: flex; width: 28px; height: 28px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); color: var(--tp-blue); align-items: center; justify-content: center;">${ICONS.customers}</span>
							<b style="font-size: 18px; color: var(--tp-text);">${summary.waiting_customers_count || 0}</b>
						</div>
						<div style="font-size: 11px; font-weight: 600; color: var(--tp-text-muted); margin-top: 8px;">Clientes aguardando</div>
						<div style="font-size: 9px; color: var(--tp-text-muted); margin-top: 4px;">Ver detalhes -></div>
					</a>
				</div>

				${managementSection(summary.management)}

				${kanbanHtml}

				<div class="tp-bottom-layout-columns" style="margin-top: 24px;">
					<div class="tp-bottom-layout-main">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
							<div>
								<h2 style="font-size: 14px; font-weight: 700; margin: 0; color: var(--tp-text);">Atendimentos e vendas que precisam de você</h2>
								<div style="font-size: 11px; color: var(--tp-text-muted);">Priorize e avance os atendimentos do dia.</div>
							</div>
							<a href="/desk/repair-order" style="font-size: 12px; color: var(--tp-orange); font-weight: bold; text-decoration: none;">Ver todos os atendimentos -></a>
						</div>
						<div class="tp-op-table-card">
							<div class="tp-op-table-scroll">
								<table class="tp-op-table">
									<thead>
										<tr>
											<th class="col-id">ID</th>
											<th class="col-client">Cliente</th>
											<th class="col-description">Aparelho</th>
											<th class="col-status">Etapa atual</th>
											<th class="col-status">Urgência</th>
											<th class="col-date">Atualização</th>
											<th class="col-actions">Ações</th>
										</tr>
									</thead>
									<tbody>
										${summary.attendant_attention_items && summary.attendant_attention_items.length ? summary.attendant_attention_items.map(item => {
											let badgeClass = "tp-badge-sem--muted";
											let subLabel = "";
											let stateLabel = item.workflow_state;
											
											if (item.type === "repair") {
												if (item.workflow_state === "Recebido" && !item.customer_signature_hash) {
													badgeClass = "tp-badge-sem--purple";
													stateLabel = "Aguardando assinatura";
													subLabel = "Link enviado";
												} else if (item.workflow_state === "Aguardando aprovacao") {
													badgeClass = "tp-badge-sem--warning";
													subLabel = "Orçamento enviado";
												} else if (item.workflow_state === "Aguardando peca") {
													badgeClass = "tp-badge-sem--warning";
													subLabel = "Peça solicitada";
												} else if (item.workflow_state === "Pronto para retirada") {
													badgeClass = "tp-badge-sem--success";
													subLabel = "Aguardando cliente";
												} else if (item.workflow_state === "Recebido") {
													badgeClass = "tp-badge-sem--info";
													subLabel = "Recebido no balcão";
												} else if (item.workflow_state === "Em diagnostico") {
													badgeClass = "tp-badge-sem--info";
													subLabel = "Em diagnóstico";
												}
											} else {
												badgeClass = "tp-badge-sem--teal";
												stateLabel = "Triagem de troca";
												subLabel = "Avaliação em andamento";
											}
											
											let urgencyClass = "tp-badge-sem--muted";
											if (item.urgency === "Alta") urgencyClass = "tp-badge-sem--danger";
											else if (item.urgency === "Média") urgencyClass = "tp-badge-sem--warning";
											else if (item.urgency === "Baixa") urgencyClass = "tp-badge-sem--success";
											
											let actionBtnHtml = "";
											if (item.type === "repair") {
												actionBtnHtml = `
													<button class="btn btn-default btn-xs tp-btn-row-wa" data-phone="${item.whatsapp || ''}" data-name="${item.customer_name || ''}" data-os="${item.name}" style="padding: 2px 4px; color: var(--tp-green); border: none; background: transparent; font-size: 14px;" title="WhatsApp">${ICONS.whatsapp}</button>
													<a href="/desk/repair-order/${item.name}" class="btn btn-default btn-xs" style="padding: 2px 4px; color: var(--tp-orange); border: none; background: transparent; font-size: 14px;" title="Editar/Ver">${ICONS.arrow}</a>
												`;
											} else {
												actionBtnHtml = `
													<a href="/desk/trade-in-evaluation/${item.name}" class="btn btn-default btn-xs" style="padding: 2px 4px; color: var(--tp-orange); border: none; background: transparent; font-size: 14px;" title="Ver troca">${ICONS.arrow}</a>
												`;
											}
											
											return `
												<tr style="border-bottom: 1px solid var(--tp-border);">
													<td style="padding: 10px 8px; font-weight: 700; color: var(--tp-text);">${item.name}</td>
													<td style="padding: 10px 8px;">
														<div style="font-weight: 600; color: var(--tp-text);">${escapeHtml(item.customer_name)}</div>
														<div style="font-size: 10px; color: var(--tp-text-muted);">${escapeHtml(item.whatsapp || '')}</div>
													</td>
													<td style="padding: 10px 8px; font-weight: 500; color: var(--tp-text);">${escapeHtml(item.device_label)}</td>
													<td style="padding: 10px 8px;">
														<span class="tp-badge-sem ${badgeClass}">
															${escapeHtml(stateLabel)}
														</span>
														${subLabel ? `<div style="font-size: 10px; color: var(--tp-text-muted); margin-top: 2px;">${subLabel}</div>` : ''}
													</td>
													<td style="padding: 10px 8px;">
														<span class="tp-badge-sem ${urgencyClass}">
															${item.urgency || 'Baixa'}
														</span>
													</td>
													<td style="padding: 10px 8px; color: var(--tp-text-muted); font-size: 11px;">Recente</td>
													<td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
														${actionBtnHtml}
													</td>
												</tr>
											`;
										}).join("") : `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--tp-text-muted);">Nenhum atendimento pendente.</td></tr>`}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<aside class="tp-bottom-layout-sidebar">
						<div class="tp-sidebar-widget">
							<h2 style="font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--tp-text);">Atalhos da gestão</h2>
							<div class="tp-shortcut-list">
								<a href="/desk/tecponto-sales" class="tp-shortcut-item" style="text-decoration: none;">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-orange); display: flex;">${ICONS.finance}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px; color: var(--tp-text);">Lançar venda</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Aparelhos e acessórios</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</a>
								<div class="tp-shortcut-item" data-tp-guided-repair>
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-orange); display: flex;">${ICONS.service}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Abrir OS</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Iniciar atendimento</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</div>
								<div class="tp-shortcut-item" id="tp-shortcut-send-wa">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-green); display: flex;">${ICONS.whatsapp}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Enviar WhatsApp</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Falar com o cliente</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</div>
								<div class="tp-shortcut-item" id="tp-shortcut-sig-link">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-purple); display: flex;">${ICONS.overview}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Reenviar assinatura</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Enviar link novamente</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</div>
								<a href="/desk/repair-order" class="tp-shortcut-item">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-blue); display: flex;">${ICONS.refresh}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Atualizar status</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Avançar etapa da OS</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</a>
								<div class="tp-shortcut-item" id="tp-shortcut-ready">
									<div style="display: flex; align-items: center; gap: 10px;">
										<span style="color: var(--tp-green); display: flex;">${ICONS.check}</span>
										<div>
											<div style="font-weight: 700; font-size: 12px;">Registrar retirada</div>
											<div style="font-size: 10px; color: var(--tp-text-muted);">Confirmar retirada do cliente</div>
										</div>
									</div>
									<span>${ICONS.arrow}</span>
								</div>
							</div>
						</div>

						<div class="tp-sidebar-widget">
							<h2 style="font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--tp-text);">Alertas e pendências</h2>
							<div class="tp-alert-pills-list" style="margin-bottom: 20px;">
								<a href="/desk/repair-order?sla_status=Atrasado" class="tp-alert-pill" style="text-decoration: none; color: inherit;">
									<div class="tp-alert-pill__left">
										<span class="tp-alert-pill__dot tp-alert-pill__dot--danger"></span>
										<span style="font-weight: 600;">${summary.late_repairs_count || 0} OS atrasadas</span>
									</div>
									<span style="color: var(--tp-text-muted); font-size: 10px;">Precisam de atenção imediata -></span>
								</a>
								<a href="/desk/repair-order?workflow_state=Aguardando%20aprovacao" class="tp-alert-pill" style="text-decoration: none; color: inherit;">
									<div class="tp-alert-pill__left">
										<span class="tp-alert-pill__dot tp-alert-pill__dot--warning"></span>
										<span style="font-weight: 600;">${summary.awaiting_approval_count || 0} OS aguardando aprovação</span>
									</div>
									<span style="color: var(--tp-text-muted); font-size: 10px;">Sem retorno do cliente -></span>
								</a>
								<a href="/desk/repair-order" class="tp-alert-pill" style="text-decoration: none; color: inherit;">
									<div class="tp-alert-pill__left">
										<span class="tp-alert-pill__dot tp-alert-pill__dot--purple"></span>
										<span style="font-weight: 600;">${summary.awaiting_signature_count || 0} assinaturas pendentes</span>
									</div>
									<span style="color: var(--tp-text-muted); font-size: 10px;">Link expirando em breve -></span>
								</a>
								<a href="/desk/repair-order?workflow_state=Aguardando%20peca" class="tp-alert-pill" style="text-decoration: none; color: inherit;">
									<div class="tp-alert-pill__left">
										<span class="tp-alert-pill__dot tp-alert-pill__dot--warning" style="background-color: var(--tp-yellow);"></span>
										<span style="font-weight: 600;">${summary.awaiting_parts_count || 0} aguardando peça</span>
									</div>
									<span style="color: var(--tp-text-muted); font-size: 10px;">Peças não recebidas -></span>
								</a>
							</div>
						</div>

						<div class="tp-sidebar-widget" style="background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
							<div style="display: flex; align-items: center; gap: 10px;">
								<span style="display: flex; width: 36px; height: 36px; border-radius: 50%; background: rgba(40, 199, 111, 0.1); color: var(--tp-green); align-items: center; justify-content: center; font-size: 20px;">${ICONS.whatsapp}</span>
								<div>
									<div style="font-weight: 700; font-size: 13px; color: var(--tp-text);">WhatsApp integrado</div>
									<div style="font-size: 11px; color: var(--tp-text-muted);">Comunicação e histórico dentro da OS.</div>
								</div>
							</div>
							<a href="/desk/tecponto-contact-preference" class="btn btn-default btn-block btn-sm" style="background: var(--tp-surface-raised); border: 1px solid var(--tp-border); font-size: 11px; font-weight: bold; text-align: center; color: var(--tp-text); padding: 8px 12px; border-radius: 6px; text-decoration: none;">Abrir conversas ></a>
						</div>
					</aside>
				</div>

				<div class="tp-bottom-banner" id="tp-sig-banner" style="margin-top: 24px;">
					<div class="tp-bottom-banner__left">
						<span class="tp-bottom-banner__icon">${ICONS.overview}</span>
						<div>
							<strong style="color: var(--tp-text);">Assinatura digital integrada</strong>
							<span style="color: var(--tp-text-muted); margin-left: 8px;">Links de assinatura são gerados e armazenados no sistema. Mais segurança e agilidade.</span>
						</div>
					</div>
					<div style="display: flex; align-items: center; gap: 12px;">
						<a href="/desk/tecponto-operations-settings" class="btn btn-default btn-sm" style="background: var(--tp-surface-raised); border: 1px solid var(--tp-border); color: var(--tp-text); text-decoration: none; font-weight: bold; font-size: 11px; padding: 6px 12px; border-radius: 6px;">Saiba mais</a>
						<button type="button" class="btn btn-default btn-sm" id="btn-close-sig-banner" style="border: none; background: transparent; color: var(--tp-text-muted); font-size: 14px; font-weight: bold; padding: 0 4px; cursor: pointer;">X</button>
					</div>
				</div>
			</section>
		`;
	}

	function dashboardMarkup(summary) {
		if (summary.role_profile === "technician") return technicianDashboardMarkup(summary);
		if (summary.role_profile === "manager" || summary.role_profile === "direction") {
			return managerDashboardMarkup(summary);
		}
		return attendantDashboardMarkup(summary);
	}

	function openCustomerWizard() {
		const steps = [
			{ title: "Identificação", description: "Somente os dados necessários para reconhecer o cliente." },
			{ title: "Contato", description: "Defina como a TecPonto pode atualizar este atendimento." },
			{ title: "Conferência", description: "Revise antes de criar o cadastro." },
		];
		let currentStep = 1;
		const dialog = new frappe.ui.Dialog({
			title: "Cadastrar cliente",
			size: "large",
			fields: [
				{ fieldname: "step_header", fieldtype: "HTML" },
				{ fieldname: "customer_name", fieldtype: "Data", label: "Nome do cliente", reqd: 1, tp_step: 1 },
				{ fieldname: "whatsapp_number", fieldtype: "Data", label: "WhatsApp com DDD", reqd: 1, tp_step: 1 },
				{
					fieldname: "operational_consent",
					fieldtype: "Select",
					options: "1\n0",
					default: "1",
					label: "Atualizações do atendimento",
					tp_step: 2,
				},
				{
					fieldname: "privacy_note",
					fieldtype: "HTML",
					options: `<div class="tp-photo-instruction">${ICONS.shield}<div><strong>Cadastro mínimo e seguro</strong><span>Não peça documentos, endereço ou informações financeiras quando eles não forem necessários.</span></div></div>`,
					tp_step: 2,
				},
				{ fieldname: "review", fieldtype: "HTML", tp_step: 3 },
			],
		});

		const values = () => ({
			customer_name: dialog.fields_dict.customer_name.get_value(),
			whatsapp_number: dialog.fields_dict.whatsapp_number.get_value(),
			operational_consent: dialog.fields_dict.operational_consent.get_value(),
		});
		const renderReview = () => {
			const data = values();
			dialog.fields_dict.review.$wrapper.html(`
				<div class="tp-intake-review">
					<div class="tp-intake-review__row">
						<div><span>Cliente</span><strong>${escapeHtml(data.customer_name)}</strong><small>Novo cadastro</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="1" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>WhatsApp</span><strong>${escapeHtml(data.whatsapp_number)}</strong><small>${data.operational_consent === "1" ? "Atualizações autorizadas" : "Sem mensagens automáticas"}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="2" type="button">Alterar</button>
					</div>
				</div>
			`);

			dialog.fields_dict.review.$wrapper.off("click", ".tp-btn-edit-step").on("click", ".tp-btn-edit-step", function () {
				const stepTarget = parseInt($(this).data("tp-step-target"), 10);
				if (stepTarget) showStep(stepTarget);
			});
		};
		const validateStep = () => {
			const data = values();
			if (currentStep !== 1) return true;
			return (
				requireDialogValue(data, "customer_name", "Informe o nome do cliente.") &&
				requireDialogValue(data, "whatsapp_number", "Informe o WhatsApp com DDD.")
			);
		};
		const showStep = (step) => {
			currentStep = Math.max(1, Math.min(steps.length, step));
			const meta = steps[currentStep - 1];
			dialog.fields_dict.step_header.$wrapper.html(`
				<div class="tp-wizard-progress">
					<div class="tp-wizard-progress__copy"><span>Etapa ${currentStep} de ${steps.length}</span><strong>${meta.title}</strong><small>${meta.description}</small></div>
					<div class="tp-wizard-progress__bar"><i style="width:${(currentStep / steps.length) * 100}%"></i></div>
				</div>
			`);
			Object.values(dialog.fields_dict).forEach((field) => {
				if (field.df.tp_step) field.$wrapper.toggle(Number(field.df.tp_step) === currentStep);
			});
			if (currentStep === 3) renderReview();
			dialog.set_primary_action(currentStep === 3 ? "Cadastrar cliente" : "Continuar", () => {
				if (!validateStep()) return;
				if (currentStep < 3) return showStep(currentStep + 1);
				frappe.call({
					method: "tecponto.intake.create_customer_intake",
					args: { payload: JSON.stringify(values()) },
					freeze: true,
					freeze_message: "Cadastrando cliente...",
				}).then((response) => {
					dialog.hide();
					frappe.show_alert({ message: `${response.message.customer_name} cadastrado.`, indicator: "green" });
					frappe.set_route("Form", "Customer", response.message.name);
				});
			});
			backButton.toggle(currentStep > 1);
		};

		dialog.show();
		dialog.$wrapper.addClass("tp-intake-dialog tp-customer-dialog");
		const backButton = $(`<button type="button" class="btn btn-default tp-wizard-back">Voltar</button>`);
		backButton.on("click", () => showStep(currentStep - 1));
		dialog.$wrapper.find(".modal-footer .standard-actions").prepend(backButton);
		mountChoiceCards(dialog, "operational_consent", operationalConsentChoices(), { columns: 2 });
		showStep(1);
	}

	function openTradeIntakeWizard() {
		const steps = [
			{ title: "Cliente", description: "Localize a pessoa antes de começar a avaliação." },
			{ title: "Aparelho", description: "Escolha o que já existe ou faça um cadastro curto." },
			{ title: "Objetivo da troca", description: "Use escolhas rápidas para entender o que o cliente procura." },
			{ title: "Fotos e titularidade", description: "Registre frente, traseira e autorização." },
			{ title: "Conferência", description: "Revise e encaminhe para avaliação técnica." },
		];
		let currentStep = 1;
		const dialog = new frappe.ui.Dialog({
			title: "Nova avaliação de troca",
			size: "large",
			fields: [
				{ fieldname: "step_header", fieldtype: "HTML" },
				{ fieldname: "customer_mode", fieldtype: "Select", label: "Como localizar o cliente?", options: "Buscar cliente\nNovo cliente", default: "Buscar cliente", tp_step: 1 },
				{ fieldname: "customer", fieldtype: "Link", options: "Customer", label: "Buscar cliente", tp_step: 1 },
				{ fieldname: "customer_name", fieldtype: "Data", label: "Nome do novo cliente", tp_step: 1 },
				{ fieldname: "whatsapp_number", fieldtype: "Data", label: "WhatsApp com DDD", tp_step: 1 },
				{ fieldname: "operational_consent", fieldtype: "Select", label: "Atualizações do atendimento", options: "1\n0", default: "1", tp_step: 1 },
				{ fieldname: "device_mode", fieldtype: "Select", label: "Qual aparelho será avaliado?", options: "Aparelho cadastrado\nCadastrar aparelho", default: "Aparelho cadastrado", tp_step: 2 },
				{ fieldname: "device", fieldtype: "Link", options: "Service Device", label: "Aparelho cadastrado", tp_step: 2 },
				{ fieldname: "device_type", fieldtype: "Select", options: "Celular\nNotebook\nTablet\nOutro", label: "Tipo", default: "Celular", tp_step: 2 },
				{ fieldname: "brand", fieldtype: "Select", options: "Apple\nSamsung\nMotorola\nXiaomi\nLG\nAsus\nOutro", label: "Marca", default: "Apple", tp_step: 2 },
				{ fieldname: "model", fieldtype: "Data", label: "Modelo", tp_step: 2 },
				{ fieldname: "imei_serial", fieldtype: "Data", label: "IMEI ou número de série", tp_step: 2 },
				{ fieldname: "color", fieldtype: "Select", options: "Preto\nBranco\nAzul\nPrata\nDourado\nRosa\nVerde\nOutro", label: "Cor", default: "Preto", tp_step: 2 },
				{ fieldname: "storage_capacity", fieldtype: "Select", options: "32 GB\n64 GB\n128 GB\n256 GB\n512 GB\n1 TB\nNão sei", label: "Armazenamento", default: "128 GB", tp_step: 2 },
				{ fieldname: "current_condition", fieldtype: "Select", label: "Como o aparelho está?", options: "Muito conservado\nMarcas de uso\nTela trincada\nBateria ruim\nCom defeito\nNao sei avaliar", default: "Marcas de uso", tp_step: 3 },
				{ fieldname: "desired_type", fieldtype: "Select", label: "O que o cliente procura?", options: "iPhone\nSamsung\nXiaomi\nMotorola\nMelhor custo-beneficio\nAinda nao sei", default: "Ainda nao sei", tp_step: 3 },
				{ fieldname: "cash_budget", fieldtype: "Select", label: "Quanto pode completar?", options: "Ate R$ 500\nR$ 500 a R$ 1.000\nR$ 1.000 a R$ 2.000\nDepende da avaliacao\nNao quero voltar", default: "Depende da avaliacao", tp_step: 3 },
				{ fieldname: "source_channel", fieldtype: "Select", label: "Como chegou até a TecPonto?", options: "Balcao\nWebsite\nWhatsApp\nOutro", default: "Balcao", tp_step: 3 },
				{ fieldname: "condition_details", fieldtype: "Small Text", label: "Detalhe adicional (opcional)", tp_step: 3 },
				{ fieldname: "device_front_photo", fieldtype: "Attach Image", label: "Frente do aparelho", tp_step: 4 },
				{ fieldname: "device_back_photo", fieldtype: "Attach Image", label: "Traseira do aparelho", tp_step: 4 },
				{ fieldname: "ownership_confirmed", fieldtype: "Check", label: "Cliente confirmou ser titular ou estar autorizado", tp_step: 4 },
				{ fieldname: "privacy_note", fieldtype: "HTML", options: `<div class="tp-photo-instruction">${ICONS.shield}<div><strong>Antes de adquirir um usado</strong><span>A consulta de IMEI, remoção de conta e declaração do vendedor serão exigidas na avaliação técnica.</span></div></div>`, tp_step: 4 },
				{ fieldname: "review", fieldtype: "HTML", tp_step: 5 },
			],
		});

		dialog.fields_dict.device.get_query = () => {
			const customer = dialog.fields_dict.customer.get_value();
			return { filters: customer ? { customer, active: 1 } : { active: 1 } };
		};
		const values = () => {
			const data = {};
			Object.entries(dialog.fields_dict).forEach(([fieldname, field]) => {
				if (!["step_header", "privacy_note", "review"].includes(fieldname)) data[fieldname] = field.get_value();
			});
			return data;
		};
		const syncModes = () => {
			const existingCustomer = customerModeFields(dialog, currentStep);
			const existingDevice = dialog.fields_dict.device_mode.get_value() !== "Cadastrar aparelho";
			dialog.fields_dict.operational_consent.$wrapper.toggle(currentStep === 1 && !existingCustomer);
			dialog.fields_dict.device.$wrapper.toggle(currentStep === 2 && existingDevice);
			["device_type", "brand", "model", "imei_serial", "color", "storage_capacity"].forEach((fieldname) => {
				dialog.fields_dict[fieldname].$wrapper.toggle(currentStep === 2 && !existingDevice);
			});
		};
		const validateStep = () => {
			const data = values();
			if (currentStep === 1) {
				if (data.customer_mode === "Buscar cliente") return requireDialogValue(data, "customer", "Selecione o cliente.");
				return requireDialogValue(data, "customer_name", "Informe o nome do cliente.") && requireDialogValue(data, "whatsapp_number", "Informe o WhatsApp com DDD.");
			}
			if (currentStep === 2) {
				if (data.device_mode === "Aparelho cadastrado") return requireDialogValue(data, "device", "Selecione o aparelho.");
				return requireDialogValue(data, "model", "Informe o modelo do aparelho.");
			}
			if (currentStep === 4) {
				return (
					requireDialogValue(data, "device_front_photo", "Adicione a foto da frente.") &&
					requireDialogValue(data, "device_back_photo", "Adicione a foto da traseira.") &&
					(data.ownership_confirmed ||
						(frappe.msgprint({ title: "Confirmação necessária", message: "Confirme a titularidade para continuar.", indicator: "orange" }), false))
				);
			}
			return true;
		};
		const renderReview = () => {
			const data = values();
			dialog.fields_dict.review.$wrapper.html(`
				<div class="tp-intake-review">
					<div class="tp-intake-review__row">
						<div><span>Cliente</span><strong>${escapeHtml(data.customer || data.customer_name)}</strong><small>${escapeHtml(data.whatsapp_number || "Cadastro existente")}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="1" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>Aparelho</span><strong>${escapeHtml(data.device || `${data.brand} ${data.model}`)}</strong><small>${escapeHtml(data.current_condition)}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="2" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>Procura</span><strong>${escapeHtml(displayState(data.desired_type))}</strong><small>${escapeHtml(displayState(data.cash_budget))}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="3" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>Fotos e Titularidade</span><strong>Frente e Traseira anexadas</strong><small>Titularidade confirmada</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="4" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__photos-row">
						<div class="tp-intake-review__photo"><span>Frente</span><img src="${escapeHtml(data.device_front_photo)}" alt="Frente do aparelho"></div>
						<div class="tp-intake-review__photo"><span>Traseira</span><img src="${escapeHtml(data.device_back_photo)}" alt="Traseira do aparelho"></div>
					</div>
				</div>
			`);

			dialog.fields_dict.review.$wrapper.off("click", ".tp-btn-edit-step").on("click", ".tp-btn-edit-step", function () {
				const stepTarget = parseInt($(this).data("tp-step-target"), 10);
				if (stepTarget) showStep(stepTarget);
			});
		};
		const showStep = (step) => {
			currentStep = Math.max(1, Math.min(steps.length, step));
			const meta = steps[currentStep - 1];
			dialog.fields_dict.step_header.$wrapper.html(`
				<div class="tp-wizard-progress">
					<div class="tp-wizard-progress__copy"><span>Etapa ${currentStep} de ${steps.length}</span><strong>${meta.title}</strong><small>${meta.description}</small></div>
					<div class="tp-wizard-progress__bar"><i style="width:${(currentStep / steps.length) * 100}%"></i></div>
				</div>
			`);
			Object.values(dialog.fields_dict).forEach((field) => {
				if (field.df.tp_step) field.$wrapper.toggle(Number(field.df.tp_step) === currentStep);
			});
			syncModes();
			if (currentStep === 5) renderReview();
			dialog.set_primary_action(currentStep === 5 ? "Criar avaliação de troca" : "Continuar", () => {
				if (!validateStep()) return;
				if (currentStep < 5) return showStep(currentStep + 1);
				frappe.call({
					method: "tecponto.intake.create_trade_intake",
					args: { payload: JSON.stringify(values()) },
					freeze: true,
					freeze_message: "Criando avaliação de troca...",
				}).then((response) => {
					dialog.hide();
					frappe.show_alert({ message: `Avaliação ${response.message.name} criada.`, indicator: "green" });
					frappe.set_route("Form", "Trade In Evaluation", response.message.name);
				});
			});
			backButton.toggle(currentStep > 1);
		};

		dialog.show();
		dialog.$wrapper.addClass("tp-intake-dialog tp-trade-dialog");
		const backButton = $(`<button type="button" class="btn btn-default tp-wizard-back">Voltar</button>`);
		backButton.on("click", () => showStep(currentStep - 1));
		dialog.$wrapper.find(".modal-footer .standard-actions").prepend(backButton);
		mountCommonChoices(dialog, {
			customer_mode: {
				columns: 2,
				choices: [
					{ value: "Buscar cliente", label: "Cliente existente", description: "Pesquisar antes evita cadastros duplicados.", icon: ICONS.search },
					{ value: "Novo cliente", label: "Novo cliente", description: "Nome e WhatsApp são suficientes.", icon: ICONS.plus },
				],
			},
			operational_consent: { columns: 2, choices: operationalConsentChoices() },
			device_mode: {
				columns: 2,
				choices: [
					{ value: "Aparelho cadastrado", label: "Já está no sistema", description: "Selecione pelo cliente.", icon: ICONS.search },
					{ value: "Cadastrar aparelho", label: "Primeira vez", description: "Cadastre só o necessário.", icon: ICONS.phone },
				],
			},
			device_type: ["Celular", "Notebook", "Tablet", "Outro"],
			brand: ["Apple", "Samsung", "Motorola", "Xiaomi", "LG", "Asus", "Outro"],
			color: ["Preto", "Branco", "Azul", "Prata", "Dourado", "Rosa", "Verde", "Outro"],
			storage_capacity: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "Não sei"],
			current_condition: ["Muito conservado", "Marcas de uso", "Tela trincada", "Bateria ruim", "Com defeito", { value: "Nao sei avaliar", label: "Não sei avaliar", icon: ICONS.search }],
			desired_type: ["iPhone", "Samsung", "Xiaomi", "Motorola", { value: "Melhor custo-beneficio", label: "Melhor custo-benefício", icon: ICONS.trade }, { value: "Ainda nao sei", label: "Ainda não sei", icon: ICONS.search }],
			cash_budget: [{ value: "Ate R$ 500", label: "Até R$ 500", icon: ICONS.finance }, "R$ 500 a R$ 1.000", "R$ 1.000 a R$ 2.000", { value: "Depende da avaliacao", label: "Depende da avaliação", icon: ICONS.trade }, { value: "Nao quero voltar", label: "Não quer completar", icon: ICONS.check }],
			source_channel: [{ value: "Balcao", label: "Balcão", icon: ICONS.customers }, "Website", "WhatsApp", "Outro"],
		});
		["customer_mode", "device_mode"].forEach((fieldname) => dialog.fields_dict[fieldname].$input.on("change", syncModes));
		dialog.fields_dict.customer.$input.on("change", () => {
			dialog.fields_dict.device.set_value("");
			syncModes();
		});
		showStep(1);
	}

	function openDeviceWizard() {
		const steps = [
			{ title: "Cliente", description: "Encontre a pessoa antes de cadastrar o aparelho." },
			{ title: "Identificação", description: "Só o necessário para reconhecer o aparelho sem dúvida." },
			{ title: "Condição", description: "Registre o estado geral e confirme a titularidade." },
			{ title: "Conferência", description: "Uma última leitura antes de salvar." },
		];
		let currentStep = 1;
		const dialog = new frappe.ui.Dialog({
			title: "Cadastrar aparelho",
			size: "large",
			fields: [
				{ fieldname: "step_header", fieldtype: "HTML" },
				{ fieldname: "customer_mode", fieldtype: "Select", options: "Buscar cliente\nNovo cliente", default: "Buscar cliente", label: "Como localizar o cliente?", tp_step: 1 },
				{ fieldname: "customer", fieldtype: "Link", options: "Customer", label: "Buscar cliente", tp_step: 1 },
				{ fieldname: "customer_name", fieldtype: "Data", label: "Nome do novo cliente", tp_step: 1 },
				{ fieldname: "whatsapp_number", fieldtype: "Data", label: "WhatsApp com DDD", tp_step: 1 },
				{ fieldname: "operational_consent", fieldtype: "Select", options: "1\n0", label: "Atualizações do atendimento", default: "1", tp_step: 1 },
				{ fieldname: "device_type", fieldtype: "Select", options: "Celular\nNotebook\nTablet\nOutro", label: "Tipo", default: "Celular", tp_step: 2 },
				{ fieldname: "brand", fieldtype: "Select", options: "Apple\nSamsung\nMotorola\nXiaomi\nLG\nAsus\nOutro", label: "Marca", default: "Apple", tp_step: 2 },
				{ fieldname: "model", fieldtype: "Data", label: "Modelo", tp_step: 2 },
				{ fieldname: "imei_serial", fieldtype: "Data", label: "IMEI ou número de série", tp_step: 2 },
				{ fieldname: "color", fieldtype: "Select", options: "Preto\nBranco\nAzul\nPrata\nDourado\nRosa\nVerde\nOutro", label: "Cor", default: "Preto", tp_step: 3 },
				{ fieldname: "storage_capacity", fieldtype: "Select", options: "32 GB\n64 GB\n128 GB\n256 GB\n512 GB\n1 TB\nNão sei", label: "Armazenamento", default: "128 GB", tp_step: 3 },
				{ fieldname: "intake_condition", fieldtype: "Select", options: "Sem avarias visíveis\nMarcas leves de uso\nTela trincada\nCarcaça danificada\nNão foi possível avaliar", label: "Condição geral", default: "Sem avarias visíveis", tp_step: 3 },
				{ fieldname: "ownership_confirmed", fieldtype: "Check", label: "Cliente confirmou ser titular ou estar autorizado", tp_step: 3 },
				{ fieldname: "privacy_note", fieldtype: "HTML", options: `<div class="tp-photo-instruction">${ICONS.shield}<div><strong>Nunca registre senhas</strong><span>Não anote desbloqueio, Apple ID, Google, banco ou códigos de autenticação.</span></div></div>`, tp_step: 3 },
				{ fieldname: "review", fieldtype: "HTML", tp_step: 4 },
			],
		});

		function values() {
			const result = {};
			Object.entries(dialog.fields_dict).forEach(([fieldname, field]) => {
				if (["step_header", "privacy_note", "review"].includes(fieldname)) return;
				result[fieldname] = field.get_value();
			});
			return result;
		}

		function requireValue(data, fieldname, message) {
			if (!String(data[fieldname] || "").trim()) {
				frappe.msgprint({ title: "Falta uma informação", message, indicator: "orange" });
				return false;
			}
			return true;
		}

		function validateStep() {
			const data = values();
			if (currentStep === 1) {
				if (data.customer_mode === "Buscar cliente" && !requireValue(data, "customer", "Selecione o cliente.")) return false;
				if (data.customer_mode === "Novo cliente" && !requireValue(data, "customer_name", "Informe o nome do cliente.")) return false;
				if (data.customer_mode === "Novo cliente" && !requireValue(data, "whatsapp_number", "Informe o WhatsApp do novo cliente com DDD.")) return false;
			}
			if (currentStep === 2) {
				if (!requireValue(data, "brand", "Informe a marca do aparelho.")) return false;
				if (!requireValue(data, "model", "Informe o modelo do aparelho.")) return false;
			}
			if (currentStep === 3 && !data.ownership_confirmed) {
				frappe.msgprint({ title: "Confirmação necessária", message: "Confirme a titularidade ou autorização para continuar.", indicator: "orange" });
				return false;
			}
			return true;
		}

		function syncCustomerMode() {
			const existingCustomer = customerModeFields(dialog, currentStep);
			dialog.fields_dict.operational_consent.$wrapper.toggle(currentStep === 1 && !existingCustomer);
		}

		function renderReview() {
			const data = values();
			dialog.fields_dict.review.$wrapper.html(`
				<div class="tp-intake-review">
					<div class="tp-intake-review__row">
						<div><span>Cliente</span><strong>${escapeHtml(data.customer || data.customer_name)}</strong><small>${escapeHtml(data.whatsapp_number || "Cadastro existente")}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="1" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>Aparelho</span><strong>${escapeHtml(`${data.brand} ${data.model}`)}</strong><small>${escapeHtml(data.device_type)}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="2" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>Identificador e Condição</span><strong>${escapeHtml(data.imei_serial || "IMEI/Série não informado")}</strong><small>${escapeHtml([data.color, data.storage_capacity, data.intake_condition].filter(Boolean).join(" · ") || "Sem detalhes adicionais")}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="3" type="button">Alterar</button>
					</div>
				</div>
			`);

			dialog.fields_dict.review.$wrapper.off("click", ".tp-btn-edit-step").on("click", ".tp-btn-edit-step", function () {
				const stepTarget = parseInt($(this).data("tp-step-target"), 10);
				if (stepTarget) showStep(stepTarget);
			});
		}

		function showStep(step) {
			currentStep = Math.max(1, Math.min(steps.length, step));
			const meta = steps[currentStep - 1];
			dialog.fields_dict.step_header.$wrapper.html(`
				<div class="tp-wizard-progress">
					<div class="tp-wizard-progress__copy"><span>Etapa ${currentStep} de ${steps.length}</span><strong>${meta.title}</strong><small>${meta.description}</small></div>
					<div class="tp-wizard-progress__bar"><i style="width:${(currentStep / steps.length) * 100}%"></i></div>
				</div>
			`);
			Object.values(dialog.fields_dict).forEach((field) => {
				if (field.df.tp_step) field.$wrapper.toggle(Number(field.df.tp_step) === currentStep);
			});
			syncCustomerMode();
			if (currentStep === steps.length) renderReview();
			dialog.set_primary_action(currentStep === steps.length ? "Cadastrar aparelho" : "Continuar", handlePrimary);
			backButton.toggle(currentStep > 1);
		}

		function handlePrimary() {
			if (!validateStep()) return;
			if (currentStep < steps.length) return showStep(currentStep + 1);
			frappe.call({
				method: "tecponto.intake.create_device_intake",
				args: { payload: JSON.stringify(values()) },
				freeze: true,
				freeze_message: "Cadastrando aparelho...",
			}).then((response) => {
				const device = response.message;
				dialog.hide();
				frappe.show_alert({ message: `Aparelho ${device.name} cadastrado.`, indicator: "green" });
				frappe.set_route("Form", "Service Device", device.name);
			});
		}

		dialog.show();
		dialog.$wrapper.addClass("tp-intake-dialog tp-device-dialog");
		const backButton = $(`<button type="button" class="btn btn-default tp-wizard-back">Voltar</button>`);
		backButton.on("click", () => showStep(currentStep - 1));
		dialog.$wrapper.find(".modal-footer .standard-actions").prepend(backButton);
		mountCommonChoices(dialog, {
			customer_mode: {
				columns: 2,
				choices: [
					{ value: "Buscar cliente", label: "Cliente existente", description: "Pesquisar primeiro evita duplicidade.", icon: ICONS.search },
					{ value: "Novo cliente", label: "Novo cliente", description: "Cadastre nome e WhatsApp.", icon: ICONS.plus },
				],
			},
			operational_consent: { columns: 2, choices: operationalConsentChoices() },
			device_type: ["Celular", "Notebook", "Tablet", "Outro"],
			brand: ["Apple", "Samsung", "Motorola", "Xiaomi", "LG", "Asus", "Outro"],
			color: ["Preto", "Branco", "Azul", "Prata", "Dourado", "Rosa", "Verde", "Outro"],
			storage_capacity: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "Não sei"],
			intake_condition: ["Sem avarias visíveis", "Marcas leves de uso", "Tela trincada", "Carcaça danificada", "Não foi possível avaliar"],
		});
		dialog.fields_dict.customer_mode.$input.on("change", syncCustomerMode);
		showStep(1);
	}

	function openRepairIntakeWizard(defaults = {}) {
		const steps = [
			{ title: "Cliente", description: "Localize um cadastro ou informe um novo cliente." },
			{ title: "Aparelho", description: "Identifique o aparelho que está entrando." },
			{ title: "Serviço", description: "Registre o relato sem antecipar o diagnóstico." },
			{ title: "Fotos", description: "Frente e traseira são obrigatórias." },
			{ title: "Conferência", description: "Revise tudo antes de gerar a ordem." },
		];
		let currentStep = 1;
		const dialog = new frappe.ui.Dialog({
			title: "Registrar reparo",
			size: "large",
			fields: [
				{ fieldname: "step_header", fieldtype: "HTML" },
				{ fieldname: "customer_mode", fieldtype: "Select", options: "Buscar cliente\nNovo cliente", default: defaults.customer ? "Buscar cliente" : "Buscar cliente", label: "Como localizar o cliente?", tp_step: 1 },
				{ fieldname: "customer", fieldtype: "Link", options: "Customer", label: "Buscar cliente", default: defaults.customer, tp_step: 1 },
				{ fieldname: "customer_name", fieldtype: "Data", label: "Nome do novo cliente", tp_step: 1 },
				{ fieldname: "whatsapp_number", fieldtype: "Data", label: "WhatsApp com DDD", tp_step: 1 },
				{ fieldname: "operational_consent", fieldtype: "Select", options: "1\n0", label: "Atualizações do atendimento", default: "1", tp_step: 1 },
				{ fieldname: "device_mode", fieldtype: "Select", options: "Aparelho cadastrado\nCadastrar aparelho", default: defaults.device ? "Aparelho cadastrado" : "Aparelho cadastrado", label: "Qual aparelho está entrando?", tp_step: 2 },
				{ fieldname: "device", fieldtype: "Link", options: "Service Device", label: "Aparelho cadastrado", default: defaults.device, tp_step: 2 },
				{ fieldname: "device_type", fieldtype: "Select", options: "Celular\nNotebook\nTablet\nOutro", label: "Tipo", default: "Celular", tp_step: 2 },
				{ fieldname: "brand", fieldtype: "Select", options: "Apple\nSamsung\nMotorola\nXiaomi\nLG\nAsus\nOutro", label: "Marca", default: "Apple", tp_step: 2 },
				{ fieldname: "model", fieldtype: "Data", label: "Modelo", tp_step: 2 },
				{ fieldname: "imei_serial", fieldtype: "Data", label: "IMEI ou número de série", tp_step: 2 },
				{ fieldname: "color", fieldtype: "Select", options: "Preto\nBranco\nAzul\nPrata\nDourado\nRosa\nVerde\nOutro", label: "Cor", default: "Preto", tp_step: 2 },
				{ fieldname: "storage_capacity", fieldtype: "Select", options: "32 GB\n64 GB\n128 GB\n256 GB\n512 GB\n1 TB\nNão sei", label: "Armazenamento", default: "128 GB", tp_step: 2 },
				{ fieldname: "service_type", fieldtype: "Select", options: "Reparo\nGarantia\nRetrabalho", label: "Tipo de atendimento", default: defaults.service_type || "Reparo", tp_step: 3 },
				{ fieldname: "original_repair_order", fieldtype: "Link", options: "Repair Order", label: "OS original", default: defaults.original_repair_order, tp_step: 3 },
				{ fieldname: "reported_issue", fieldtype: "Select", options: "Tela quebrada\nNão liga\nBateria descarrega rápido\nNão carrega\nFalha de áudio\nFalha de câmera\nProblema de software\nOutro", label: "Qual é o problema principal?", default: "Tela quebrada", tp_step: 3 },
				{ fieldname: "issue_details", fieldtype: "Small Text", label: "Detalhe informado pelo cliente (opcional)", tp_step: 3 },
				{ fieldname: "intake_condition", fieldtype: "Select", options: "Sem avarias além do problema\nMarcas leves de uso\nTela trincada\nCarcaça danificada\nOxidação aparente\nNão foi possível avaliar", label: "Estado físico observado", default: "Sem avarias além do problema", tp_step: 3 },
				{ fieldname: "condition_details", fieldtype: "Small Text", label: "Detalhe visual adicional (opcional)", tp_step: 3 },
				{ fieldname: "accessories", fieldtype: "Select", options: "Nenhum\nCarregador\nCabo\nCapa\nChip ou cartão\nCarregador e cabo\nMais de um", label: "Acessórios entregues", default: "Nenhum", tp_step: 3 },
				{ fieldname: "accessories_details", fieldtype: "Data", label: "Quais acessórios? (opcional)", tp_step: 3 },
				{ fieldname: "priority", fieldtype: "Select", options: "Normal\nUrgente", label: "Prioridade", default: defaults.priority || "Normal", tp_step: 3 },
				{ fieldname: "channel", fieldtype: "Select", options: "Balcao\nWebsite\nWhatsApp\nShopee\nMercado Livre\nOutro", label: "Canal", default: defaults.channel || "Balcao", tp_step: 3 },
				{ fieldname: "promised_at", fieldtype: "Datetime", label: "Prazo prometido (opcional)", tp_step: 3 },
				{ fieldname: "photo_note", fieldtype: "HTML", options: `<div class="tp-photo-instruction">${ICONS.camera}<div><strong>Registre o estado real do aparelho</strong><span>Enquadre o aparelho inteiro, com boa luz, sem documentos pessoais ao redor.</span></div></div>`, tp_step: 4 },
				{ fieldname: "intake_front_photo", fieldtype: "Attach Image", label: "Frente do aparelho", tp_step: 4 },
				{ fieldname: "intake_back_photo", fieldtype: "Attach Image", label: "Traseira do aparelho", tp_step: 4 },
				{ fieldname: "review", fieldtype: "HTML", tp_step: 5 },
			],
		});
		dialog.fields_dict.device.get_query = () => {
			const customer = dialog.fields_dict.customer.get_value();
			return { filters: customer ? { customer, active: 1 } : { active: 1 } };
		};
		dialog.fields_dict.original_repair_order.get_query = () => ({
			filters: {
				workflow_state: "Entregue",
				customer: dialog.fields_dict.customer.get_value() || "",
			},
		});

		function values() {
			const result = {};
			Object.entries(dialog.fields_dict).forEach(([fieldname, field]) => {
				if (["step_header", "photo_note", "review"].includes(fieldname)) return;
				result[fieldname] = field.get_value();
			});
			if (result.issue_details) result.reported_issue = `${result.reported_issue} — ${result.issue_details}`;
			if (result.condition_details) result.intake_condition = `${result.intake_condition} — ${result.condition_details}`;
			if (result.accessories_details) result.accessories = `${result.accessories} — ${result.accessories_details}`;
			return result;
		}

		function requireValue(data, fieldname, message) {
			if (!String(data[fieldname] || "").trim()) {
				frappe.msgprint({ title: "Falta uma informação", message, indicator: "orange" });
				return false;
			}
			return true;
		}

		function validateStep() {
			const data = values();
			if (currentStep === 1) {
				if (data.customer_mode === "Buscar cliente" && !requireValue(data, "customer", "Selecione o cliente.")) return false;
				if (data.customer_mode === "Novo cliente" && !requireValue(data, "customer_name", "Informe o nome do cliente.")) return false;
				if (data.customer_mode === "Novo cliente" && !requireValue(data, "whatsapp_number", "Informe o WhatsApp com DDD.")) return false;
			}
			if (currentStep === 2 && data.device_mode === "Cadastrar aparelho") {
				if (!requireValue(data, "brand", "Informe a marca do aparelho.")) return false;
				if (!requireValue(data, "model", "Informe o modelo do aparelho.")) return false;
			}
			if (currentStep === 2 && data.device_mode === "Aparelho cadastrado" && !requireValue(data, "device", "Selecione o aparelho.")) return false;
			if (currentStep === 3) {
				if (!requireValue(data, "reported_issue", "Registre com as palavras do cliente o problema relatado.")) return false;
				if (!requireValue(data, "intake_condition", "Descreva o estado físico observado no balcão.")) return false;
				if (data.service_type !== "Reparo" && !requireValue(data, "original_repair_order", "Garantia ou retrabalho precisam estar ligados à OS original.")) return false;
			}
			if (currentStep === 4) {
				if (!requireValue(data, "intake_front_photo", "Adicione a foto da frente do aparelho.")) return false;
				if (!requireValue(data, "intake_back_photo", "Adicione a foto da traseira do aparelho.")) return false;
			}
			return true;
		}

		function syncChoiceFields() {
			const existingCustomer = customerModeFields(dialog, currentStep);
			const existingDevice = dialog.fields_dict.device_mode.get_value() !== "Cadastrar aparelho";
			dialog.fields_dict.operational_consent.$wrapper.toggle(currentStep === 1 && !existingCustomer);
			dialog.fields_dict.device.$wrapper.toggle(currentStep === 2 && existingDevice);
			["device_type", "brand", "model", "imei_serial", "color", "storage_capacity"].forEach((fieldname) => {
				dialog.fields_dict[fieldname].$wrapper.toggle(currentStep === 2 && !existingDevice);
			});
		}

		function renderReview() {
			const data = values();
			const customer = data.customer || data.customer_name;
			const device = data.device || `${data.brand || ""} ${data.model || ""}`.trim();
			dialog.fields_dict.review.$wrapper.html(`
				<div class="tp-intake-review">
					<div class="tp-intake-review__row">
						<div><span>Cliente</span><strong>${escapeHtml(customer)}</strong><small>${escapeHtml(data.whatsapp_number)}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="1" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>Aparelho</span><strong>${escapeHtml(device)}</strong><small>${escapeHtml(data.imei_serial || "IMEI/Série não informado")}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="2" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>Atendimento</span><strong>${escapeHtml(data.service_type)}</strong><small>${escapeHtml(data.priority)} · ${escapeHtml(data.channel)}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="3" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>Problema e Condição</span><strong>${escapeHtml(data.reported_issue)}</strong><small>${escapeHtml(data.intake_condition)}</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="3" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__row">
						<div><span>Fotos</span><strong>Frente e Traseira anexadas</strong><small>Validadas obrigatoriamente</small></div>
						<button class="btn btn-default btn-xs tp-btn-edit-step" data-tp-step-target="4" type="button">Alterar</button>
					</div>
					<div class="tp-intake-review__photos-row">
						<div class="tp-intake-review__photo"><span>Frente</span><img src="${escapeHtml(data.intake_front_photo)}" alt="Frente do aparelho"></div>
						<div class="tp-intake-review__photo"><span>Traseira</span><img src="${escapeHtml(data.intake_back_photo)}" alt="Traseira do aparelho"></div>
					</div>
				</div>
			`);

			dialog.fields_dict.review.$wrapper.off("click", ".tp-btn-edit-step").on("click", ".tp-btn-edit-step", function () {
				const stepTarget = parseInt($(this).data("tp-step-target"), 10);
				if (stepTarget) showStep(stepTarget);
			});
		}

		function showStep(step) {
			currentStep = Math.max(1, Math.min(steps.length, step));
			const meta = steps[currentStep - 1];
			dialog.fields_dict.step_header.$wrapper.html(`
				<div class="tp-wizard-progress">
					<div class="tp-wizard-progress__copy"><span>Etapa ${currentStep} de ${steps.length}</span><strong>${meta.title}</strong><small>${meta.description}</small></div>
					<div class="tp-wizard-progress__bar"><i style="width:${(currentStep / steps.length) * 100}%"></i></div>
				</div>
			`);
			Object.values(dialog.fields_dict).forEach((field) => {
				if (!field.df.tp_step) return;
				field.$wrapper.toggle(Number(field.df.tp_step) === currentStep);
			});
			dialog.fields_dict.original_repair_order.$wrapper.toggle(
				currentStep === 3 && values().service_type !== "Reparo"
			);
			syncChoiceFields();
			if (currentStep === 5) renderReview();
			dialog.set_primary_action(
				currentStep === steps.length ? "Criar ordem de serviço" : "Continuar",
				handlePrimary
			);
			backButton.toggle(currentStep > 1);
		}

		function handlePrimary() {
			if (!validateStep()) return;
			if (currentStep < steps.length) {
				showStep(currentStep + 1);
				return;
			}
			frappe.call({
				method: "tecponto.intake.create_repair_intake",
				args: { payload: JSON.stringify(values()) },
				freeze: true,
				freeze_message: "Criando cliente, aparelho e ordem...",
			}).then((response) => {
				const order = response.message;
				dialog.hide();
				frappe.show_alert({ message: `Ordem ${order.name} criada.`, indicator: "green" });
				frappe.set_route("Form", "Repair Order", order.name);
			});
		}

		dialog.show();
		dialog.$wrapper.addClass("tp-intake-dialog");
		const backButton = $(`<button type="button" class="btn btn-default tp-wizard-back">Voltar</button>`);
		backButton.on("click", () => showStep(currentStep - 1));
		dialog.$wrapper.find(".modal-footer .standard-actions").prepend(backButton);
		mountCommonChoices(dialog, {
			customer_mode: {
				columns: 2,
				choices: [
					{ value: "Buscar cliente", label: "Cliente existente", description: "Pesquisar primeiro evita duplicidade.", icon: ICONS.search },
					{ value: "Novo cliente", label: "Novo cliente", description: "Cadastre nome e WhatsApp.", icon: ICONS.plus },
				],
			},
			operational_consent: { columns: 2, choices: operationalConsentChoices() },
			device_mode: {
				columns: 2,
				choices: [
					{ value: "Aparelho cadastrado", label: "Já está no sistema", description: "Selecione pelo cliente.", icon: ICONS.search },
					{ value: "Cadastrar aparelho", label: "Primeira entrada", description: "Cadastre só o necessário.", icon: ICONS.phone },
				],
			},
			device_type: ["Celular", "Notebook", "Tablet", "Outro"],
			brand: ["Apple", "Samsung", "Motorola", "Xiaomi", "LG", "Asus", "Outro"],
			color: ["Preto", "Branco", "Azul", "Prata", "Dourado", "Rosa", "Verde", "Outro"],
			storage_capacity: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "Não sei"],
			service_type: [
				{ value: "Reparo", label: "Novo reparo", description: "Primeiro atendimento para este defeito.", icon: ICONS.service },
				{ value: "Garantia", label: "Garantia", description: "Retorno coberto por uma OS anterior.", icon: ICONS.shield },
				{ value: "Retrabalho", label: "Retrabalho", description: "Correção ligada a uma OS anterior.", icon: ICONS.refresh },
			],
			reported_issue: ["Tela quebrada", "Não liga", "Bateria descarrega rápido", "Não carrega", "Falha de áudio", "Falha de câmera", "Problema de software", "Outro"],
			intake_condition: ["Sem avarias além do problema", "Marcas leves de uso", "Tela trincada", "Carcaça danificada", "Oxidação aparente", "Não foi possível avaliar"],
			accessories: ["Nenhum", "Carregador", "Cabo", "Capa", "Chip ou cartão", "Carregador e cabo", "Mais de um"],
			priority: [
				{ value: "Normal", label: "Normal", description: "Segue a fila e o prazo padrão.", icon: ICONS.clock },
				{ value: "Urgente", label: "Urgente", description: "Exige justificativa operacional.", icon: ICONS.alert },
			],
			channel: [{ value: "Balcao", label: "Balcão", icon: ICONS.customers }, "Website", "WhatsApp", "Shopee", "Mercado Livre", "Outro"],
		});
		dialog.fields_dict.service_type.$input.on("change", () => showStep(currentStep));
		dialog.fields_dict.customer_mode.$input.on("change", syncChoiceFields);
		dialog.fields_dict.device_mode.$input.on("change", syncChoiceFields);
		dialog.fields_dict.customer.$input.on("change", () => {
			dialog.fields_dict.device.set_value("");
			syncChoiceFields();
		});
		showStep(1);
	}

	function wireTechnicianKanban(dashboard) {
		const targetStates = {
			diagnosis: "Em diagnostico",
			parts: "Aguardando peca",
			repair: "Em reparo",
			tests: "Em testes",
			ready: "Pronto para retirada",
		};
		let dragged = null;
		dashboard.querySelectorAll(".tp-kanban-card[draggable='true']").forEach((card) => {
			card.addEventListener("dragstart", () => {
				dragged = { name: card.dataset.tpOrder, state: card.dataset.tpState };
				card.classList.add("is-dragging");
			});
			card.addEventListener("dragend", () => {
				card.classList.remove("is-dragging");
				dragged = null;
			});
		});
		dashboard.querySelectorAll(".tp-kanban-card__main").forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				const card = link.closest(".tp-kanban-card");
				openTechnicianOSDrawer(card.dataset.tpOrder);
			});
		});
		dashboard.querySelectorAll("[data-tp-kanban-target]").forEach((column) => {
			const targetState = targetStates[column.dataset.tpKanbanTarget];
			if (!targetState) return;
			column.addEventListener("dragover", (event) => {
				if (!dragged) return;
				event.preventDefault();
				column.classList.add("is-drop-target");
			});
			column.addEventListener("dragleave", () => column.classList.remove("is-drop-target"));
			column.addEventListener("drop", (event) => {
				event.preventDefault();
				column.classList.remove("is-drop-target");
				if (!dragged || dragged.state === targetState) return;
				const args = { repair_order: dragged.name, target_state: targetState };
				const move = (extra = {}) => {
					frappe.call({
						method: "tecponto.dashboard.move_repair_card",
						args: { ...args, ...extra },
						freeze: true,
						freeze_message: "Atualizando a bancada...",
					}).then(() => {
						dashboard.remove();
						mountCommandCenter();
					});
				};
				if (targetState === "Aguardando peca") {
					frappe.prompt(
						[
							{ fieldname: "waiting_part_details", fieldtype: "Small Text", label: "Qual peça ou impedimento?", reqd: 1 },
							{ fieldname: "part_expected_at", fieldtype: "Datetime", label: "Previsão da peça", reqd: 1 },
						],
						move,
						"Aguardar peça",
						"Confirmar"
					);
					return;
				}
				move();
			});
		});
	}

	function openTechnicianOSDrawer(orderName) {
		frappe.call({
			method: "frappe.client.get",
			args: {
				doctype: "Repair Order",
				name: orderName
			},
			freeze: true,
			freeze_message: "Carregando detalhes da O.S...",
			callback: (r) => {
				const doc = r.message;
				if (!doc) return;

				Promise.all([
					frappe.db.get_value("Service Device", doc.device, ["brand", "model"]),
					frappe.db.get_value("TecPonto Contact Preference", doc.customer, "whatsapp_number")
				]).then((results) => {
					const devVal = results[0]?.message || {};
					const brand = devVal.brand || "";
					const model = devVal.model || "";
					const device_label = `${brand} ${model}`.trim() || doc.device;

					const prefVal = results[1]?.message || {};
					const whatsapp_number = prefVal.whatsapp_number || "";

					const dialog = new frappe.ui.Dialog({
						title: `Ordem de Serviço ${doc.name}`,
						fields: [
							{ fieldname: "drawer_html", fieldtype: "HTML" }
						]
					});

					dialog.$wrapper.addClass("tp-side-drawer");

					// Photo Zoom Click Event Handler
					dialog.$wrapper.on("click", ".tp-drawer-photo-wrapper", function() {
						const url = $(this).data("photo-url");
						const zoom = new frappe.ui.Dialog({
							title: "Visualizar Foto",
							fields: [{ fieldname: "img", fieldtype: "HTML" }]
						});
						zoom.fields_dict.img.$wrapper.html(`<img src="${url}" style="width:100%; height:auto;" />`);
						zoom.$wrapper.addClass("tp-photo-zoom-modal");
						zoom.show();
					});

					// Button: Iniciar Diagnóstico
					dialog.$wrapper.on("click", ".tp-btn-start-diagnosis", () => {
						frappe.call({
							method: "tecponto.dashboard.move_repair_card",
							args: { repair_order: doc.name, target_state: "Em diagnostico" },
							freeze: true,
							freeze_message: "Iniciando diagnóstico...",
							callback: (res) => {
								dialog.hide();
								mountCommandCenter();
								frappe.show_alert({ message: "Diagnóstico iniciado.", indicator: "green" });
							}
						});
					});

					// Button: Iniciar Reparo
					dialog.$wrapper.on("click", ".tp-btn-start-repair", () => {
						frappe.call({
							method: "tecponto.dashboard.move_repair_card",
							args: { repair_order: doc.name, target_state: "Em reparo" },
							freeze: true,
							freeze_message: "Iniciando reparo...",
							callback: (res) => {
								dialog.hide();
								mountCommandCenter();
								frappe.show_alert({ message: "Reparo iniciado.", indicator: "green" });
							}
						});
					});

					// Button: Retomar Reparo
					dialog.$wrapper.on("click", ".tp-btn-resume-repair", () => {
						frappe.call({
							method: "tecponto.dashboard.move_repair_card",
							args: { repair_order: doc.name, target_state: "Em reparo" },
							freeze: true,
							freeze_message: "Retomando reparo...",
							callback: (res) => {
								dialog.hide();
								mountCommandCenter();
								frappe.show_alert({ message: "Reparo retomado.", indicator: "green" });
							}
						});
					});

					// Button: Concluir Reparo
					dialog.$wrapper.on("click", ".tp-btn-complete-repair", () => {
						frappe.call({
							method: "tecponto.dashboard.move_repair_card",
							args: { repair_order: doc.name, target_state: "Em testes" },
							freeze: true,
							freeze_message: "Concluindo reparo...",
							callback: (res) => {
								dialog.hide();
								mountCommandCenter();
								frappe.show_alert({ message: "Conserto concluído. Encaminhado para testes.", indicator: "green" });
							}
						});
					});

					// Button: Aguardar Peça
					dialog.$wrapper.on("click", ".tp-btn-wait-part", () => {
						frappe.prompt([
							{ fieldname: "waiting_part_details", fieldtype: "Small Text", label: "Qual peça ou impedimento?", reqd: 1 },
							{ fieldname: "part_expected_at", fieldtype: "Datetime", label: "Previsão da peça", reqd: 1 }
						], (values) => {
							frappe.call({
								method: "tecponto.dashboard.move_repair_card",
								args: {
									repair_order: doc.name,
									target_state: "Aguardando peca",
									waiting_part_details: values.waiting_part_details,
									part_expected_at: values.part_expected_at
								},
								freeze: true,
								freeze_message: "Alterando status...",
								callback: (res) => {
									dialog.hide();
									mountCommandCenter();
									frappe.show_alert({ message: "Aguardando peça.", indicator: "orange" });
								}
							});
						}, "Aguardar peça", "Confirmar");
					});

					// Button: Dar Baixa nas Peças
					dialog.$wrapper.on("click", ".tp-btn-consume-parts", () => {
						frappe.call({
							method: "tecponto.tecponto.doctype.repair_order.repair_order.consume_parts",
							args: { repair_order: doc.name },
							freeze: true,
							freeze_message: "Baixando peças no estoque...",
							callback: (res) => {
								frappe.show_alert({ message: "Peças baixadas com sucesso.", indicator: "green" });
								frappe.call({
									method: "frappe.client.get",
									args: { doctype: "Repair Order", name: doc.name },
									callback: (resDoc) => {
										const newDoc = resDoc.message;
										renderDrawerContent(newDoc, device_label, whatsapp_number, dialog);
									}
								});
							}
						});
					});

					// Button: Adicionar Item de Orçamento
					dialog.$wrapper.on("click", ".tp-btn-add-item", () => {
						frappe.prompt([
							{ fieldname: "item_code", fieldtype: "Link", options: "Item", label: "Item (Peça ou Serviço)", reqd: 1 },
							{ fieldname: "qty", fieldtype: "Float", label: "Quantidade", default: 1, reqd: 1 },
							{ fieldname: "rate", fieldtype: "Currency", label: "Valor Unitário", reqd: 1 },
							{ fieldname: "warehouse", fieldtype: "Link", options: "Warehouse", label: "Depósito" }
						], (values) => {
							if (!doc.items) doc.items = [];
							doc.items.push({
								doctype: "Repair Order Item",
								item_code: values.item_code,
								qty: values.qty,
								rate: values.rate,
								warehouse: values.warehouse,
								amount: values.qty * values.rate
							});
							frappe.call({
								method: "frappe.client.save",
								args: { doc: doc },
								freeze: true,
								freeze_message: "Adicionando item...",
								callback: (resDoc) => {
									const newDoc = resDoc.message;
									renderDrawerContent(newDoc, device_label, whatsapp_number, dialog);
									frappe.show_alert({ message: "Item adicionado.", indicator: "green" });
								}
							});
						}, "Adicionar item", "Adicionar");
					});

					// Button: Remover Item do Orçamento
					dialog.$wrapper.on("click", ".tp-btn-remove-item", function() {
						const index = $(this).data("index");
						doc.items.splice(index, 1);
						frappe.call({
							method: "frappe.client.save",
							args: { doc: doc },
							freeze: true,
							freeze_message: "Removendo item...",
							callback: (resDoc) => {
								const newDoc = resDoc.message;
								renderDrawerContent(newDoc, device_label, whatsapp_number, dialog);
								frappe.show_alert({ message: "Item removido.", indicator: "green" });
							}
						});
					});

					// Button: Sem Conserto
					dialog.$wrapper.on("click", ".tp-btn-no-repair", () => {
						frappe.prompt([
							{ fieldname: "no_repair_reason", fieldtype: "Small Text", label: "Motivo de ficar sem conserto", reqd: 1 }
						], (values) => {
							const diagnosisVal = dialog.$wrapper.find(".tp-input-diagnosis").val() || "";
							doc.diagnosis = diagnosisVal;
							doc.no_repair_reason = values.no_repair_reason;

							frappe.call({
								method: "frappe.client.save",
								args: { doc: doc },
								freeze: true,
								freeze_message: "Salvando diagnóstico...",
								callback: (resDoc) => {
									const newDoc = resDoc.message;
									frappe.call({
										method: "tecponto.dashboard.move_repair_card",
										args: {
											repair_order: newDoc.name,
											target_state: "Sem conserto",
											no_repair_reason: values.no_repair_reason
										},
										freeze: true,
										freeze_message: "Encerrando OS...",
										callback: () => {
											dialog.hide();
											mountCommandCenter();
											frappe.show_alert({ message: "Ordem encerrada sem conserto.", indicator: "orange" });
										}
									});
								}
							});
						}, "Encerrar sem conserto", "Confirmar");
					});

					// Button: Enviar Orçamento
					dialog.$wrapper.on("click", ".tp-btn-submit-budget", () => {
						const diagnosisVal = dialog.$wrapper.find(".tp-input-diagnosis").val() || "";
						if (!diagnosisVal.trim()) {
							frappe.throw("Por favor, preencha o laudo técnico antes de enviar.");
							return;
						}
						if (!doc.items || doc.items.length === 0) {
							frappe.throw("Adicione pelo menos um item (serviço ou peça) ao orçamento.");
							return;
						}

						doc.diagnosis = diagnosisVal;
						frappe.call({
							method: "frappe.client.save",
							args: { doc: doc },
							freeze: true,
							freeze_message: "Salvando diagnóstico...",
							callback: (resDoc) => {
								const newDoc = resDoc.message;
								frappe.call({
									method: "tecponto.dashboard.move_repair_card",
									args: { repair_order: newDoc.name, target_state: "Aguardando aprovacao" },
									freeze: true,
									freeze_message: "Enviando para aprovação...",
									callback: () => {
										dialog.hide();
										mountCommandCenter();
										frappe.show_alert({ message: "Orçamento enviado para aprovação.", indicator: "green" });
									}
								});
							}
						});
					});

					// Interactive Checklist Test Buttons
					dialog.$wrapper.on("click", ".tp-drawer-test-btn", function() {
						const btn = $(this);
						const itemIndex = btn.closest(".tp-drawer-test-item").data("index");
						const resultVal = btn.data("result");

						btn.siblings().removeClass("active");
						btn.addClass("active");

						doc.tests[itemIndex].result = resultVal;

						frappe.call({
							method: "frappe.client.save",
							args: { doc: doc },
							callback: (resDoc) => {
								const newDoc = resDoc.message;
								renderDrawerContent(newDoc, device_label, whatsapp_number, dialog);
							}
						});
					});

					// Button: Liberar para Retirada
					dialog.$wrapper.on("click", ".tp-btn-release-repair", () => {
						const solutionVal = dialog.$wrapper.find(".tp-input-solution").val() || "";
						if (!solutionVal.trim()) {
							frappe.throw("Por favor, registre a solução executada antes de liberar.");
							return;
						}

						doc.solution = solutionVal;

						const pendingTests = (doc.tests || []).filter(t => t.result !== "Aprovado");
						if (pendingTests.length > 0) {
							frappe.throw(`Todos os testes precisam estar aprovados. Pendências: ${pendingTests.map(t => t.test_name).join(', ')}`);
							return;
						}

						const pendingParts = (doc.items || []).filter(item => item.is_stock_item && flt(item.consumed_qty) < flt(item.qty));
						if (pendingParts.length > 0 && !doc.parts_stock_entry) {
							frappe.throw(`Por favor, dê baixa nas peças antes de liberar o aparelho: ${pendingParts.map(i => i.item_code).join(', ')}`);
							return;
						}

						frappe.call({
							method: "frappe.client.save",
							args: { doc: doc },
							freeze: true,
							freeze_message: "Salvando solução...",
							callback: (resDoc) => {
								const newDoc = resDoc.message;
								frappe.call({
									method: "tecponto.dashboard.move_repair_card",
									args: { repair_order: newDoc.name, target_state: "Pronto para retirada" },
									freeze: true,
									freeze_message: "Liberando aparelho...",
									callback: () => {
										dialog.hide();
										mountCommandCenter();
										frappe.show_alert({ message: "Aparelho liberado para retirada.", indicator: "green" });
									}
								});
							}
						});
					});

					// Button: Enviar WhatsApp com Template
					dialog.$wrapper.on("click", ".tp-btn-send-wa", function() {
						const btn = $(this);
						const templateName = btn.data("template");
						let msg = btn.data("msg");
						const requiresSignature = Boolean(btn.data("requires-signature"));

						const nowStr = frappe.datetime.now_datetime();
						const userStr = frappe.session.user_fullname || frappe.session.user || "Sistema";
						const logEntry = `[${nowStr}] ${templateName} por ${userStr.split(' ')[0]}\n`;
						doc.whatsapp_messages_log = (doc.whatsapp_messages_log || "") + logEntry;

						const sendMessage = () => frappe.call({
							method: "frappe.client.save",
							args: { doc: doc },
							freeze: true,
							freeze_message: "Registrando envio...",
							callback: (resDoc) => {
								const newDoc = resDoc.message;
								renderDrawerContent(newDoc, device_label, whatsapp_number, dialog);
								frappe.show_alert({ message: "Envio registrado.", indicator: "green" });

								const waUrl = `https://wa.me/${whatsapp_number}?text=${encodeURIComponent(msg)}`;
								window.open(waUrl, "_blank");
							}
						});
						if (requiresSignature) {
							frappe.call({
								method: "tecponto.www.os_aceite.generate_signature_link",
								args: { repair_order: doc.name },
							}).then((response) => {
								msg = `${msg} ${window.location.origin}${response.message.path}`;
								sendMessage();
							});
						} else {
							sendMessage();
						}
					});

					renderDrawerContent(doc, device_label, whatsapp_number, dialog);
					dialog.show();
				});
			}
		});
	}

	function renderDrawerContent(doc, device_label, whatsapp_number, dialog) {
		const customerName = doc.customer_name || doc.customer;
		const promisedAtFormatted = formatDeadline(doc.promised_at);

		let metaHtml = `
			<span>${ICONS.phone} ${escapeHtml(customerName)}</span>
			${whatsapp_number ? `
				<a class="tp-drawer-whatsapp-btn" href="https://wa.me/${whatsapp_number}?text=${encodeURIComponent(`Olá, ${customerName}! Sou o técnico responsável pelo seu aparelho na TecPonto. Estou tratando a ordem de serviço ${doc.name}.`)}" target="_blank">
					${ICONS.whatsapp} WhatsApp
				</a>` : ''}
			<span>${ICONS.clock} Prazo: ${promisedAtFormatted}</span>
		`;
		if (doc.priority === "Urgente") {
			metaHtml += `<span class="tp-badge tp-badge--urgente">${ICONS.alert} Urgente</span>`;
		}

		let bodyHtml = '';

		// 1. Aparelho e Relato
		bodyHtml += `
			<div class="tp-drawer-section">
				<h3>Aparelho e Entrada</h3>
				<p><strong>Aparelho:</strong> ${escapeHtml(device_label)}</p>
				<p><strong>Problema relatado:</strong> ${escapeHtml(doc.reported_issue || "Não informado")}</p>
				${doc.intake_condition ? `<p><strong>Condição física:</strong> ${escapeHtml(doc.intake_condition)}</p>` : ''}
				${doc.accessories ? `<p><strong>Acessórios:</strong> ${escapeHtml(doc.accessories)}</p>` : ''}
			</div>
		`;

		// 2. Fotos de Entrada
		if (doc.intake_front_photo || doc.intake_back_photo) {
			bodyHtml += `
				<div class="tp-drawer-section">
					<h3>Fotos de Entrada</h3>
					<div class="tp-drawer-photos">
			`;
			if (doc.intake_front_photo) {
				bodyHtml += `
					<div class="tp-drawer-photo-wrapper" data-photo-url="${doc.intake_front_photo}">
						<img src="${doc.intake_front_photo}" alt="Frente" />
						<div class="tp-drawer-photo-label">Frente</div>
					</div>
				`;
			}
			if (doc.intake_back_photo) {
				bodyHtml += `
					<div class="tp-drawer-photo-wrapper" data-photo-url="${doc.intake_back_photo}">
						<img src="${doc.intake_back_photo}" alt="Traseira" />
						<div class="tp-drawer-photo-label">Traseira</div>
					</div>
				`;
			}
			bodyHtml += `
					</div>
				</div>
			`;
		}

		// 3. Ações Contextuais baseadas na etapa
		const state = doc.workflow_state;

		if (state === "Recebido") {
			bodyHtml += `
				<div class="tp-drawer-section">
					<h3>Diagnóstico</h3>
					<div class="tp-kanban-help" style="margin-bottom: 12px;">
						${ICONS.alert}
						<span>Você precisa iniciar o diagnóstico para liberar o laudo e orçamento.</span>
					</div>
					<button class="btn btn-primary btn-block tp-btn-start-diagnosis">Iniciar Diagnóstico</button>
				</div>
			`;
		} else if (state === "Em diagnostico") {
			let itemsRowsHtml = '';
			let total = 0;
			(doc.items || []).forEach((item, index) => {
				total += (item.amount || 0);
				itemsRowsHtml += `
					<tr>
						<td>
							<div class="item-desc">${escapeHtml(item.item_code)}</div>
							${item.warehouse ? `<div class="item-meta">${escapeHtml(item.warehouse)}</div>` : ''}
						</td>
						<td>${item.qty}</td>
						<td class="item-value">${formatCurrency(item.rate)}</td>
						<td>
							<button class="btn btn-xs btn-default tp-btn-remove-item" data-index="${index}" style="color: #c83b32; padding: 1px 6px;">Remover</button>
						</td>
					</tr>
				`;
			});

			bodyHtml += `
				<div class="tp-drawer-section">
					<h3>Laudo Técnico</h3>
					<div class="form-group">
						<textarea class="form-control tp-input-diagnosis" rows="3" placeholder="Digite o laudo técnico detalhado...">${escapeHtml(doc.diagnosis || "")}</textarea>
					</div>
				</div>
				<div class="tp-drawer-section">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
						<h3 style="margin: 0;">Itens do Orçamento</h3>
						<button class="btn btn-xs btn-primary tp-btn-add-item">${ICONS.plus} Adicionar Item</button>
					</div>
					<table class="tp-drawer-budget-list">
						<thead>
							<tr>
								<th>Item</th>
								<th>Qtd</th>
								<th class="item-value">Valor</th>
								<th style="width: 60px;"></th>
							</tr>
						</thead>
						<tbody>
							${itemsRowsHtml || '<tr><td colspan="4" class="text-center text-muted">Nenhum item adicionado.</td></tr>'}
						</tbody>
					</table>
					<div class="tp-drawer-budget-total">
						<span>Total Estimado:</span>
						<span>${formatCurrency(total)}</span>
					</div>
				</div>
				<div class="tp-drawer-section">
					<h3>Ações do Laudo</h3>
					<div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
						<button class="btn btn-primary tp-btn-submit-budget">Enviar Orçamento</button>
						<button class="btn btn-default tp-btn-no-repair" style="color: #c83b32; border-color: rgba(200, 59, 50, 0.4);">Sem Conserto</button>
					</div>
				</div>
			`;
		} else if (state === "Aguardando aprovacao") {
			bodyHtml += `
				<div class="tp-drawer-section">
					<h3>Aguardando Aprovação</h3>
					<div class="tp-kanban-help">
						${ICONS.clock}
						<span>Aguardando aprovação do cliente. Os detalhes estão travados para edição.</span>
					</div>
					<p><strong>Laudo técnico:</strong> ${escapeHtml(doc.diagnosis)}</p>
					<h4>Itens do Orçamento:</h4>
					<ul>
						${(doc.items || []).map(i => `<li>${escapeHtml(i.item_code)} (Qtd: ${i.qty}) - ${formatCurrency(i.rate)}</li>`).join('')}
					</ul>
				</div>
			`;
		} else if (state === "Aprovado" || state === "Em reparo" || state === "Aguardando peca") {
			let partsListHtml = '';
			let hasPendingParts = false;
			(doc.items || []).forEach(item => {
				if (item.is_stock_item) {
					const pending = item.qty - (item.consumed_qty || 0);
					if (pending > 0) hasPendingParts = true;
					partsListHtml += `
						<li>
							<strong>${escapeHtml(item.item_code)}</strong><br/>
							<small class="text-muted">Depósito: ${escapeHtml(item.warehouse || "Não definido")} | Consumido: ${item.consumed_qty || 0} / ${item.qty}</small>
						</li>
					`;
				}
			});

			bodyHtml += `
				<div class="tp-drawer-section">
					<h3>Execução do Reparo</h3>
					<p><strong>Etapa atual:</strong> <span class="tp-badge">${escapeHtml(state)}</span></p>
					${state === "Aprovado" ? `<button class="btn btn-primary btn-block tp-btn-start-repair">Iniciar Reparo</button>` : ''}
					${state === "Aguardando peca" && doc.waiting_part_details ? `
						<div class="tp-kanban-card__block" style="margin-bottom: 12px;">
							${ICONS.alert}
							<span>Bloqueado: ${escapeHtml(doc.waiting_part_details)} (Previsão: ${formatDeadline(doc.part_expected_at)})</span>
						</div>
						<button class="btn btn-primary btn-block tp-btn-resume-repair">Retomar Reparo</button>
					` : ''}

					${state === "Em reparo" ? `
						<div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
							<button class="btn btn-primary tp-btn-complete-repair">Concluir Reparo</button>
							<button class="btn btn-default tp-btn-wait-part">Aguardar Peça</button>
						</div>
					` : ''}
				</div>
			`;

			if (partsListHtml) {
				bodyHtml += `
					<div class="tp-drawer-section">
						<h3>Peças de Estoque</h3>
						<ul style="padding-left: 16px; margin-bottom: 12px;">${partsListHtml}</ul>
						${hasPendingParts && !doc.parts_stock_entry ? `
							<button class="btn btn-warning btn-block tp-btn-consume-parts">Dar Baixa nas Peças</button>
						` : doc.parts_stock_entry ? `
							<div class="alert alert-success" style="padding: 8px; font-size: 11px; margin-bottom: 0; background: rgba(22, 131, 71, 0.1); color: #168347; border-color: rgba(22, 131, 71, 0.2);">
								${ICONS.check} Peças baixadas via Stock Entry: <strong>${escapeHtml(doc.parts_stock_entry)}</strong>
							</div>
						` : `
							<div class="alert alert-info" style="padding: 8px; font-size: 11px; margin-bottom: 0;">
								Nenhuma peça pendente de baixa.
							</div>
						`}
					</div>
				`;
			}
		} else if (state === "Em testes") {
			let testsHtml = '';
			(doc.tests || []).forEach((test, index) => {
				const result = test.result || "Pendente";
				testsHtml += `
					<div class="tp-drawer-test-item" data-index="${index}">
						<div class="tp-drawer-test-info">
							<span class="tp-drawer-test-name">${escapeHtml(test.test_name)}</span>
							<span class="tp-drawer-test-note">${escapeHtml(test.notes || "")}</span>
						</div>
						<div class="tp-drawer-test-actions">
							<button class="tp-drawer-test-btn ${result === 'Pendente' ? 'active' : ''}" data-result="Pendente">Pend</button>
							<button class="tp-drawer-test-btn ${result === 'Aprovado' ? 'active' : ''}" data-result="Aprovado">Aprov</button>
							<button class="tp-drawer-test-btn ${result === 'Reprovado' ? 'active' : ''}" data-result="Reprovado">Reprov</button>
						</div>
					</div>
				`;
			});

			bodyHtml += `
				<div class="tp-drawer-section">
					<h3>Solução do Reparo</h3>
					<div class="form-group">
						<textarea class="form-control tp-input-solution" rows="2" placeholder="Descreva a solução executada (ex: Troca de tela)...">${escapeHtml(doc.solution || "")}</textarea>
					</div>
				</div>
				<div class="tp-drawer-section">
					<h3>Checklist de Qualidade</h3>
					<div class="tp-drawer-tests-list">
						${testsHtml || '<div class="text-muted text-center">Nenhum teste de qualidade cadastrado nesta OS.</div>'}
					</div>
				</div>
				<div class="tp-drawer-section">
					<button class="btn btn-primary btn-block tp-btn-release-repair">Liberar para Retirada</button>
				</div>
			`;
		} else {
			bodyHtml += `
				<div class="tp-drawer-section">
					<h3>Etapa: ${escapeHtml(state)}</h3>
					<p>A OS está na etapa final de ${escapeHtml(state)}.</p>
				</div>
			`;
		}

		if (whatsapp_number) {
			const customerName = doc.customer_name || doc.customer;
			const totalStr = formatCurrency(doc.estimated_total || 0);
			const deviceStr = device_label || doc.device;
			const msgAbertura = `Olá, ${customerName}! Sua Ordem de Serviço nº ${doc.name} foi aberta na TecPonto para o aparelho ${deviceStr}.`;
			const msgOrcamento = `Olá, ${customerName}! O diagnóstico do seu ${deviceStr} foi concluído. O orçamento da O.S. ${doc.name} ficou em ${totalStr}.`;
			const msgPronto = `Olá, ${customerName}! Seu ${deviceStr} (O.S. ${doc.name}) foi consertado e já está pronto para retirada na TecPonto. Esperamos você!`;
			const msgEntrega = `Olá, ${customerName}! Seu ${deviceStr} (O.S. ${doc.name}) foi entregue. Agradecemos a confiança! A garantia registrada é de ${doc.warranty_days || 90} dias.`;
			const msgAssinatura = `Olá, ${customerName}! Para revisar e aceitar os termos da O.S. ${doc.name}, acesse:`;
			
			bodyHtml += `
				<div class="tp-drawer-section">
					<h3>Comunicação WhatsApp</h3>
					<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
						<button class="btn btn-default btn-xs tp-btn-send-wa" data-template="Abertura" data-msg="${escapeHtml(msgAbertura)}">Abertura de O.S.</button>
						<button class="btn btn-default btn-xs tp-btn-send-wa" data-template="Orçamento" data-msg="${escapeHtml(msgOrcamento)}">Enviar Orçamento</button>
						<button class="btn btn-default btn-xs tp-btn-send-wa" data-template="Pronto" data-msg="${escapeHtml(msgPronto)}">Aparelho Pronto</button>
						<button class="btn btn-default btn-xs tp-btn-send-wa" data-template="Garantia" data-msg="${escapeHtml(msgEntrega)}">Termo de Garantia</button>
						<button class="btn btn-default btn-xs tp-btn-send-wa" data-template="Assinatura" data-requires-signature="1" data-msg="${escapeHtml(msgAssinatura)}">Enviar aceite digital</button>
					</div>
					${doc.whatsapp_messages_log ? `
						<div style="font-size: 10px; color: var(--tp-text-muted); background: var(--tp-surface-muted); padding: 8px; border-radius: 6px; max-height: 80px; overflow-y: auto; font-family: monospace;">
							${escapeHtml(doc.whatsapp_messages_log).replace(/\n/g, '<br/>')}
						</div>
					` : ''}
				</div>
			`;
		}

		dialog.fields_dict.drawer_html.$wrapper.html(bodyHtml);

		const header = dialog.$wrapper.find(".modal-header");
		header.find(".tp-drawer-header-meta").remove();
		header.append(`<div class="tp-drawer-header-meta">${metaHtml}</div>`);
	}

	function wireDashboard(dashboard) {
		dashboard.querySelectorAll("[data-tp-new]").forEach((button) => {
			button.addEventListener("click", () => frappe.new_doc(button.dataset.tpNew));
		});
		dashboard.querySelectorAll("[data-tp-guided-repair]").forEach(el => el.addEventListener("click", openRepairIntakeWizard));
		dashboard.querySelector("[data-tp-guided-device]")?.addEventListener("click", openDeviceWizard);
		dashboard.querySelector("[data-tp-guided-trade]")?.addEventListener("click", openTradeIntakeWizard);
		dashboard.querySelector("[data-tp-guided-customer]")?.addEventListener("click", openCustomerWizard);
		wireTechnicianKanban(dashboard);
		dashboard.querySelectorAll("[data-tp-refresh]").forEach(el => {
			el.addEventListener("click", () => {
				dashboard.remove();
				mountCommandCenter();
			});
		});
		dashboard.querySelector("[data-tp-open-cash]")?.addEventListener("click", () => {
			frappe.prompt(
				[{ fieldname: "opening_amount", fieldtype: "Currency", label: "Fundo inicial", default: 0, reqd: 1 }],
				(values) => callCashMethod("tecponto.cash.open_cash", values, dashboard),
				"Abrir caixa",
				"Abrir"
			);
		});
		dashboard.querySelector("[data-tp-cash-movement]")?.addEventListener("click", () => {
			frappe.prompt(
				[
					{ fieldname: "movement_type", fieldtype: "Select", label: "Movimento", options: "Venda\nRecebimento\nSuprimento\nSangria\nEstorno\nAjuste", reqd: 1 },
					{ fieldname: "direction", fieldtype: "Select", label: "Direção do ajuste", options: "\nEntrada\nSaída", depends_on: "eval:doc.movement_type == 'Ajuste'" },
					{ fieldname: "payment_method", fieldtype: "Select", label: "Forma", options: "Dinheiro\nPix\nDébito\nCrédito\nTransferência\nOutro", reqd: 1 },
					{ fieldname: "amount", fieldtype: "Currency", label: "Valor", reqd: 1 },
					{ fieldname: "notes", fieldtype: "Small Text", label: "Observações" },
				],
				(values) => callCashMethod("tecponto.cash.register_movement", values, dashboard),
				"Registrar movimento",
				"Registrar"
			);
		});
		dashboard.querySelector("[data-tp-close-cash]")?.addEventListener("click", () => {
			frappe.prompt(
				[
					{ fieldname: "counted_amount", fieldtype: "Currency", label: "Valor contado", reqd: 1 },
					{ fieldname: "notes", fieldtype: "Small Text", label: "Justificativa de diferença" },
				],
				(values) => callCashMethod("tecponto.cash.close_cash", values, dashboard),
				"Fechar caixa",
				"Fechar"
			);
		});

		// Close signature banner
		dashboard.querySelector("#btn-close-sig-banner")?.addEventListener("click", () => {
			dashboard.querySelector("#tp-sig-banner")?.remove();
		});

		// Enviar link de assinatura
		const sendSigLink = () => {
			frappe.prompt([
				{ fieldname: "repair_order", fieldtype: "Link", options: "Repair Order", label: "Selecione a OS", reqd: 1 }
			], (values) => {
				frappe.call({
					method: "frappe.client.get",
					args: { doctype: "Repair Order", name: values.repair_order },
					callback: (res) => {
						const doc = res.message;
						frappe.db.get_value("TecPonto Contact Preference", doc.customer, "whatsapp_number").then(r => {
							const phone = r.message ? r.message.whatsapp_number : "";
							if (!phone) {
								frappe.show_alert({ message: "WhatsApp do cliente não encontrado.", indicator: "red" });
								return;
							}
							frappe.call({
								method: "tecponto.www.os_aceite.generate_signature_link",
								args: { repair_order: doc.name },
							}).then((signatureResponse) => {
								const link = `${window.location.origin}${signatureResponse.message.path}`;
								const text = `Olá ${doc.customer_name}, aqui está o link para revisar e aceitar os termos da ordem ${doc.name}: ${link}`;
								window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, "_blank");
							});
						});
					}
				});
			}, "Enviar link de assinatura", "Enviar");
		};
		dashboard.querySelector("#tp-btn-send-sig-link")?.addEventListener("click", sendSigLink);
		dashboard.querySelector("#tp-shortcut-sig-link")?.addEventListener("click", sendSigLink);

		// Enviar WhatsApp Shortcut
		dashboard.querySelector("#tp-shortcut-send-wa")?.addEventListener("click", () => {
			frappe.prompt([
				{ fieldname: "phone", fieldtype: "Data", label: "WhatsApp do Cliente (com DDD)", reqd: 1 },
				{ fieldname: "message", fieldtype: "Small Text", label: "Mensagem", reqd: 1 }
			], (values) => {
				const cleanPhone = values.phone.replace(/\D/g, '');
				window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(values.message)}`, "_blank");
			}, "Enviar WhatsApp", "Enviar");
		});

		// Registrar retirada Shortcut
		dashboard.querySelector("#tp-shortcut-ready")?.addEventListener("click", () => {
			frappe.prompt([
				{ fieldname: "repair_order", fieldtype: "Link", options: "Repair Order", label: "Selecione a OS Pronta", reqd: 1 }
			], (values) => {
				frappe.call({
					method: "tecponto.dashboard.move_repair_card",
					args: {
						repair_order: values.repair_order,
						target_state: "Pronto para retirada"
					},
					freeze: true,
					callback: (res) => {
						frappe.show_alert({ message: "Retirada registrada com sucesso.", indicator: "green" });
						dashboard.remove();
						mountCommandCenter();
					}
				});
			}, "Registrar Retirada", "Confirmar");
		});

		// Inline table row WhatsApp button
		$(dashboard).off("click", ".tp-btn-row-wa").on("click", ".tp-btn-row-wa", function(e) {
			e.preventDefault();
			const phone = $(this).data("phone");
			const name = $(this).data("name");
			const os = $(this).data("os");
			if (!phone) {
				frappe.show_alert({ message: "Número do WhatsApp não cadastrado.", indicator: "red" });
				return;
			}
			const text = `Olá ${name}, referente ao seu atendimento da OS ${os} na TecPonto...`;
			window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, "_blank");
		});

		const filterSelect = dashboard.querySelector("#tp-tech-filter");
		if (filterSelect) {
			filterSelect.addEventListener("change", (e) => {
				currentSelectedTechnician = e.target.value || null;
				dashboard.remove();
				mountCommandCenter();
			});
		}
	}

	function callCashMethod(method, args, dashboard) {
		frappe.call({ method, args, freeze: true }).then(() => {
			dashboard.remove();
			mountCommandCenter();
		});
	}

	async function mountCommandCenter(attempt = 0) {
		if (!isTecPontoOperator()) return;
		if (!isWorkspaceRoute()) {
			const main =
				document.querySelector(".page-container .layout-main-section") ||
				document.querySelector(".layout-main-section");
			if (main) {
				main.classList.remove("tp-command-center-host");
			}
			const existing = document.querySelector(".tp-command-center");
			if (existing) {
				existing.remove();
			}
			return;
		}
		if (document.querySelector(".tp-command-center")) return;

		const main =
			document.querySelector(".page-container .layout-main-section") ||
			document.querySelector(".layout-main-section");
		if (!main) {
			if (attempt < 12) setTimeout(() => mountCommandCenter(attempt + 1), 120);
			return;
		}

		main.classList.add("tp-command-center-host");
		const dashboard = document.createElement("div");
		dashboard.className = "tp-command-center tp-command-center--loading";
		dashboard.innerHTML = `
			<div class="tp-dashboard-loading">
				<span></span><span></span><span></span>
			</div>
		`;
		main.prepend(dashboard);

		try {
			const response = await frappe.call({
				method: "tecponto.dashboard.get_summary",
				args: currentSelectedTechnician ? { selected_technician: currentSelectedTechnician } : {}
			});
			dashboard.outerHTML = dashboardMarkup(response.message);
			wireDashboard(main.querySelector(".tp-command-center"));
		} catch (error) {
			dashboard.classList.remove("tp-command-center--loading");
			dashboard.innerHTML = `
				<div class="tp-dashboard-error">
					${ICONS.alert}
					<strong>Não foi possível carregar a visão geral.</strong>
					<button class="btn btn-primary" type="button" data-tp-refresh>Tentar novamente</button>
				</div>
			`;
			wireDashboard(dashboard);
			console.error(error);
		}
	}

	function enhanceTopbar(root = document) {
		if (!isTecPontoOperator()) return;
		
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
			whatsappBtn.innerHTML = `${ICONS.whatsapp} WhatsApp`;
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

	function applyTecPontoShell(root = document) {
		if (!isTecPontoOperator()) return;
		document.body.classList.add("tecponto-operator");
		installGuidedCreation();
		const sidebar =
			root.querySelector?.(".body-sidebar") ||
			document.querySelector(".body-sidebar");
		if (sidebar) {
			setupBrand(sidebar);
			setupOperatorNavigation(sidebar);
		}
		simplifyAppMenu(root);
		translateInterfaceLeaks(root);
		enhanceOperationalList(root);
		updateActiveNavigation();
		enhanceTopbar(root);
		mountCommandCenter();
	}

	function installGuidedCreation() {
		frappe.listview_settings = frappe.listview_settings || {};
		const statusFormatter = (value) =>
			`<span class="tp-list-status tp-list-status--${rowTone(String(value || ""))}">${escapeHtml(displayState(value))}</span>`;

		const getTradeInStepIndex = (state) => {
			switch (state) {
				case "Triagem de troca": return 0;
				case "Avaliacao": return 1;
				case "Oferta pendente":
				case "Oferta apresentada": return 2;
				case "Oferta aceita":
				case "Oferta recusada": return 3;
				case "Aquisicao aprovada":
				case "Em revisao": return 4;
				case "Pronto para venda":
				case "Encerrado": return 5;
				default: return 0;
			}
		};

		const renderTradeInPipeline = (state) => {
			const stepIndex = getTradeInStepIndex(state);
			const stepsCount = 6;
			const stepNames = ["Triagem", "Avaliação", "Oferta", "Negociação", "Revisão", "Pronto"];
			
			let html = `<div class="tp-trade-in-pipeline-row" title="Etapa atual: ${escapeHtml(displayState(state))}">`;
			for (let i = 0; i < stepsCount; i++) {
				let dotClass = "tp-pipeline-dot";
				let isCompleted = i < stepIndex;
				let isActive = i === stepIndex;
				
				if (state === "Oferta recusada" && i === 3) {
					dotClass += " is-failed";
				} else if (state === "Encerrado" && stepIndex === 5) {
					isCompleted = true;
				}
				
				if (isCompleted) dotClass += " is-completed";
				if (isActive) dotClass += " is-active";
				
				html += `<span class="${dotClass}" title="${stepNames[i]}"></span>`;
				if (i < stepsCount - 1) {
					let lineClass = "tp-pipeline-line";
					if (i < stepIndex) lineClass += " is-completed";
					html += `<span class="${lineClass}"></span>`;
				}
			}
			html += `</div>`;
			return html;
		};

		frappe.listview_settings["Repair Order"] = {
			...(frappe.listview_settings["Repair Order"] || {}),
			primary_action: openRepairIntakeWizard,
			add_fields: ["workflow_state", "sla_status", "priority", "technician", "device", "customer_name"],
			get_indicator(doc) {
				const state = doc.sla_status === "Atrasado" ? "Atrasado" : displayState(doc.workflow_state);
				const tone = rowTone(state);
				const color = { danger: "red", waiting: "orange", success: "green", active: "blue", neutral: "gray" }[tone];
				const filterField = doc.sla_status === "Atrasado" ? "sla_status" : "workflow_state";
				const filterValue = doc.sla_status === "Atrasado" ? "Atrasado" : doc.workflow_state;
				return [state, color, `${filterField},=,${filterValue}`];
			},
			formatters: {
				workflow_state: statusFormatter,
				sla_status: statusFormatter,
				priority: statusFormatter,
				device(value, df, doc) {
					if (!value) return "";
					return `<div style="display: flex; align-items: center; gap: 8px;">
						<span class="tp-device-thumb-placeholder" data-device="${value}" style="width: 32px; height: 32px; border-radius: 4px; background: var(--tp-surface-muted); display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--tp-border); overflow: hidden; flex-shrink: 0;">
							${ICONS.phone}
						</span>
						<span>${escapeHtml(value)}</span>
					</div>`;
				}
			},
			onload(listview) {
				listview.page.wrapper.on("draw", () => {
					const deviceNames = (listview.data || []).map(d => d.device).filter(Boolean);
					const uniqueDevices = [...new Set(deviceNames)];
					if (uniqueDevices.length) {
						frappe.call({
							method: "tecponto.dashboard.get_devices_thumbnails",
							args: { devices: uniqueDevices },
							callback: (r) => {
								if (r.message) {
									Object.keys(r.message).forEach(name => {
										const url = r.message[name];
										if (url) {
											listview.page.wrapper.find(`.tp-device-thumb-placeholder[data-device="${name}"]`).html(`
												<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" />
											`);
										}
									});
								}
							}
						});
					}
				});
			}
		};
		frappe.listview_settings["Service Device"] = {
			...(frappe.listview_settings["Service Device"] || {}),
			primary_action: openDeviceWizard,
			add_fields: ["device_type", "brand", "model", "customer_name", "active"],
			get_indicator(doc) {
				return doc.active ? ["Ativo", "green", "active,=,1"] : ["Inativo", "gray", "active,=,0"];
			},
			formatters: {
				model(value, df, doc) {
					return `<div style="display: flex; align-items: center; gap: 8px;">
						<span class="tp-device-thumb-placeholder" data-device="${doc.name}" style="width: 32px; height: 32px; border-radius: 4px; background: var(--tp-surface-muted); display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--tp-border); overflow: hidden; flex-shrink: 0;">
							${ICONS.phone}
						</span>
						<span>${escapeHtml(value)}</span>
					</div>`;
				}
			},
			onload(listview) {
				const side = listview.page.sidebar;
				if (side && !side.find(".tp-side-flow-panel").length) {
					side.append(`
						<div class="tp-side-flow-panel" style="margin-top: 20px; display: flex; flex-direction: column; gap: 16px;">
							<div style="background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 12px; padding: 16px;">
								<h3 style="font-size: 13px; font-weight: 700; color: var(--tp-text); margin-top: 0; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
									<span style="color: var(--tp-orange); display: flex;">${ICONS.trade}</span>
									Fluxo sugerido
								</h3>
								<ol style="margin: 0; padding-left: 16px; font-size: 12px; line-height: 1.5; color: var(--tp-text); text-align: left;">
									<li style="margin-bottom: 8px;"><strong>Localizar aparelho:</strong> Use a busca por IMEI para encontrar o aparelho exato.</li>
									<li style="margin-bottom: 8px;"><strong>Revisar histórico:</strong> Consulte atendimentos anteriores e prazos de garantia.</li>
									<li><strong>Abrir nova OS:</strong> Clique em + para iniciar o novo ticket.</li>
								</ol>
							</div>
							<div style="background: rgba(255, 75, 0, 0.05); border: 1px solid var(--tp-border); border-radius: 12px; padding: 16px;">
								<h4 style="font-size: 12px; font-weight: 700; color: var(--tp-orange); margin-top: 0; margin-bottom: 8px;">Evite cadastros duplicados</h4>
								<p style="font-size: 11px; line-height: 1.4; color: var(--tp-text-muted); margin: 0; text-align: left;">Sempre pesquise antes de cadastrar. Assim, garantimos histórico completo e agilidade.</p>
							</div>
							<div style="background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
								<div style="display: flex; align-items: center; gap: 8px;">
									<span style="color: var(--tp-green); font-size: 16px; display: flex;">${ICONS.whatsapp}</span>
									<span style="font-weight: 700; font-size: 12px; color: var(--tp-text);">WhatsApp integrado</span>
								</div>
								<p style="font-size: 11px; color: var(--tp-text-muted); margin: 0; text-align: left;">Fale com o cliente direto da ficha do aparelho.</p>
							</div>
						</div>
					`);
				}

				listview.page.wrapper.on("draw", () => {
					const deviceNames = (listview.data || []).map(d => d.name);
					if (deviceNames.length) {
						frappe.call({
							method: "tecponto.dashboard.get_devices_thumbnails",
							args: { devices: deviceNames },
							callback: (r) => {
								if (r.message) {
									Object.keys(r.message).forEach(name => {
										const url = r.message[name];
										if (url) {
											listview.page.wrapper.find(`.tp-device-thumb-placeholder[data-device="${name}"]`).html(`
												<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" />
											`);
										}
									});
								}
							}
						});
					}
				});
			}
		};
		frappe.listview_settings["Trade In Evaluation"] = {
			...(frappe.listview_settings["Trade In Evaluation"] || {}),
			primary_action: openTradeIntakeWizard,
			add_fields: ["workflow_state", "offer_status", "device", "customer_name", "technician"],
			get_indicator(doc) {
				const state = displayState(doc.workflow_state);
				const tone = rowTone(state);
				const color = { danger: "red", waiting: "orange", success: "green", active: "blue", neutral: "gray" }[tone];
				return [state, color, `workflow_state,=,${doc.workflow_state}`];
			},
			formatters: {
				workflow_state(value, df, doc) {
					const state = String(value || "Triagem de troca");
					return `<div style="display: flex; flex-direction: column; gap: 4px;">
						<span class="tp-list-status tp-list-status--${rowTone(state)}" style="width: fit-content;">${escapeHtml(displayState(state))}</span>
						${renderTradeInPipeline(state)}
					</div>`;
				},
				offer_status: statusFormatter,
				device(value, df, doc) {
					if (!value) return "";
					return `<div style="display: flex; align-items: center; gap: 8px;">
						<span class="tp-device-thumb-placeholder" data-device="${value}" style="width: 32px; height: 32px; border-radius: 4px; background: var(--tp-surface-muted); display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--tp-border); overflow: hidden; flex-shrink: 0;">
							${ICONS.phone}
						</span>
						<span>${escapeHtml(value)}</span>
					</div>`;
				}
			},
			onload(listview) {
				const mainSection = listview.page.wrapper.find(".layout-main-section");
				if (mainSection.length && !mainSection.find(".tp-trade-in-tabs-wrapper").length) {
					const tabs = [
						{ label: "Todos", states: [] },
						{ label: "Triagem", states: ["Triagem de troca"] },
						{ label: "Avaliação", states: ["Avaliacao"] },
						{ label: "Ofertas", states: ["Oferta pendente", "Oferta apresentada"] },
						{ label: "Negociação", states: ["Oferta aceita", "Oferta recusada"] },
						{ label: "Revisão", states: ["Aquisicao aprovada", "Em revisao"] },
						{ label: "Pronto / Venda", states: ["Pronto para venda", "Encerrado"] }
					];

					let tabsHtml = `
						<div class="tp-trade-in-tabs-wrapper" style="padding: 16px 20px 0; border-bottom: 1px solid var(--tp-border); background: var(--tp-surface); border-top-left-radius: 14px; border-top-right-radius: 14px;">
							<div class="tp-trade-in-tabs" style="display: flex; gap: 16px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;">
					`;

					tabs.forEach((tab, index) => {
						const activeClass = index === 0 ? "is-active" : "";
						tabsHtml += `
							<button class="tp-trade-in-tab ${activeClass}" 
								data-states='${JSON.stringify(tab.states)}' 
								style="background: none; border: none; border-bottom: 2px solid transparent; padding: 8px 4px 12px; font-size: 13px; font-weight: 600; color: var(--tp-text-muted); cursor: pointer; white-space: nowrap; transition: all 0.2s;"
								onmouseover="this.style.color='var(--tp-text)'"
								onmouseout="if(!this.classList.contains('is-active')) this.style.color='var(--tp-text-muted)'"
							>
								${tab.label}
							</button>
						`;
					});

					tabsHtml += `
							</div>
						</div>
					`;

					mainSection.prepend(tabsHtml);

					const styleId = "tp-trade-in-tabs-style";
					if (!document.getElementById(styleId)) {
						const style = document.createElement("style");
						style.id = styleId;
						style.innerHTML = `
							.tp-trade-in-tab.is-active {
								color: var(--tp-orange) !important;
								border-bottom-color: var(--tp-orange) !important;
							}
						`;
						document.head.appendChild(style);
					}

					mainSection.on("click", ".tp-trade-in-tab", function() {
						const btn = $(this);
						mainSection.find(".tp-trade-in-tab").removeClass("is-active");
						btn.addClass("is-active");
						
						const states = btn.data("states");
						const filterList = listview.filter_area.filter_list;
						if (filterList) {
							const toRemove = filterList.filters.filter(f => f.fieldname === 'workflow_state');
							toRemove.forEach(f => filterList.remove_filter(f.fieldname, f.condition, f.value));
							
							if (states && states.length) {
								if (states.length === 1) {
									filterList.add_filter(listview.doctype, "workflow_state", "=", states[0]);
								} else {
									filterList.add_filter(listview.doctype, "workflow_state", "in", states.join(","));
								}
							}
							listview.refresh();
						}
					});
				}

				listview.page.wrapper.on("draw", () => {
					const deviceNames = (listview.data || []).map(d => d.device).filter(Boolean);
					const uniqueDevices = [...new Set(deviceNames)];
					if (uniqueDevices.length) {
						frappe.call({
							method: "tecponto.dashboard.get_devices_thumbnails",
							args: { devices: uniqueDevices },
							callback: (r) => {
								if (r.message) {
									Object.keys(r.message).forEach(name => {
										const url = r.message[name];
										if (url) {
											listview.page.wrapper.find(`.tp-device-thumb-placeholder[data-device="${name}"]`).html(`
												<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" />
											`);
										}
									});
								}
							}
						});
					}
				});
			}
		};
		frappe.listview_settings.Customer = {
			...(frappe.listview_settings.Customer || {}),
			primary_action: openCustomerWizard,
		};
		frappe.listview_settings["Item"] = {
			...(frappe.listview_settings["Item"] || {}),
			primary_action: () => frappe.new_doc("Item"),
			add_fields: ["item_name", "item_group", "disabled", "is_stock_item", "stock_uom", "image"],
			get_indicator(doc) {
				return doc.disabled ? ["Inativo", "gray", "disabled,=,1"] : ["Ativo", "green", "disabled,=,0"];
			},
			formatters: {
				item_code(value, df, doc) {
					const imgUrl = doc.image || "/assets/tecponto/images/item_placeholder.svg";
					return `<div style="display: flex; align-items: center; gap: 8px;">
						<img src="${imgUrl}" class="tp-table-thumbnail" style="width: 32px; height: 32px; flex-shrink: 0;" />
						<div>
							<strong style="color: var(--tp-text);">${escapeHtml(doc.item_name || value)}</strong>
							<div style="font-size: 10px; color: var(--tp-text-muted);">SKU: ${escapeHtml(value)}</div>
						</div>
					</div>`;
				},
				stock_uom(value, df, doc) {
					return `<div class="tp-item-stock-placeholder" data-item="${doc.item_code}">--</div>`;
				}
			},
			onload(listview) {
				const side = listview.page.sidebar;
				if (side && !side.find(".tp-stock-banner-side").length) {
					side.append(`
						<div class="tp-stock-banner-side" style="margin-top: 20px; display: flex; flex-direction: column; gap: 16px;">
							<div style="background: rgba(255, 75, 0, 0.05); border: 1px solid var(--tp-border); border-radius: 12px; padding: 16px;">
								<h4 style="font-size: 12px; font-weight: 700; color: var(--tp-orange); margin-top: 0; margin-bottom: 8px;">Baixa automática ao usar em OS</h4>
								<p style="font-size: 11px; line-height: 1.4; color: var(--tp-text-muted); margin: 0; text-align: left;">Ao vincular um item a uma OS e concluir o serviço, o estoque é baixado automaticamente.</p>
							</div>
						</div>
					`);
				}

				listview.page.wrapper.on("draw", () => {
					const items = (listview.data || []).map(d => d.name);
					if (items.length) {
						frappe.call({
							method: "tecponto.dashboard.get_items_stock_status",
							args: { items: items },
							callback: (r) => {
								if (r.message) {
									Object.keys(r.message).forEach(code => {
										const status = r.message[code];
										const row = listview.page.wrapper.find(`.list-row[data-name="${code}"]`);
										if (row.length && status) {
											const stockCell = row.find(`.list-row-col[data-fieldname="stock_uom"]`);
											if (stockCell.length) {
												let badgeClass = "tp-badge-sem--success";
												if (status.situation === "Estoque baixo") badgeClass = "tp-badge-sem--warning";
												else if (status.situation === "Sem estoque") badgeClass = "tp-badge-sem--danger";
												else if (status.situation === "Serviço") badgeClass = "tp-badge-sem--purple";
												
												const stockText = status.actual_qty !== null ? `${status.actual_qty} un` : "--";
												const minText = status.minimum_stock !== null ? `${status.minimum_stock} un` : "--";
												
												stockCell.html(`
													<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%;">
														<span style="font-weight: 600; color: ${status.is_low ? 'var(--tp-red)' : 'var(--tp-text)'};">${stockText}</span>
														<span style="color: var(--tp-text-muted); font-size: 11px;">Mín: ${minText}</span>
														<span class="tp-badge-sem ${badgeClass}" style="padding: 2px 6px; font-size: 10px;">${status.situation}</span>
													</div>
												`);
											}
										}
									});
								}
							}
						});
					}
				});
			}
		};
		if (frappe.__tecponto_guided_creation || typeof frappe.new_doc !== "function") return;
		frappe.__tecponto_guided_creation = true;
		const nativeNewDoc = frappe.new_doc.bind(frappe);
		frappe.new_doc = (doctype, ...args) => {
			if (isTecPontoOperator() && doctype === "Repair Order") {
				openRepairIntakeWizard(args[0] || {});
				return;
			}
			if (isTecPontoOperator() && doctype === "Service Device") {
				openDeviceWizard();
				return;
			}
			if (isTecPontoOperator() && doctype === "Trade In Evaluation") {
				openTradeIntakeWizard();
				return;
			}
			if (isTecPontoOperator() && doctype === "Customer") {
				openCustomerWizard();
				return;
			}
			return nativeNewDoc(doctype, ...args);
		};
	}

	function installMobileSidebarBehavior() {
		if (frappe.__tecponto_mobile_sidebar) return;
		frappe.__tecponto_mobile_sidebar = true;
		const sync = (expanded) => {
			const isOpen =
				window.innerWidth < 768 &&
				(expanded ?? document.querySelector(".body-sidebar-container")?.classList.contains("expanded"));
			document.body.classList.toggle("tp-mobile-menu-open", Boolean(isOpen));
		};
		$(document).on("sidebar-expand.tecponto", (_event, data) => sync(Boolean(data?.sidebar_expand)));
		$(document).on("click.tecponto-overlay", ".body-sidebar-container.expanded .overlay", () => {
			if (window.innerWidth < 768) {
				closeMobileSidebar();
			}
		});
		window.addEventListener("resize", () => sync());
		sync();
	}

	function start() {
		if (!localStorage.getItem("tecponto_theme_v2")) {
			if (!localStorage.getItem("theme") || localStorage.getItem("theme") === "dark") {
				localStorage.setItem("theme", "light");
			}
			localStorage.setItem("tecponto_theme_v2", "1");
		}
		const syncTheme = () => {
			document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "light");
		};
		syncTheme();
		[150, 600, 1400].forEach((delay) => setTimeout(syncTheme, delay));

		redirectGenericDesk();
		installGuidedCreation();
		[250, 1000].forEach((delay) => setTimeout(installGuidedCreation, delay));
		installMobileSidebarBehavior();
		applyTecPontoShell();
		mountCommandCenter();
		[350, 1200].forEach((delay) => setTimeout(mountCommandCenter, delay));

		// Reinforce topbar every second to keep brand elements active
		setInterval(() => {
			enhanceTopbar();
		}, 1000);

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE) applyTecPontoShell(node);
				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });

		window.addEventListener("popstate", () => {
			redirectGenericDesk();
			updateActiveNavigation();
			mountCommandCenter();
		});
		frappe.router?.on?.("change", () => {
			redirectGenericDesk();
			window.requestAnimationFrame(() => {
				applyTecPontoShell();
				mountCommandCenter();
			});
		});
	}

	window.TecPontoUI = {
		icons: ICONS,
		escapeHtml,
		displayState,
		openCustomerWizard,
		openDeviceWizard,
		openRepairIntakeWizard,
		openTradeIntakeWizard,
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", start, { once: true });
	} else {
		start();
	}
})();
