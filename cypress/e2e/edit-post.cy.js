describe('Edit Post Flow', () => {
  const originalTitle = 'My Cypress Post'
  const originalBody = 'This is a post created by Cypress.'
  const updatedTitle = 'Updated Cypress Post'
  const updatedBody = 'This post has been updated by Cypress.'

  before(() => {
    cy.registerTestUser().then(({ username, password }) => {
      cy.loginTestUser(username, password)
    })
  })

  it('should allow the user to edit an existing post', () => {
    cy.visit('/')
    cy.get('.fab').click()
    cy.get('#title').type(originalTitle)
    cy.get('#body').type(originalBody)
    cy.get('.edit-form__submit').click()

    cy.contains(originalTitle)
      .parents('.post')
      .find('.post__action')
      .contains('Edit')
      .click()

    cy.get('#title').clear().type(updatedTitle)
    cy.get('#body').clear().type(updatedBody)
    cy.get('.edit-form__submit').click()

    cy.contains(updatedTitle).should('exist')
    cy.contains(updatedBody).should('exist')
  })
})