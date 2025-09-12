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
import { sel } from "./selectors";
import {adminGet, adminPost, adminDelete, adminPatch} from "./api";
Cypress.Commands.add('navigates_to_page', (url, match_end_points) => {
  cy.visit(url);
  cy.url().should('match', new RegExp(`\/${match_end_points}`));
})

Cypress.Commands.add('notificationMessage', (message, timeout=10000) => {
  // cy.contains('p.toaster-message', new RegExp(esc(message)))
  cy.get(sel.toasterMessage)
    .invoke('text')
    .should('match', new RegExp(message));

  cy.get('[data-testid="toaster-close-icon"]').click();
  
})

Cypress.Commands.add('interceptRequest', (options = {}) => {
  const base = options.base || '**'; // to match anything but endpoint/s

  function alias(method, url, name) {
    return cy.intercept({ method: method, url: url }).as(name);
  }

  // Services: create and update only
  alias('POST', `${base}/services`, 'create_service');
  alias('PATCH', `${base}/services/*`, 'update_service');

  // Routes: create and update only
  alias('POST', `${base}/routes`, 'create_route');
  alias('PATCH', `${base}/routes/*`, 'update_route');

  // plugins: create and update only
  alias('POST', `${base}/plugins`, 'create_plugin');
  alias('PATCH', `${base}/plugins/*`, 'update_plugin');

  // consumers: create and update only
  alias('POST', `${base}/consumers`, 'create_consumer');
  alias('PATCH', `${base}/consumers/*`, 'update_consumer');

  // credentials: create and update only
  alias('POST', `${base}/key-auth`, 'create_credential');
  alias('PATCH', `${base}/key-auth/*`, 'update_credential');

    // Return a alias map. Will add more intercepts later
  const waitables = {
    service: {
      create: '@create_service',
      update: '@update_service',
    },
    route: {
      create: '@create_route',
      update: '@update_route',
    },
    plugin: {
      create: '@create_plugin',
      update: '@update_plugin',
    },
    consumer: {
      create: '@create_consumer',
      update: '@update_consumer',
    },
    credential: {
      create: '@create_credential',
      update: '@update_credential',
    },
  };

  return cy.wrap(waitables);
})

Cypress.Commands.add('genericInterceptRequest', (group, action, selector, success_message) => {
  cy.interceptRequest()
    .then((api) => {
      cy.get(selector).click();

      cy.wait(api[`${group}`][`${action}`])
        .then((interception) => {
          cy.task('log', `${action}_${group}: ${JSON.stringify(interception)}`);
          expect(interception.response.statusCode).to.be.oneOf([200, 201, 409]);
        })

      cy.get(sel.formError).should('not.exist');
      cy.notificationMessage(success_message);
  })
})


Cypress.Commands.add('verify_kong_loading', () => {
  cy.get('div.loading-container').should('not.exist');
})

Cypress.Commands.add('access_navigation_items', (nav_item) => {
  switch(nav_item){
  case 'services':
      cy.get(sel.sidebar.services).click();
    break;
  case 'routes':
      cy.get(sel.sidebar.routes).click();
    break;
  case 'plugins':
      cy.get(sel.sidebar.plugins).click();
    break;
  case 'consumers':
      cy.get(sel.sidebar.consumers).click();
    break;
  default:
    break;
  }
  cy.url().should('match', new RegExp(`\/${nav_item}`));
})

Cypress.Commands.add('access_root_resources', (root, nav_item) => {
  switch(nav_item){
  case 'routes':
      cy.get(sel.interiorSidebar.routes(root)).click();
    break;
  case 'plugins':
      cy.get(sel.interiorSidebar.plugins(root)).click();
    break;
  case 'credentials':
      cy.get(sel.interiorSidebar.credentials(root)).click();
    break;
  default:
    break;
  }
  cy.url().should('match', new RegExp(`\/${nav_item}`));
})

Cypress.Commands.add('load_workspace', (workspace) => {
  cy.navigates_to_page(`${Cypress.config('baseUrl')}${workspace}`, workspace);
  cy.verify_kong_loading();
})

Cypress.Commands.add('setCheckbox', (selector, shouldBeChecked) => {
  cy.get(selector).then(($el) => {
    const isChecked = $el.is(':checked');
    if (shouldBeChecked !== isChecked) {
      cy.wrap($el).click();
    }
    cy.wrap($el).should(shouldBeChecked ? 'be.checked' : 'not.be.checked');
  });
});

// the buttons data-testid for entities/resources are different when created first time than others 
Cypress.Commands.add('use_right_entity_button', (entity, entity_text) => {
  cy.wait(1000)  // strategic wait to ensure resource form loads fine
  cy.get('body').then((body) => {
    if (body.find('[data-testid="empty-state-action"]').length > 0) {
      cy.get('[data-testid="empty-state-action"]')
        .contains(entity_text)
        .click();
    }
    else{
      cy.get(`[data-testid="toolbar-add-${entity}"]`).click();
    }
  })
})

