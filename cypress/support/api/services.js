Cypress.Commands.add('list_services', ()=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/services`)
    .then((res) => {
    	expect(res.status).to.eq(200)
    	return res.body.data
    })
})

Cypress.Commands.add('delete_service', (id)=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/services/${id}`, {method: 'DELETE'})
    .then((res) => {
    	expect(res.status).to.eq(204)
    })
})