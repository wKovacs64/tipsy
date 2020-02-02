// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-axe';
import '@testing-library/cypress/add-commands';

Cypress.Commands.add('toggleDarkMode', () => {
  cy.findByLabelText(/settings/i).click();
  cy.findByLabelText(/dark mode:/i)
    .click({ force: true })
    .go('back');
});

// Clear localStorage ourselves because Cypress' internal method is broken and
// sets entries to `null` instead of removing them!
Cypress.Commands.add('clearLocalStorageForReal', () => {
  cy.window().then(win => {
    win.localStorage.clear();
  });
});
