// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('navigates_to_page', (url, match_end_points) => {
  cy.visit(url)
  cy.url().should('match', new RegExp(`\/${match_end_points}`))	
})

Cypress.Commands.add('notification_message', (message, timeout=10000) => {
  // cy.contains('p.toaster-message', new RegExp(esc(message)))
  cy.get('p.toaster-message')
    .invoke('text')
    .should('match', new RegExp(message))

  cy.get('[data-testid="toaster-close-icon"]').click()
  
})

Cypress.Commands.add('service_intercept_request', (delay_wait = 5000) => {
  cy.intercept(
    {
      method: 'POST', // Route all POST requests
      url: '**/services', // URL matches '/services'
    }
  ).as('create_service')
  
  // can add more endpoints (e.g Validate etc)

  return cy.wrap({
  	create: '@create_service'
  })  
})

Cypress.Commands.add('verify_kong_loading', () => {
  cy.get('div.loading-container').should('not.exist')
})

Cypress.Commands.add('access_navigation_items', (item) => {
  cy.get(`[data-testid="sidebar-item-${item}"]`).click()
})

// the buttons data-testid for entities/resources are different when created first time than others 
Cypress.Commands.add('use_right_entity_button', (entity, entity_text) => {
  cy.wait(1000)
  cy.get('body').then((body) => {
    if (body.find('[data-testid="empty-state-action"]').length > 0) {
      cy.get('[data-testid="empty-state-action"]')
        .contains(entity_text)
        .click()
    }
    else{
      cy.get(`[data-testid="toolbar-add-${entity}"]`).click()
    }
  })
})

// service/route/plugin/consumer creation and notification message
Cypress.Commands.add('create_resource_and_verify_success_message', (entity, message) => {
  cy.get(`[data-testid="${entity}-create-form-submit"]`).click()
  cy.notification_message(message)
})