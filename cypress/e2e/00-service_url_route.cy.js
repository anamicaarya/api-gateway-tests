const data = require('../fixtures/services/service_url.json')

describe("Kong Manager. Create Service then Route and verify via proxy", () => {
  before(() => {
    cy.load_workspace(data.workspace);
  });

  after(() => {
    cy.cleanupService(data.service_with_url.name);
  });

  it(`creates a Service "${data.service_with_url.name}" through the UI`, () => {
    cy.access_navigation_items('services');

    cy.uiCreateService(data.service_with_url);
    cy.apiGetServiceIfExists(data.service_with_url.name);
  });

  data.service_with_url.routes.forEach((route) => {
    it(`creates a Route for the Service through the UI with "Strip Path": ${route.strip_path}`, () => {
      cy.uiCreateRoute(route);
      cy.apiGetRouteIfExists(route.name);
    });

    it(`routes a request through the proxy to the upstream when "Strip Path": ${route.strip_path} should return ${route.response.status_code}`, () => {
      // assert for strip_path  = true
      cy.proxyRequest(route.resource, "GET", {limit: route?.limit}).then((res) => {
        if(res.status === 200){
          expect(res.status).to.eq(route.response.status_code);
          expect(res.body).to.include.keys('userId', 'id', 'title', 'completed');
          expect(res.body.id).to.eq(1);
          expect(res.headers).to.include.keys(route.response.headers.map(s => s.toLowerCase()));
          expect(res.headers['x-kong-request-id']).to.match(new RegExp('[a-zA-Z0-9]{32}'));
        }
        else{
          expect(res.status).to.eq(route.response.status_code);
        }
      });
    });
  });

  it('service base path "/todos" composes with stripped route "/mock"', () => {
    cy.access_navigation_items('services');
    cy.uiEditService(data.service_with_url.name, { path: '/todos' });
    cy.access_navigation_items('routes');
    cy.uiEditRoute(data.service_with_url.routes[0].name, { strip_path: true, path: '/mock' });

    cy.proxyRequest('/mock/1', {method: 'GET',  headers: {"content-type": "application/json"}}).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.eq(1);
    });
  });

  it('revert the service path back to "/"', () => {
    cy.access_navigation_items('services');
    cy.uiEditService(data.service_with_url.name, { path: '/' });

    cy.proxyRequest('/mock/todos/1', {method: 'GET',  headers: {"content-type": "application/json"}, limit: 20}).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.eq(1);
    });
  });

  it('update route to support only "POST" and verifies the "no route error" for "GET"', () => {
    cy.access_navigation_items('routes');
    cy.uiEditRoute(data.service_with_url.routes[0].name, {methods: ['POST'] });

    cy.proxyRequest('/mock/todos/1', {method: 'GET',  headers: {"content-type": "application/json"}, expected_code: 404}).then((res) => {
      expect(res.status).to.eq(404);  
      expect(res.body.message).to.be.eq('no Route matched with those values');
      expect(res.headers['x-kong-request-id']).to.match(new RegExp('[a-zA-Z0-9]{32}'));
    });
  });
});