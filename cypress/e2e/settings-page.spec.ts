import * as pkg from '../../package.json';

function fillOutSettings(): Cypress.Chainable {
  return cy
    .getByLabelText(/default party size/i)
    .should('not.have.value', '24')
    .click()
    .type('24{enter}')
    .getByLabelText(/default tip percentage/i)
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
    cy.getByLabelText(/dark mode/i).click({ force: true });
    cy.get('body').should('have.class', 'dark-mode');
    cy.checkA11y();
  });

  it('displays the version', () => {
    cy.getByText(`v${pkg.version}`).should('exist');
  });

  it('toggles dark mode', () => {
    cy.get('body')
      .should('not.have.class', 'dark-mode')
      .getByLabelText(/dark mode:/i)
      .click({ force: true })
      .get('body')
      .should('have.class', 'dark-mode')
      .getByLabelText(/dark mode:/i)
      .click({ force: true })
      .get('body')
      .should('have.class', 'light-mode');
  });

  it('persists numeric options only on save', () => {
    fillOutSettings()
      .visit('/')
      .getByLabelText(/settings/i)
      .click()
      .getByLabelText(/default party size/i)
      .should('not.have.value', '24')
      .getByLabelText(/default tip percentage/i)
      .should('not.have.value', '42')
      .getByLabelText(/default party size/i)
      .then(fillOutSettings)
      .getByText(/save/i)
      .click()
      .getByLabelText(/settings/i)
      .click()
      .getByLabelText(/default party size/i)
      .should('have.value', '24')
      .getByLabelText(/default tip percentage/i)
      .should('have.value', '42');
  });
});
