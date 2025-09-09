Cypress.Commands.add('list_consumers', ()=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/consumers`)
    .then((res) => {
    	expect(res.status).to.eq(200)
    	return res.body.data
    })
})

Cypress.Commands.add('delete_consumer', (id)=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/consumers/${id}`, {method: 'DELETE'})
    .then((res) => {
    	expect(res.status).to.eq(204)
    })
})