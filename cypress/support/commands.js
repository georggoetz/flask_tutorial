Cypress.Commands.add('registerTestUser', (username, password) => {
  username = username || 'testuser_' + Date.now()
  password = password || 'TestPassword!123'

  cy.visit('/auth/register')
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('.login-form__submit').click()
  cy.url().should('include', '/auth/login')

  return cy.wrap({ username, password })
})

Cypress.Commands.add('loginTestUser', (username, password) => {
  cy.visit('/auth/login')
  cy.get('#username').type(username)
  cy.get('#password').type(password)
  cy.get('.login-form__submit').click()
})