Cypress.Commands.add('getNewServiceButton', () => {
  cy.wait(1000)  // strategic wait to ensure resource form loads fine
  cy.isSelectorPresent(sel.services.newButtonToolbar)
    .then((isPresent) => {
      if(isPresent){
        cy.get(sel.services.newButtonToolbar).click();
      }
      else{
        sel.services.createNewButton().click();
      }
  });
});

Cypress.Commands.add('getNewRouteButton', () => {
  cy.wait(1000)  // strategic wait to ensure resource form loads fine
  cy.isSelectorPresent(sel.routes.newButtonToolbar)
    .then((isPresent) => {
      if(isPresent){
        cy.get(sel.routes.newButtonToolbar).click();
      }
      else{
        sel.routes.createNewButton().click();
      }
  });
});

Cypress.Commands.add('getNewPluginButton', () => {
  cy.wait(1000)  // strategic wait to ensure resource form loads fine
  cy.isSelectorPresent(sel.plugins.newButtonToolbar)
    .then((isPresent) => {
      if(isPresent){
        cy.get(sel.plugins.newButtonToolbar).click();
      }
      else{
        sel.plugins.createNewButton().click();
      }
  });
});

Cypress.Commands.add('getNewConsumerButton', () => {
  cy.wait(1000)  // strategic wait to ensure resource form loads fine
  cy.isSelectorPresent(sel.consumers.newButtonToolbar)
    .then((isPresent) => {
      if(isPresent){
        cy.get(sel.consumers.newButtonToolbar).click();
      }
      else{
        sel.consumers.createNewButton().click();
      }
  });
});

Cypress.Commands.add('getNewConsumerCredentialsButton', () => {
  cy.wait(1000)  // strategic wait to ensure resource form loads fine
  cy.isSelectorPresent(sel.credentials.newButtonToolbar)
    .then((isPresent) => {
      if(isPresent){
        cy.get(sel.credentials.newButtonToolbar).click();
      }
      else{
        sel.credentials.createNewButton().click();
      }
  });
});

Cypress.Commands.add('isSelectorPresent', (selector) => {
  cy.get('body').then(($body) => {
    return $body.find(selector).length > 0;
  });
});

Cypress.Commands.add('clearAndType', (selector, value) => {
  cy.get(selector)
    .clear()
    .type(value)
    .should('have.value',value);
});

Cypress.Commands.add("apiGetServiceIfExists", (name) => {
  adminGet(`/services/${name}`).its("status").should("eq", 200);
});

Cypress.Commands.add("apiGetRouteIfExists", (name) => {
  adminGet(`/routes/${name}`).its("status").should("eq", 200);
});

Cypress.Commands.add("apiGetPluginIfExists", (name) => {
  adminGet(`/schemas/plugins/${name}`).its("status").should("eq", 200);
});

Cypress.Commands.add("apiGetConsumerIfExists", (name) => {
  adminGet(`/consumers/${name}`).its("status").should("eq", 200);
});

Cypress.Commands.add("proxyRequest", (path, options = {}) => {
  const url = `${Cypress.env("kong_proxy_url")}${path}`;
  let limit = options?.limit? options.limit : 10;
  let delay = 1000;
  let expected_code = options?.expected_code? options.expected_code : 200;
  let allowed_status_codes = options?.allowed_status_codes? options.allowed_status_codes : [200, 404];

  function attempt(triesLeft) {
    let params = {
      url: url,
      method: options?.method? options.method: 'GET',
      body: options?.body? options.body: {},
      headers: options?.headers? options.headers: {},
      failOnStatusCode: options?.failOnStatusCode? options.failOnStatusCode: false,
    };
    cy.log(params)
    return cy.request(params).then((res) => {
      expect(res.status).to.be.oneOf(allowed_status_codes);

      if (res.status === expected_code || triesLeft <= 1) {
        // Success or last attempt, yield the response
        return cy.wrap(res);
      }

      // Wait, then try again
      return cy.wait(delay).then(() => attempt(triesLeft - 1));
    });
  }

  // Start the polling chain
  return attempt(limit);
});

Cypress.Commands.add("cleanupService", (name) => {
  // Delete routes first, then the service
  adminGet(`/services/${name}/routes`).then((res) => {
    if (res.status === 200 && Array.isArray(res.body.data)) {
      res.body.data.forEach((r) => adminDelete(`/routes/${r.id}`));
    }
  }).then(() => adminDelete(`/services/${name}`));

  // Delete consumers
  adminGet(`/consumers/`).then((res) => {
    if (res.status === 200 && Array.isArray(res.body.data)) {
      res.body.data.forEach((c) => adminDelete(`/consumers/${c.id}`));
    }
  });
});