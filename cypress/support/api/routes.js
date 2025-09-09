Cypress.Commands.add('list_routes', ()=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/routes`)
    .then((res) => {
    	expect(res.status).to.eq(200)
    	return res.body.data
    })
})

Cypress.Commands.add('delete_route', (id)=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/routes/${id}`, {method: 'DELETE'})
    .then((res) => {
    	expect(res.status).to.eq(204)
    })
})