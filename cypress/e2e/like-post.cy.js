describe('Like Post as Another User', () => {
  const postTitle = 'Post to Like'
  const postBody = 'This post will be liked by another user.'

  it('should allow a second user to like a post created by the first user', () => {
    cy.registerTestUser().then(({ username, password }) => {
      cy.loginTestUser(username, password)
      cy.visit('/')
      cy.get('.fab').click()
      cy.get('#title').type(postTitle)
      cy.get('#body').type(postBody)
      cy.get('.edit-form__submit').click()
      cy.contains(postTitle).should('exist')
      cy.contains(postBody).should('exist')

      cy.get('a.nav-bar__action').contains('Log Out').click()

      cy.registerTestUser().then(({ username, password }) => {
        cy.loginTestUser(username, password)

        cy.contains(postTitle)
          .parents('.post')
          .find('x-likes')
          .shadow()
          .find('button')
          .click()

        cy.contains(postTitle)
          .parents('.post')
          .find('x-likes')
          .shadow()
          .find('.likes__counter')
          .should('contain', '1')

        cy.contains(postTitle)
          .parents('.post')
          .find('x-likes')
          .shadow()
          .find('.likes__heart')
          .should('have.class', 'likes__heart--liked')
      })
    })
  })
})