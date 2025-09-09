const data = require('../fixtures/services/resources.json')
describe('verify services/resources end-points', () => {
  context(`list all resources from the default workplace`, () => {
    const workspace = data.workspace ?? Cypress.env('default_workspace')
    it('verifies all services', () => {
      cy.list_services(workspace)
        .then((services) => {
          expect(services).to.have.length(data.services.length)
          services.forEach((service, index) => {
            expect(service.id).to.not.be.empty
            expect(service.name).to.eq(data.services[index].name)
            expect(service.host).to.eq(data.services[index].host)
            expect(service.port).to.eq(data.services[index].port)
            expect(service.enabled).to.eq(data.services[index].enabled)
          })
        })
    })

    it('verifies all routes', () => {
      cy.list_routes(workspace)
        .then((routes) => {
          expect(routes).to.have.length(data.routes.length)
          routes.forEach((route, index) => {
            expect(route.id).to.not.be.empty
            expect(route.service.id).to.not.be.empty
            expect(route.name).to.eq(data.routes[index].name)
            expect(route.methods).to.have.members(data.routes[index].methods)
            expect(route.paths).to.have.members(data.routes[index].paths)
            expect(route.protocols).to.have.members(data.routes[index].protocols)
          })
        })
    })

    it('verifies all plugins', () => {
      cy.list_plugins(workspace)
        .then((plugins) => {
          cy.log(plugins)
          expect(plugins).to.have.length(data.plugins.length)
          plugins.forEach((plugin, index) => {
            expect(plugin.id).to.not.be.empty
            expect(plugin.route.id).to.not.be.empty
            expect(plugin.service.id).to.not.be.empty
            expect(plugin.name).to.eq(data.plugins[index].name)
            expect(plugin.protocols).to.have.members(data.plugins[index].protocols)
          })
        })
    })

    it('verifies all consumers', () => {
      cy.list_consumers(workspace)
        .then((consumers) => {
          expect(consumers).to.have.length(data.consumers.length)
          consumers.forEach((consumer, index) => {
            expect(consumer.id).to.not.be.empty
            expect(consumer.custom_id).to.eq(data.consumers[index].custom_id)
            expect(consumer.username).to.eq(data.consumers[index].username)
            expect(consumer.username_lower).to.eq(data.consumers[index].username_lower)
          })
        })
    })
  })
})