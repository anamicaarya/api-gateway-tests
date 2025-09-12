import { sel } from "../selectors";
Cypress.Commands.add('uiCreateConsumer', (consumer) => {
  if(consumer){
    cy.getNewConsumerButton();
    cy.clearAndType(sel.consumerForm.username, consumer.username);
    cy.clearAndType(sel.consumerForm.custom_id, consumer.custom_id);

    cy.genericInterceptRequest('consumer', 'create', sel.consumerForm.save, `Consumer "${consumer.username}" successfully created!`);
  }
})

Cypress.Commands.add('uiCreateConsumerCredential', (consumer) => {
  if(consumer){
    cy.access_root_resources('consumer', 'credentials');
    cy.getNewConsumerCredentialsButton();
    cy.clearAndType(sel.credentialForm.key, consumer.credentials.key);

    cy.genericInterceptRequest('credential', 'create', sel.credentialForm.save, `Key Auth Credential "\\S{36}" successfully created!`);
  }
})