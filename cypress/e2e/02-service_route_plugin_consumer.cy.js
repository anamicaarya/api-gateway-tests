const data = require('../fixtures/services/service_route_plugin_consumer.json');
const workspace = data.workspace??Cypress.env('default_workspace1');
const service = data.service;
const route = data.service.route;
describe("Kong Manager. Create Service->Route->Plugin->Consumer and verify via proxy", () => {
  before(() => {
    cy.load_workspace(workspace);
  });

  after(() => {
    cy.cleanupService(service.name);
  });

  it(`creates a Service "${service.name}" and a "${route.name}"`, () => {
    cy.access_navigation_items('services');

    cy.uiCreateService(service);
    cy.apiGetServiceIfExists(service.name);
    cy.uiCreateRoute(route);
    cy.apiGetRouteIfExists(route.name);
  });

  it(`creates a Plugin "${service.plugin.name}"`, () => {
    cy.access_root_resources('service', 'plugins');
    cy.uiCreatePlugin(service.plugin);
    cy.apiGetPluginIfExists(service.plugin.name);
  });
  
  it(`verify that request asks for "api-key" should return ${route.test.response.status_code}`, () => {
    cy.proxyRequest(route.resource, route.test.options).then((res) => {
      expect(res.status).to.eq(route.test.response.status_code);
      expect(res.body.message).to.eq(route.test.response.message);
      expect(res.body.request_id).to.match(new RegExp('[a-zA-Z0-9]{32}'));
    });
  });

  it(`creates a consumer "${data.consumer.username}"`, () => {
    cy.access_navigation_items('consumers');
    cy.uiCreateConsumer(data.consumer);
    cy.apiGetConsumerIfExists(data.consumer.username);
    cy.uiCreateConsumerCredential(data.consumer);
  });

  it(`verify that request after providing "api-key" should return ${route.test_with_apikey.response.status_code}`, () => {
    cy.proxyRequest(route.resource, route.test_with_apikey.options).then((res) => {
      expect(res.status).to.eq(route.test_with_apikey.response.status_code);
      expect(res.body).to.include.keys('userId', 'id', 'title', 'completed');
      expect(res.body.id).to.eq(1);
      expect(res.headers).to.include.keys(route.test_with_apikey.response.headers.map(s => s.toLowerCase()));
      expect(res.headers['x-kong-request-id']).to.match(new RegExp('[a-zA-Z0-9]{32}'));
    });
  });

  it(`verify that request after providing "api-key" should return ${route.test_with_wrong_apikey.response.status_code}`, () => {
    cy.proxyRequest(route.resource, route.test_with_wrong_apikey.options).then((res) => {
      expect(res.status).to.eq(route.test_with_wrong_apikey.response.status_code);
      expect(res.body.message).to.eq(route.test_with_wrong_apikey.response.message);
      expect(res.body.request_id).to.match(new RegExp('[a-zA-Z0-9]{32}'));
    });
  });
});