frappe.pages["tecponto-reports"].on_page_load = (wrapper) => {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: __("Relatórios TecPonto"),
		single_column: true,
	});
};
