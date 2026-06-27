frappe.pages["tecponto-sales"].on_page_load = (wrapper) => {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: __("Vendas e acessórios"),
		single_column: true,
	});
};
