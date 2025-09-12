import { sel } from "../selectors";
Cypress.Commands.add('uiCreateService', (service) => {
  cy.getNewServiceButton();

  if(service.name){
    cy.clearAndType(sel.serviceForm.name, service.name);
  }
  if(service.mode != undefined){
    cy.get(sel.services.manual).click();
    if (service.protocol) {
      cy.get(sel.serviceForm.protocol).click();
      cy.get(`[data-testid="select-item-${service.protocol}"]`).click()
    }

    if(service.host) {
      cy.clearAndType(sel.serviceForm.host, service.host);
    }

    if(service.port) {
      cy.get(sel.serviceForm.port)
        .clear().clear().type(service.port).should('have.value', service.port);
    }
  }
  else{
    if(service.url){
      cy.clearAndType(sel.serviceForm.url, service.url);
    }
  }

  if(service.name){
    cy.clearAndType(sel.serviceForm.name, service.name);
  }

  cy.genericInterceptRequest('service', 'create', sel.serviceForm.save, `Gateway Service "${service.name}" successfully created!`);
})

Cypress.Commands.add('uiEditService', (service_name, options = {}) => {
  cy.get(sel.services.selectServiceRow(service_name)).find(sel.services.actionsButton).click();
  cy.get(sel.routes.editButton).click();

  if(options.name != null){
    cy.clearAndType(sel.serviceForm.name, options.name)
  }

  if(options.path != null){
    cy.clearAndType(sel.serviceForm.path, options.path)
  }

  if (options.url != null) {
    cy.clearAndType(sel.serviceForm.url, options.url);
  }

  // if (options.protocol != null) {
  //   setProtocol(sel.serviceForm.protocol, options.protocol);
  // }

  if (options.host != null) {
    cy.clearAndType(sel.serviceForm.host, options.host);
  }

  // if (options.port != null) {
  //   clearAndType(sel.serviceForm.port, options.port);
  // }

  cy.genericInterceptRequest('service', 'update' , sel.serviceForm.editSave,`Gateway Service "${service_name}" successfully updated!`);
})
