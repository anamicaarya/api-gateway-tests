Cypress.Commands.add('create_service_ui', (service) => {
  cy.use_right_entity_button(service.entity??'gateway-service', service.entity_text??'New gateway service')

  if(service.mode){
    // implement advance mode later
  }
  else{
    cy.log('create service in default mode')
    cy.get('[data-testid="gateway-service-url-input"]')
      .clear()
      .type(service.url)
      .should('have.value', service.url)

    cy.get('[data-testid="gateway-service-name-input"]')
      .clear()
      .type(service.name)
      .should('have.value', service.name)

    cy.service_intercept_request()
      .then(({create}) => {
        cy.get('[data-testid="service-create-form-submit"]')
          .click()

        cy.wait(create)
          .then((interception) => {
            cy.task('log', `create_service: ${JSON.stringify(interception)}`)
            expect(interception.response.statusCode).to.be.oneOf([200, 201, 409])
          })

        cy.get('[data-testid="form-error"]').should('not.exist')
        cy.notification_message(`Gateway Service "${service.name}" successfully created!`)
    })
  }
})

// this is to access routes, plugins or documents from services
Cypress.Commands.add('access_services_resources', (service, which_resource, visit_service = true) => {
  if(visit_service){
    cy.get(`[data-testid="${service.name}"]`).click()
  }
  cy.get('[data-testid="vtab-container"]').should('exist')
  cy.get(`[data-testid="service-${which_resource}"]`).click()
})
