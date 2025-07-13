it('shows error card for 404', () => {
  cy.visit('/not-existing-url', { failOnStatusCode: false })
  cy.get('.error-card').should('exist')
  cy.contains('Not Found')
})