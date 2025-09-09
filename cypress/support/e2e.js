// ***********************************************************
// This example support/e2e.js is processed and
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
import './api/consumers.js'
import './api/plugins.js'
import './api/requests.js'
import './api/routes.js'
import './api/services.js'
import './ui/consumers.js'
import './ui/plugins.js'
import './ui/routes.js'
import './ui/services.js'
import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', (err) => {
  if (err && (err.message === 'Script error.' || /cross origin/i.test(err.message))) {
    return false; // prevent test failure for the generic masked error only
  }
});