import * as pkg from '../../package.json';

function fillOutSettings(): Cypress.Chainable {
  cy.findByLabelText(/default party size/i)
    .should('not.have.value', '24')
    .click()
    .type('24{enter}');
  return cy
    .findByLabelText(/default tip percentage/i)
    .should('not.have.value', '42')
    .click()
    .type('42{enter}');
}

describe('Settings Page', () => {
  beforeEach(() => {
    cy.visit('/settings').injectAxe();
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]');
  });

  afterEach(() => {
    cy.clearLocalStorageForReal();
  });

  it('has no detectable a11y violations (light mode)', () => {
    cy.get('body').should('not.have.class', 'dark-mode');
    cy.checkA11y();
  });

  it('has no detectable a11y violations (dark mode)', () => {
    // wait for Cypress resources to load in hopes of combating intermittent CI
    // failures
    cy.wait(2000);
    cy.findByLabelText(/dark mode/i).click({ force: true });
    cy.get('body').should('have.class', 'dark-mode');
    cy.checkA11y();
  });

  it('displays the version', () => {
    cy.findByText(`v${pkg.version}`).should('exist');
  });

  it('toggles dark mode', () => {
    // wait for Cypress resources to load in hopes of combating intermittent CI
    // failures
    cy.wait(2000);
    cy.get('body').should('not.have.class', 'dark-mode');
    cy.findByLabelText(/dark mode:/i)
      .click({ force: true })
      .get('body')
      .should('have.class', 'dark-mode');
    cy.findByLabelText(/dark mode:/i)
      .click({ force: true })
      .get('body')
      .should('have.class', 'light-mode');
  });

  it('persists numeric options only on save', () => {
    fillOutSettings().visit('/');
    cy.findByLabelText(/settings/i).click();
    cy.findByLabelText(/default party size/i).should('not.have.value', '24');
    cy.findByLabelText(/default tip percentage/i).should(
      'not.have.value',
      '42',
    );
    cy.findByLabelText(/default party size/i).then(fillOutSettings);
    cy.findByText(/save/i).click();
    cy.findByLabelText(/settings/i).click();
    cy.findByLabelText(/default party size/i).should('have.value', '24');
    cy.findByLabelText(/default tip percentage/i).should('have.value', '42');
  });
});
