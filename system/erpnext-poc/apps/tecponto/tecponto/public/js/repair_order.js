frappe.ui.form.on("Repair Order", {
	setup(frm) {
		frm.set_query("device", () => ({
			filters: frm.doc.customer ? { customer: frm.doc.customer, active: 1 } : { active: 1 },
		}));
		frm.set_query("original_repair_order", () => ({
			filters: {
				workflow_state: "Entregue",
				customer: frm.doc.customer || "",
				device: frm.doc.device || "",
			},
		}));
	},

	refresh(frm) {
		apply_guided_repair_form(frm);
		const canAccessFinance =
			frappe.user.has_role("TecPonto Direcao") ||
			frappe.session.user === "Administrator";
		const canHandleStock =
			frappe.user.has_role("TecPonto Tecnico") ||
			frappe.user.has_role("TecPonto Gestor") ||
			frappe.user.has_role("TecPonto Direcao") ||
			frappe.session.user === "Administrator";

		if (
			canHandleStock &&
			["Aprovado", "Em reparo"].includes(frm.doc.workflow_state)
		) {
			frm.add_custom_button(__("Aguardar peça"), () => {
				frappe.prompt(
					[
						{
							fieldname: "waiting_part_details",
							fieldtype: "Small Text",
							label: "Qual peça ou impedimento?",
							reqd: 1,
						},
						{
							fieldname: "part_expected_at",
							fieldtype: "Datetime",
							label: "Previsão da peça",
							reqd: 1,
						},
					],
					(values) => moveWorkshopStage(frm, "Aguardando peca", values),
					"Aguardar peça",
					"Confirmar"
				);
			}, __("Oficina"));
		}

		if (canHandleStock && frm.doc.workflow_state === "Aguardando peca") {
			frm.add_custom_button(
				__("Retomar reparo"),
				() => moveWorkshopStage(frm, "Em reparo"),
				__("Oficina")
			);
		}

		if (
			canHandleStock &&
			["Aprovado", "Em reparo", "Em testes", "Pronto para retirada"].includes(
				frm.doc.workflow_state
			) &&
			has_pending_stock_parts(frm)
		) {
			frm.add_custom_button(__("Baixar peças do estoque"), () => {
				frappe.call({
					method: "tecponto.tecponto.doctype.repair_order.repair_order.consume_parts",
					args: { repair_order: frm.doc.name },
					freeze: true,
					freeze_message: __("Registrando consumo das peças..."),
					callback(response) {
						if (response.message?.name) {
							frappe.show_alert({
								message: __("Peças baixadas com rastreabilidade."),
								indicator: "green",
							});
							frm.reload_doc();
						}
					},
				});
			}, __("Oficina"));
		}

		if (frm.doc.parts_stock_entry && canHandleStock) {
			frm.add_custom_button(__("Abrir baixa de peças"), () => {
				frappe.set_route("Form", "Stock Entry", frm.doc.parts_stock_entry);
			}, __("Oficina"));
		}

		if (frm.doc.workflow_state === "Em testes" && !(frm.doc.tests || []).length) {
			frm.add_custom_button(__("Carregar checklist padrão"), () => {
				add_standard_tests(frm);
			}, __("Oficina"));
		}

		if (!frm.is_new() && frm.doc.workflow_state === "Entregue") {
			frm.add_custom_button(__("Abrir retorno em garantia"), () => {
				frappe.new_doc("Repair Order", {
					service_type: "Garantia",
					original_repair_order: frm.doc.name,
					customer: frm.doc.customer,
					device: frm.doc.device,
					channel: frm.doc.channel,
					priority: "Normal",
				});
			}, __("Pós-venda"));
		}

		if (
			canAccessFinance &&
			!frm.is_new() &&
			frm.doc.approval_status === "Aprovado" &&
			!frm.doc.sales_invoice
		) {
			frm.add_custom_button(__("Criar fatura de venda"), () => {
				frappe.call({
					method: "tecponto.tecponto.doctype.repair_order.repair_order.create_sales_invoice",
					args: { repair_order: frm.doc.name },
					freeze: true,
					freeze_message: __("Criando fatura..."),
					callback(response) {
						if (response.message?.name) {
							frm.reload_doc().then(() => {
								frappe.set_route("Form", "Sales Invoice", response.message.name);
							});
						}
					},
				});
			}, __("Financeiro"));
		}

		if (canAccessFinance && frm.doc.sales_invoice) {
			frm.add_custom_button(__("Abrir fatura"), () => {
				frappe.set_route("Form", "Sales Invoice", frm.doc.sales_invoice);
			}, __("Financeiro"));
		}
	},

	customer(frm) {
		if (frm.doc.device) {
			frm.set_value("device", null);
		}
	},
});

