describe('Create Post Flow', () => {
  before(() => {
    cy.registerTestUser().then(({ username, password }) => {
      cy.loginTestUser(username, password)
    })
  })

  it('should allow the user to create a new post', () => {
    cy.visit('/')
    cy.get('.fab').click()

    cy.get('#title').type('My Cypress Post')
    cy.get('#body').type('This is a post created by Cypress.')
    cy.get('.edit-form__submit').click()

    cy.contains('My Cypress Post').should('exist')
    cy.contains('This is a post created by Cypress.').should('exist')
  })
})