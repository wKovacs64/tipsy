describe('Index Page', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/').injectAxe();
  });

  it('has no detectable a11y violations in light mode', () => {
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]')
      .getByLabelText(/bill/i)
      .checkA11y();
    cy.getByLabelText(/bill/i)
      .click()
      .type('12345')
      .checkA11y();
  });

  it('has no detectable a11y violations in dark mode', () => {
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]').getByLabelText(/bill/i);
    cy.toggleDarkMode();
    cy.checkA11y();
    cy.getByLabelText(/bill/i)
      .click()
      .type('12345')
      .checkA11y();
  });
});
