const data = require('../fixtures/services/service.json')

describe('Get started with Kong Gateway', () => {
  context.skip('checks if Kong Manager is running successfully',  () => {
    it('pings the kong manager endpoint', () => {
      cy.send_request(Cypress.config('baseUrl'))
        .then((res) => {
          expect(res.status).to.eql(200)
        })
    })

    it('verifies no valid Kong Enterprise license is configured', () => {
      cy.navigates_to_page(Cypress.config('baseUrl'), 'workspaces')
        .then(() => {
          cy.get('div.k-alert.danger.invalid-license-notification')
            .should('exist')
            .contains('No valid Kong Enterprise license configured')
        })
    })

    it('should not be able to create a new workspace', () => {
      cy.get('[data-testid="entity-button"]')
        .contains('New Workspace')
        .should('have.attr', 'disabled', 'disabled')
    })
  })

  data.services.forEach ((service, index) => {
    context(`${service.name}: workflow `,  () => {
      it('navigates to gateway services', () => {
        cy.navigates_to_page(`${Cypress.config('baseUrl')}${data.workspace}`, data.workspace)
        cy.verify_kong_loading()
        cy.access_navigation_items('gateway-services')

        cy.url().should('match', new RegExp(`\/${data.workspace}/services`))
        cy.get('div.kong-ui-entities-gateway-services-list').should('exist')
      })

      it(`creates the service "${service.name}"`, () => {
        cy.create_service_ui(service)
      })

      //skip: if the service has no route in the fixture
      const test = service?.route ? it : it.skip

      test(`adds a route to the service "${service.name}"`, () => {
        //accesses the routes tab of the service
        cy.access_services_resources(service, 'routes', false)
        cy.verify_kong_loading()
        cy.add_route_ui(service)
      })

      /*
      test(`verifies the route error of "${service.name}" is resolved`, () => {
        cy.wait(3000) // wait for route to get registered or else throws 404
        cy.send_request(`${Cypress.env('konnect_proxy_url')}${service.route.path}`)
          .then((res) => {
            expect(res.status).to.eq(200)
            cy.log(res.headers)
          })
      })*/

      test(`enable "${service.plugin?.name}" plugin for route "${service.route?.name}" for service "${service.name}"`, () => {
        //accesses the plugins tab of the service
        cy.access_services_resources(service, 'plugins', false)
        cy.verify_kong_loading()
        cy.add_plugin_ui(service)
      }) 
    })
  })

  context('add consumers and other plugins', () => {
    it(`create a consumer and add credentials`, () => {
      cy.access_navigation_items('consumers')
      cy.create_consumer_ui(data.consumer)
      cy.access_consumer_resources(data.consumer, 'credentials', false)
      cy.add_consumer_credential(data.consumer)
    })  
  }) 
})