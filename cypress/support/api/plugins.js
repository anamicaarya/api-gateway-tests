Cypress.Commands.add('list_plugins', (workspace)=> {
  cy.send_request(`${Cypress.env('kong_admin_url')}/${workspace}/plugins`)
    .then((res) => {
    	expect(res.status).to.eq(200)
    	return res.body.data
    })
})

Cypress.Commands.add('delete_plugin', (workspace, id)=> {
  cy.send_request(`${Cypress.env('kong_admin_url')}/${workspace}/plugins/${id}`, {method: 'DELETE'})
    .then((res) => {
    	expect(res.status).to.eq(204)
    })
})