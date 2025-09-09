Cypress.Commands.add('list_plugins', ()=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/plugins`)
    .then((res) => {
    	expect(res.status).to.eq(200)
    	return res.body.data
    })
})

Cypress.Commands.add('delete_plugin', (id)=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/plugins/${id}`, {method: 'DELETE'})
    .then((res) => {
    	expect(res.status).to.eq(204)
    })
})