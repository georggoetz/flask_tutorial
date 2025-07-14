const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
    }
  }
})
