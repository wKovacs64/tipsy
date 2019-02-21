function setupCalcTests(): Cypress.Chainable {
  return cy
    .getByLabelText(/bill amount/i)
    .click()
    .type('1235')
    .getByText(/next/i)
    .click();
}

describe.skip('Calc Page', () => {
  beforeEach(() => {
    cy.visit('/').injectAxe();
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]');
  });

  it('has no detectable a11y violations (light mode)', () => {
    setupCalcTests().checkA11y();
  });

  it('has no detectable a11y violations (dark mode)', () => {
    cy.toggleDarkMode();
    setupCalcTests().checkA11y();
  });

  it('displays the bill amount', () => {
    setupCalcTests()
      .getByText('$12.35')
      .should('exist');
  });
});
