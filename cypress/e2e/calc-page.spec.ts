function setupCalcTests(): Cypress.Chainable {
  return cy
    .getByLabelText(/bill amount/i)
    .click()
    .type('1235')
    .getByText(/next/i)
    .click();
}

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Calc Page', () => {
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
});
