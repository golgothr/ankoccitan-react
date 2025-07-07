/// <reference types="cypress" />

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands') 

// Custom command to login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.visit('/profile')
  cy.get('button').contains('Se déconnecter').click()
}) 