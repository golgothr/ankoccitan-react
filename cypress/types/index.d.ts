/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<Element>;
    logout(): Chainable<Element>;
    injectAxe(): Chainable<Element>;
    checkA11y(): Chainable<Element>;
  }
}
