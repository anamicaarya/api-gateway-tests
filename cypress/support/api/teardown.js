	// This is the shared teardown spec
export const resourcesTeardown = (data) => {
  describe('teardown process', () => {
    context(`delete all resources from the default workplace`, () => {
      const workspace = data.workspace ?? Cypress.env('default_workspace')
      it('deletes all routes', () => {
      	cy.list_routes(workspace)
      	  .then((routes) => {
      	  	routes.forEach((route) => {
      	  		cy.delete_route(workspace, route.id)
      	  	})
      	  })
      })

      it('deletes all plugins', () => {
      	cy.list_plugins(workspace)
      	  .then((plugins) => {
      	  	plugins.forEach((plugin) => {
      	  		cy.delete_plugin(workspace, plugin.id)
      	  	})
      	  })
      })

      it('deletes all consumers', () => {
        cy.list_consumers(workspace)
          .then((consumers) => {
            consumers.forEach((consumer) => {
              cy.delete_consumer(workspace, consumer.id)
            })
          })
      })

      it('deletes all services', () => {
        cy.list_services(workspace)
          .then((services) => {
            services.forEach((service) => {
              cy.delete_service(workspace, service.id)
            })
          })
      })
    })
  })
}