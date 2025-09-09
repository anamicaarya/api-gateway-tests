Cypress.Commands.add('add_plugin_ui', (service) => {
  if(service.plugin){
    cy.use_right_entity_button(service.plugin.entity??'plugin', service.plugin.entity_text??'New plugin')
    
    cy.get(`[data-testid="${service.plugin.type}"]`).click()

    if(service.plugin.scoped){
      cy.get('label.k-label.Scoped-check>input')
        .should('be.disabled')
        .should('have.value', 1)
    }

    cy.get('input[id="service-id"]')
      .should('be.disabled')

    cy.get('input[id="route-id"]')  
      .type(service.plugin.route)

    cy.get('div.select-item-container')
      .contains(service.plugin.route)
      .click()

    cy.create_resource_and_verify_success_message('plugin', `Plugin "${service.plugin.name}" successfully created!`)
  }
})