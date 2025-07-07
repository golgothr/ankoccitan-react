describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the welcome message', () => {
    cy.get('h1').should('contain', 'Bienvenue sur AnkoCitan')
  })

  it('should display navigation links', () => {
    cy.get('nav').within(() => {
      cy.get('a').should('contain', 'Accueil')
      cy.get('a').should('contain', 'Connexion')
      cy.get('a').should('contain', 'Profil')
    })
  })

  it('should display decks after loading', () => {
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should('not.exist')
    cy.get('[data-testid="deck-card"]').should('have.length.at.least', 1)
  })

  it('should navigate to auth page', () => {
    cy.get('a').contains('Connexion').click()
    cy.url().should('include', '/auth')
  })
}) 