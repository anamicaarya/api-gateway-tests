import { sel } from "../selectors";
Cypress.Commands.add('uiCreateRoute', (route) => {
  if(route){
    cy.getNewRouteButton();
    if(route.name){
      cy.clearAndType(sel.routeForm.name, route.name);
    }
    cy.extractCommonRouteForm(route);
    cy.genericInterceptRequest('route', 'create', sel.routeForm.save, `Route "${route.name}" successfully created!`);
  }
})

Cypress.Commands.add('uiEditRoute', (route_name, options = {}) => {
  if(route_name){
    cy.get(sel.routes.selectRouteRow(route_name)).find(sel.routes.actionsButton).click();
    cy.get(sel.routes.editButton)
      .filter(':visible')
      .eq(0)
      .scrollIntoView()
      .click();

    if(options.name != null){
      cy.clearAndType(sel.routeForm.edit_name, options.name);
    }

    cy.extractCommonRouteForm(options, false);
    cy.genericInterceptRequest('route', 'update', sel.routeForm.editSave, `Route "${route_name}" successfully updated!`);
  }
})

Cypress.Commands.add('extractCommonRouteForm', (options, create = true) => {
  if(options.path){
    cy.clearAndType(sel.routeForm.path, options.path);
  }

  if(options.host){
    cy.clearAndType(sel.routeForm.host, options.host);
  }

  if(options.methods){
    const multiselect_list = sel.routeForm.multiSelectTrigger;
    if(!create){
      cy.get(sel.routeForm.multiSelectItemdropDown).click();
      cy.get(sel.routeForm.multiSelectItemClear).click();
    }
    cy.get(multiselect_list).click();
    cy.wrap(options.methods).each((method) => {
      cy.get(sel.routeForm.multiSelectItem(method)).click();
    })

    cy.get('body').click(0, 0);
    cy.get(sel.routeForm.multiSelectItems)
      .then((methods) => {
        cy.log(methods)
      })
  }

  if(options?.strip_path !== undefined){
    cy.setCheckbox(sel.routeForm.stripPath, options.strip_path);
  }
})