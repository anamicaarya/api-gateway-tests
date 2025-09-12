// ***********************************************************
// This example support/e2e is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './api/consumers'
import './api/plugins'
import './api/requests'
import './api/routes'
import './api/services'
import './ui/consumers'
import './ui/plugins'
import './ui/routes'
import './ui/services'
import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', (err) => {
  if (err && (err.message === 'Script error.' || /cross origin/i.test(err.message))) {
    return false; // prevent test failure for the generic masked error only
  }
});

beforeEach(function () {
  const isRetry = this.currentTest && this.currentTest.currentRetry && this.currentTest.currentRetry() > 0;
  if (isRetry) cy.wait(2000); // sleep 1s before the retried run starts
});