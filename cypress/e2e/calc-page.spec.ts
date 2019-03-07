import {
  appDefaultPartySize,
  appDefaultTipPercent,
} from '../../src/utils/app-defaults';

function setupCalcTests(): Cypress.Chainable {
  return cy
    .getByLabelText(/bill amount/i)
    .click()
    .type('1235')
    .getByText(/next/i)
    .click();
}

describe('Calc Page', () => {
  beforeEach(() => {
    cy.visit('/').injectAxe();
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]');
  });

  afterEach(() => {
    cy.clearLocalStorageForReal();
  });

  it('has no detectable a11y violations (light mode)', () => {
    setupCalcTests()
      .get('body')
      .should('not.have.class', 'dark-mode')
      .checkA11y();
  });

  it('has no detectable a11y violations (dark mode)', () => {
    cy.toggleDarkMode();
    setupCalcTests()
      .get('body')
      .should('have.class', 'dark-mode')
      .checkA11y();
  });

  it('displays the bill amount', () => {
    setupCalcTests()
      .getByText('$12.35')
      .should('exist');
  });

  it('populates initial values', () => {
    setupCalcTests()
      .getByLabelText(/tip percent/i)
      .should('have.value', String(appDefaultTipPercent))
      .getByLabelText(/tip amount/i)
      .should('have.value', '2.47')
      .getByLabelText(/total amount/i)
      .should('have.value', '14.82')
      .getByLabelText(/number of people/i)
      .should('have.value', String(appDefaultPartySize))
      .getByLabelText(/each person pays/i)
      .should('have.value', '14.82');
  });

  it('has a working Start Over button', () => {
    setupCalcTests()
      .getByText(/start over/i)
      .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
