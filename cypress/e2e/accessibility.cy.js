describe('Accessibility Checks', () => {
  const pages = [
    '/',
    '/auth/login',
    '/auth/register',
    '/error'
  ]

  pages.forEach((url) => {
    it(`checks ${url} is accessible`, () => {
      cy.visit(url, { failOnStatusCode: false })
      cy.injectAxe()
      cy.checkA11y()
    })
  })
})

describe('Accessibility Checks (auth required)', () => {
  let postId

  before(() => {
    cy.registerTestUser().then(({username, password}) => {
      cy.loginTestUser(username, password)
      cy.createTestPost().then((data) => {
        postId = data.postId
      })
    })
  })

  it('checks /${postId} is accessible', () => {
    cy.visit(`/${postId}`)
    cy.injectAxe()
    cy.checkA11y()
  })

  it('checks /${postId}/update is accessible', () => {
    cy.visit(`/${postId}/update`)
    cy.injectAxe()
    cy.checkA11y()
  })
})
