import 'cypress-axe'

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

Cypress.Commands.add('createTestPost', (title, content) => {
  title = title || 'My Cypress Post'
  content = content || 'This is a post created by Cypress.'

  cy.visit('/create')
  cy.get('input[name="title"], #title').type(title)
  cy.get('textarea[name="body"], #body').type(content)
  cy.get('.edit-form__submit, button[type="submit"]').click()
  
  // Extract post ID from the first read more link
  return cy.get('a.post__action[href^="/"]').first().invoke('attr', 'href').then(href => {
    const match = href.match(/^\/(\d+)/)
    const postId = match ? match[1] : null
    return { title, content, postId }
  })
})