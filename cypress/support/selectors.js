// cypress/support/selectors.js
// Centralized, readable selectors for Kong Manager. 
// Prefer data-testid. Fall back to role/text when needed.

export const sel = {
  // Navigation
  sidebar: {
    services: "[data-testid=sidebar-item-gateway-services]",
    routes: "[data-testid=sidebar-item-routes]",
    plugins: "[data-testid=sidebar-item-plugins]",
    consumers: "[data-testid=sidebar-item-consumers]"
  },

  interiorSidebar: {
    routes: (item) =>`[data-testid="${item}-routes"]`,
    plugins: (item) =>`[data-testid="${item}-plugins"]`,
    credentials: (item) => `[data-testid="${item}-credentials"]`
  },

  // Generic UI feedback
  formError: "[data-testid=form-error]",
  toasterMessage: "p.toaster-message",
  toast: {
    success: "[data-testid=notification-success]",
    error: "[data-testid=notification-error]"
  },
  modals: {
    dialog: "[role=dialog]",
    confirmButton: "[data-testid=confirm]",
    cancelButton: "[data-testid=cancel]"
  },

  // Services list page
  services: {
    selectServiceRow: (name) => `tr[data-testid=${name}]`,
    createNewButton: () => cy.contains('a.k-button', /New gateway service/),
    tableRowByName: (name) => `tr:has(td:contains("${name}"))`,
    // rowActionMenuByName: (name) => `tr:has(td:contains("${name}")) [data-testid=row-actions]`
    newButtonToolbar: "[data-testid=toolbar-add-service]",
    createButton: "[data-testid=create-service]",
    editButton: "[data-testid=action-entity-edit]",
    actionsButton: "[data-testid=actions]",
    table: "[data-testid=kong-ui-entities-services-list]",
    manual: "[data-testid=gateway-service-protocol-radio-label]"
  },

  // Create / Edit Service form
  serviceForm: {
    name: "[data-testid=gateway-service-name-input]",
    url: "[data-testid=gateway-service-url-input]",
    protocol: "[data-testid=gateway-service-protocol-select]",
    host: "[data-testid=gateway-service-host-input]",
    port: "[data-testid=gateway-service-port-input]",
    path: "[data-testid=gateway-service-path-input]",

    // create/edit Actions
    save: "[data-testid=service-create-form-submit]",
    editSave: "[data-testid=service-edit-form-submit]"
  },

  // Routes list within a Service
  routes: {
    selectRouteRow: (name) => `tr[data-testid=${name}]`,
    createNewButton: () => cy.contains('button.k-button', /Add a Route|New Route/),
    newButtonToolbar: "[data-testid=toolbar-add-route]",
    actionsButton: "[data-testid=actions]",
    editButton: "[data-testid=action-entity-edit]",
    list: "[data-testid=kong-ui-entities-routes-list]",
    editButton: "[data-testid=action-entity-edit]"
    // [data-testid="toolbar-add-route"]
  },

  // Create / Edit Route form
  routeForm: {
    name: "[data-testid=route-form-name]",
    service: "[data-testid=route-form-service-id]",
    tags: "[data-testid=route-form-tags]",

    // Configuration type
    configTypeBasic: "[data-testid=route-form-config-type-basic]",
    configTypeAdvanced: "[data-testid=route-form-config-type-advanced]",

    // Routing rules
    path: "[data-testid=route-form-paths-input-1]",
    stripPath: "[data-testid=route-form-strip-path]",
    methods: "[data-testid=route-form-methods]",
    host: "[data-testid=route-form-hosts-input-1]",

    // create/edit Actions
    save: "[data-testid=route-create-form-submit]",
    editSave: "[data-testid=route-edit-form-submit]",
    cancel: "[data-testid=route-edit-form-cancel]",

    //Dropdown
    multiSelectItem: (method) => `[data-testid=multiselect-item-${method}]`,
    multiSelectTrigger:"[data-testid=multiselect-trigger]",
    multiSelectItemClear: "[data-testid=multiselect-clear-icon]",
    multiSelectItemdropDown: "div.multiselect-icons-container",
    multiSelectItemDismissButton: "[data-testid=badge-dismiss-button]",
    multiSelectItems: 'div[data-testid="selection-badges-container"]'
  },

  // Plugin
  plugins: {
    selectPluginType: (name) => `[data-testid="${name}"]`,
    createNewButton: () => cy.contains('a.k-button', /New plugin/),
    newButtonToolbar: "[data-testid=toolbar-add-plugin]"
  },

  // Create / Edit Plugin form
  pluginForm: {
    scopedRadio: "label.k-label.Scoped-check>input",
    serviceName: "input[id=service-id]",
    routeName: "input[id=route-id]",
    routeNamesContainer: "div.select-item-container",
    // create/edit Actions
    save: "[data-testid=plugin-create-form-submit]",
    editSave: "[data-testid=plugin-edit-form-submit]",
    cancel: "[data-testid=plugin-edit-form-cancel]"
  },

  // Consumer
  consumers: {
    selectPluginType: (name) => `[data-testid="${name}"]`,
    createNewButton: () => cy.contains('a.k-button', /New Consumer/),
    newButtonToolbar: "[data-testid=toolbar-add-consumer]"
  },

  // Create / Edit Consumer form
  consumerForm: {
    username: "[data-testid=consumer-form-username]",
    custom_id: "[data-testid=consumer-form-custom-id]",
    // create/edit Actions
    save: "[data-testid=consumer-create-form-submit]",
    editSave: "[data-testid=consumer-edit-form-submit]",
    cancel: "[data-testid=consumer-edit-form-cancel]"
  },

  // Credential
  credentials: {
    createNewButton: () => cy.contains('a.k-button', / New Key Auth Credential/),
    newButtonToolbar: "[data-testid=toolbar-add-credential]"
  },

  // Create / Edit Consumer form
  credentialForm: {
    key: "[id=key]",
    // create/edit Actions
    save: "[data-testid=plugin-create-form-submit]",
  }
};
