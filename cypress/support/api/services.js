Cypress.Commands.add('list_services', (workspace)=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/${workspace}/services`)
    .then((res) => {
    	expect(res.status).to.eq(200)
    	return res.body.data
    })
})

Cypress.Commands.add('delete_service', (workspace, id)=> {
  cy.send_request(`${Cypress.env('konnect_admin_url')}/${workspace}/services/${id}`, {method: 'DELETE'})
    .then((res) => {
    	expect(res.status).to.eq(204)
    })
})