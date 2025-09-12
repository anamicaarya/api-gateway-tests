Cypress.Commands.add('list_consumers', (workspace)=> {
  cy.send_request(`${Cypress.env('kong_admin_url')}/${workspace}/consumers`)
    .then((res) => {
    	expect(res.status).to.eq(200)
    	return res.body.data
    })
})

Cypress.Commands.add('delete_consumer', (workspace, id)=> {
  cy.send_request(`${Cypress.env('kong_admin_url')}/${workspace}/consumers/${id}`, {method: 'DELETE'})
    .then((res) => {
    	expect(res.status).to.eq(204)
    })
})