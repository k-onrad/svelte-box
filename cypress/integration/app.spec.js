describe('First test', () => {
  it('Clicking post on sidenav takes to post module', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Posts').click()
    cy.url().should('include', '/#/posts')
  })
})
