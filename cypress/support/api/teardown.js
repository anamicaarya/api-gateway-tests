	// This is the shared teardown spec
export const resourcesTeardown = (data) => {
  describe('teardown process', () => {
    context(`delete all resources from the default workplace`, () => {
      it('deletes all routes', () => {
      	cy.list_routes()
      	  .then((routes) => {
      	  	routes.forEach((route) => {
      	  		cy.delete_route(route.id)
      	  	})
      	  })
      })

      it('deletes all plugins', () => {
      	cy.list_plugins()
      	  .then((plugins) => {
      	  	plugins.forEach((plugin) => {
      	  		cy.delete_plugin(plugin.id)
      	  	})
      	  })
      })

      it('deletes all consumers', () => {
        cy.list_consumers()
          .then((consumers) => {
            consumers.forEach((consumer) => {
              cy.delete_consumer(consumer.id)
            })
          })
      })

      it('deletes all services', () => {
        cy.list_services()
          .then((services) => {
            services.forEach((service) => {
              cy.delete_service(service.id)
            })
          })
      })
    })
  })
}