const REPAIR_SECTIONS = [
	"identification_section",
	"intake_section",
	"technical_section",
	"quote_section",
	"approval_section",
	"tests_section",
	"delivery_section",
];

const REPAIR_GUIDE = {
	"Em diagnostico": {
		visible: 4,
		message: "Agora: registre o diagnóstico e monte o orçamento para o cliente.",
	},
	"Aguardando aprovacao": {
		visible: 5,
		message: "Agora: confirme se o cliente aprovou ou recusou o orçamento.",
	},
	"Aprovado": {
		visible: 5,
		message: "Orçamento aprovado. Inicie o reparo quando o aparelho entrar na bancada.",
	},
	"Em reparo": {
		visible: 5,
		message: "Agora: execute o reparo e registre as peças e serviços utilizados.",
	},
	"Aguardando peca": {
		visible: 5,
		message: "Bloqueado por peça. A previsão e o impedimento precisam permanecer visíveis.",
	},
	"Em testes": {
		visible: 6,
		message: "Agora: conclua o checklist de testes antes de liberar o aparelho.",
	},
	"Pronto para retirada": {
		visible: 7,
		message: "Aparelho pronto. Avise o cliente e registre a entrega.",
	},
	"Entregue": {
		visible: 7,
		message: "Atendimento concluído. A garantia ficou registrada nesta ordem.",
		color: "green",
	},
	"Rejeitado": {
		visible: 5,
		message: "Orçamento recusado. Registre o encerramento deste atendimento.",
		color: "red",
	},
	"Cancelado": {
		visible: 7,
		message: "Atendimento cancelado.",
		color: "red",
	},
};

function apply_guided_repair_form(frm) {
	const guide = frm.is_new()
		? {
				visible: 2,
				message: "Comece aqui: identifique o cliente, o aparelho e o problema relatado.",
			}
		: REPAIR_GUIDE[frm.doc.workflow_state] || {
				visible: 2,
				message: "Próximo passo: encaminhe o aparelho para diagnóstico.",
			};

	REPAIR_SECTIONS.forEach((fieldname, index) => {
		frm.set_df_property(fieldname, "hidden", index >= guide.visible ? 1 : 0);
	});

	const canManage = frappe.user.has_role("TecPonto Gestor") || frappe.session.user === "Administrator";
	frm.set_df_property("tracking_section", "hidden", canManage ? 0 : 1);
	frm.set_df_property("administration_section", "hidden", canManage ? 0 : 1);
	frm.set_intro(__(guide.message), guide.color || "orange");
}

function has_pending_stock_parts(frm) {
	return (frm.doc.items || []).some(
		(row) => cint(row.is_stock_item) && flt(row.consumed_qty) < flt(row.qty)
	);
}

function moveWorkshopStage(frm, target_state, values = {}) {
	frappe.call({
		method: "tecponto.dashboard.move_repair_card",
		args: {
			repair_order: frm.doc.name,
			target_state,
			...values,
		},
		freeze: true,
		freeze_message: __("Atualizando a bancada..."),
		callback(response) {
			if (response.message?.workflow_state) frm.reload_doc();
		},
	});
}

function add_standard_tests(frm) {
	const tests = [
		"Ligamento",
		"Tela e toque",
		"Carregamento",
		"Câmeras",
		"Áudio e microfone",
		"Conectividade",
	];
	tests.forEach((test_name) => {
		const row = frm.add_child("tests");
		row.test_name = test_name;
		row.result = "Pendente";
	});
	frm.refresh_field("tests");
}

frappe.ui.form.on("Repair Order Item", {
	qty: update_line_amount,
	rate: update_line_amount,
});

function update_line_amount(frm, cdt, cdn) {
	const row = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "amount", flt(row.qty) * flt(row.rate));
	const total = (frm.doc.items || []).reduce((sum, item) => sum + flt(item.amount), 0);
	frm.set_value("estimated_total", total);
}
