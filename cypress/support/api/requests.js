Cypress.Commands.add('send_request', (p_url, opts = {}) => {
  let params = {
      url: p_url,
      method: opts.method ? opts.method : 'GET',
      body:  opts.method ? opts.body : null,
      failOnStatusCode: opts.failOnStatusCode ? opts.failOnStatusCode : true
  }
  cy.request(params)
})