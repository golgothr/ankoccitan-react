describe('Accessibility', () => {
  it('home page should have no violations', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y();
  });

  it('auth form should have no violations', () => {
    cy.visit('/auth');
    cy.injectAxe();
    cy.checkA11y();
  });
});
