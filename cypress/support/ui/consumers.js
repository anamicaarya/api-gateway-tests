Cypress.Commands.add('create_consumer_ui', (consumer) => {
  cy.use_right_entity_button(consumer.entity??'consumer', consumer.entity_text??'New Consumer')

  cy.get('[data-testid="consumer-form-username"]')  
    .type(consumer.username)
    .should('have.value', consumer.username)

   cy.get('[data-testid="consumer-form-custom-id"]')  
    .type(consumer.custom_id)
    .should('have.value', consumer.custom_id)

  cy.create_resource_and_verify_success_message('consumer', `Consumer "${consumer.username}" successfully created!`)
})

Cypress.Commands.add('add_consumer_credential', (consumer) => {
  cy.use_right_entity_button(consumer.entity??'credential', consumer.entity_text??'New Key Auth Credential')

  cy.get('[id="key"]')
    .type(consumer.credentials.key)
    .should('have.value', consumer.credentials.key)

  cy.create_resource_and_verify_success_message('plugin', `Key Auth Credential "\\S{36}" successfully created!`)
})

// this is to access groups, credentials, plugins forms for consumers
Cypress.Commands.add('access_consumer_resources', (consumer, which_resource, visit_consumer = true) => {
  if(visit_consumer){
    cy.get(`[data-testid="${consumer.username}"]`).click()
  }
  cy.get('[data-testid="vtab-container"]').should('exist')
  cy.get(`[data-testid="consumer-${which_resource}"]`).click()
})