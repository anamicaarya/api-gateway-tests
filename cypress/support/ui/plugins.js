import { sel } from "../selectors";
Cypress.Commands.add('uiCreatePlugin', (plugin) => {
  if(plugin){
    cy.getNewPluginButton();
    cy.get(sel.plugins.selectPluginType(plugin.plugin_card)).click();

    if(plugin.scoped){
      cy.get(sel.pluginForm.scopedRadio)
        .should('be.disabled')
        .should('have.value', 1)
    }

    cy.get(sel.pluginForm.serviceName)
      .should('be.disabled')

    cy.get(sel.pluginForm.routeName)
      .type(plugin.route)

    cy.get(sel.pluginForm.routeNamesContainer)
      .contains(plugin.route)
      .click()

    cy.genericInterceptRequest('plugin', 'create', sel.pluginForm.save, `Plugin "${plugin.name}" successfully created!`);
  }
})