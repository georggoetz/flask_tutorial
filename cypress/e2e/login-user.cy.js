describe('User Login Flow', () => {
  let user

  before(() => {
    cy.registerTestUser().then((result) => {
      user = result
    })
  })

  it('should allow the registered user to log in', () => {
    cy.loginTestUser(user.username, user.password)
    cy.contains('Welcome').should('exist')
    cy.contains(user.username).should('exist')
  })
})
