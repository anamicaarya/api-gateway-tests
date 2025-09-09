const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    konnect_proxy_url: 'http://localhost:8000',
    konnect_admin_url: 'http://localhost:8001',
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
      
      return config;
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:8002/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    testIsolation: false,
    video: true,
    experimentalCspAllowList: ["default-src","script-src"],
    viewportWidth: 1320,
    viewportHeight: 720,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'Apigateway tests',
      reportDir: "cypress/reports",
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
      overwrite: false,
      autoOpen: false
    },
  },
});
