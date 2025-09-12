Cypress.Commands.add('list_routes', (workspace)=> {
  cy.send_request(`${Cypress.env('kong_admin_url')}/${workspace}/routes`)
    .then((res) => {
    	expect(res.status).to.eq(200)
    	return res.body.data
    })
})

Cypress.Commands.add('delete_route', (workspace, id)=> {
  cy.send_request(`${Cypress.env('kong_admin_url')}/${workspace}/routes/${id}`, {method: 'DELETE'})
    .then((res) => {
    	expect(res.status).to.eq(204)
    })
})