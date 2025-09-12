const data = require('../fixtures/services/service_host.json')

describe("Kong Manager. Create Service with advance mode then Route with host and verify via proxy", () => {
  before(() => {
    cy.load_workspace(data.workspace);
  });

  after(() => {
    cy.cleanupService(data.service.name);
  });

  it(`creates a Service "${data.service.name}" through the UI`, () => {
    cy.access_navigation_items('services');
    cy.uiCreateService(data.service);
    cy.apiGetServiceIfExists(data.service.name);
  });

  data.service.routes.forEach((route) => {
    it(`creates a Route for the Service through the UI with "Strip Path": ${route.strip_path}`, () => {
      cy.uiCreateRoute(route);
      cy.apiGetRouteIfExists(route.name);
    });

    route.tests.forEach((test) => {
      it(`verifies request through the proxy with host header "${test.host_option}" should return ${test.response.status_code}`, () => {
        // assert for strip_path  = true
        cy.proxyRequest(route.resource, test.options).then((res) => {
          if(res.status === 200){
            expect(res.status).to.eq(test.response.status_code);
            expect(res.body).to.include.keys('userId', 'id', 'title', 'completed');
            expect(res.body.id).to.eq(1);
            expect(res.headers).to.include.keys(test.response.headers.map(s => s.toLowerCase()));
            expect(res.headers['x-kong-request-id']).to.match(new RegExp('[a-zA-Z0-9]{32}'));
          }
          else{
            expect(res.status).to.eq(test.response.status_code);
            expect(res.body.message).to.eq(test.response.message);
            expect(res.body.request_id).to.match(new RegExp('[a-zA-Z0-9]{32}'));
          }
        });
      });
    });
  });
});