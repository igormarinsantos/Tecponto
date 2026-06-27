frappe.ui.form.on("Trade In Evaluation", {
	setup(frm) {
		frm.set_query("device", () => ({
			filters: frm.doc.customer ? { customer: frm.doc.customer, active: 1 } : { active: 1 },
		}));
		frm.set_query("warehouse", () => ({
			filters: frm.doc.company ? { company: frm.doc.company, is_group: 0 } : { is_group: 0 },
		}));
	},

	refresh(frm) {
		apply_guided_trade_form(frm);
		const canCreateInventory =
			frappe.user.has_role("TecPonto Direcao") ||
			frappe.session.user === "Administrator";
		if (
			canCreateInventory &&
			["Aquisicao aprovada", "Em revisao", "Pronto para venda"].includes(
				frm.doc.workflow_state
			) &&
			!frm.doc.stock_entry
		) {
			frm.add_custom_button(__("Criar item e entrada do usado"), () => {
				frappe.call({
					method: "tecponto.tecponto.doctype.trade_in_evaluation.trade_in_evaluation.create_used_inventory",
					args: { trade_in_evaluation: frm.doc.name },
					freeze: true,
					freeze_message: __("Criando item, série e entrada de estoque..."),
					callback(response) {
						if (response.message?.name) frm.reload_doc();
					},
				});
			}, __("Aquisição"));
		}
		if (frm.doc.stock_entry) {
			frm.add_custom_button(__("Abrir entrada do usado"), () => {
				frappe.set_route("Form", "Stock Entry", frm.doc.stock_entry);
			}, __("Aquisição"));
		}

		if (
			flt(frm.doc.expected_resale_value) > 0 &&
			flt(frm.doc.expected_margin_percent) < flt(frm.doc.target_margin_percent)
		) {
			frm.dashboard.add_indicator(__("Margem abaixo da meta"), "orange");
		}
	},

	customer(frm) {
		if (frm.doc.device) frm.set_value("device", null);
	},

	expected_resale_value: update_values,
	refurbishment_cost: update_values,
	target_margin_percent: update_values,
	offered_value: update_values,
	desired_item_price: update_values,
});

const TRADE_SECTIONS = [
	"identification_section",
	"request_section",
	"technical_section",
	"commercial_section",
	"offer_section",
	"acquisition_section",
];

const TRADE_GUIDE = {
	"Avaliacao": {
		visible: 3,
		message: "Agora: faça o checklist técnico, confira o IMEI e registre o estado real.",
	},
	"Oferta pendente": {
		visible: 5,
		message: "Agora: revise os custos, a margem e prepare a oferta ao cliente.",
	},
	"Oferta apresentada": {
		visible: 5,
		message: "Aguardando a decisão do cliente sobre a oferta.",
	},
	"Oferta aceita": {
		visible: 6,
		message: "Oferta aceita. Confirme a aquisição antes de receber o aparelho.",
	},
	"Oferta recusada": {
		visible: 5,
		message: "Oferta recusada. Encerre a avaliação.",
		color: "red",
	},
	"Aquisicao aprovada": {
		visible: 6,
		message: "Agora: encaminhe o aparelho para revisão e preparação.",
	},
	"Em revisao": {
		visible: 6,
		message: "Agora: conclua a revisão antes de liberar o aparelho para venda.",
	},
	"Pronto para venda": {
		visible: 6,
		message: "Aparelho revisado e pronto para venda.",
		color: "green",
	},
	"Encerrado": {
		visible: 6,
		message: "Avaliação encerrada.",
		color: "green",
	},
};

function apply_guided_trade_form(frm) {
	const guide = frm.is_new()
		? {
				visible: 2,
				message: "Comece aqui: entenda o aparelho do cliente e o que ele procura na troca.",
			}
		: TRADE_GUIDE[frm.doc.workflow_state] || {
				visible: 2,
				message: "Próximo passo: encaminhe o aparelho para avaliação técnica.",
			};

	TRADE_SECTIONS.forEach((fieldname, index) => {
		frm.set_df_property(fieldname, "hidden", index >= guide.visible ? 1 : 0);
	});

	const canManage = frappe.user.has_role("TecPonto Gestor") || frappe.session.user === "Administrator";
	frm.set_df_property("administration_section", "hidden", canManage ? 0 : 1);
	frm.set_intro(__(guide.message), guide.color || "orange");
}

function update_values(frm) {
	const resale = flt(frm.doc.expected_resale_value);
	const margin = resale - flt(frm.doc.refurbishment_cost) - flt(frm.doc.offered_value);
	frm.set_value("expected_margin_value", margin);
	frm.set_value("expected_margin_percent", resale ? (margin / resale) * 100 : 0);
	frm.set_value("customer_difference", flt(frm.doc.desired_item_price) - flt(frm.doc.offered_value));
}
