Cypress.Commands.add('add_route_ui', (service) => {
  if(service.route){
    cy.get('button.k-button')
      .contains('Add a Route')
      .should('exist')
      .click()

    if(service.route.config_type === 'advanced'){
      // implement later
    }
    else{
      cy.get('[data-testid="route-form-name"]')
        .type(service.route.name)
        .should('have.value', service.route.name)

      cy.get('[data-testid="route-form-paths-input-1"]')
        .type(service.route.path)
        .should('have.value', service.route.path)

      if(service.route.methods){
        const multiselect_list = '[data-testid="multiselect-trigger"]'
        cy.get(multiselect_list).click()
        cy.wrap(service.route.methods).each((method, index) => {
          cy.get(`[data-testid="multiselect-item-${method}"]`).click()
        })
        cy.get('body').click(0, 0)
      }
    }
    cy.create_resource_and_verify_success_message('route', `Route "${service.route.name}" successfully created!`)
  }
})