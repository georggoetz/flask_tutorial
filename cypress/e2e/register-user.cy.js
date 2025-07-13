describe('User Registration Flow', () => {
  it('should allow a new user to sign up', () => {
    cy.registerTestUser().then(() => {
      cy.url().should('include', '/auth/login')
    })
  })
})

describe('User Registration and Login Flow', () => {
  it('should allow the registered user to log in', () => {
    cy.registerTestUser().then(({ username, password }) => {
      // You are now on the login page
      cy.get('#username').type(username)
      cy.get('#password').type(password)
      cy.get('.login-form__submit').click()
      cy.contains('Welcome').should('exist')
      cy.contains(username).should('exist')
    })
  })
})