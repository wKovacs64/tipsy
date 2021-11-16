import pkg from '../../package.json';

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
    cy.visit('/settings');
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('displays the version', () => {
    cy.findByText(`v${pkg.version}`).should('exist');
  });

  it('toggles dark mode', () => {
    // wait for Cypress resources to load in hopes of combating intermittent CI
    // failures
    cy.wait(2000);
    cy.get('html').then(($html) => {
      if (!$html.hasClass('dark')) {
        cy.findByLabelText(/dark mode:/i).click({ force: true });
        cy.get('html').should('have.class', 'dark');
        cy.findByLabelText(/dark mode:/i).click({ force: true });
        cy.get('html').should('not.have.class', 'dark');
      } else if ($html.hasClass('dark')) {
        cy.findByLabelText(/dark mode:/i).click({ force: true });
        cy.get('html').should('not.have.class', 'dark');
        cy.findByLabelText(/dark mode:/i).click({ force: true });
        cy.get('html').should('have.class', 'dark');
      }
    });
  });

  it('persists numeric options only on save', () => {
    fillOutSettings().visit('/');
    cy.findByRole('img', { name: /settings/i }).click();
    cy.findByLabelText(/default party size/i).should('not.have.value', '24');
    cy.findByLabelText(/default tip percentage/i).should(
      'not.have.value',
      '42',
    );
    cy.findByLabelText(/default party size/i).then(fillOutSettings);
    cy.findByText(/save/i).click();
    cy.findByRole('img', { name: /settings/i }).click();
    cy.findByLabelText(/default party size/i).should('have.value', '24');
    cy.findByLabelText(/default tip percentage/i).should('have.value', '42');
  });
});
