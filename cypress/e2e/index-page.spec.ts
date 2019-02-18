describe('Index Page', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/').injectAxe();
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]');
  });

  it('has no detectable a11y violations (light mode)', () => {
    cy.getByLabelText(/bill/i).checkA11y();
    cy.getByLabelText(/bill/i)
      .click()
      .type('12345')
      .checkA11y();
  });

  it('has no detectable a11y violations (dark mode)', () => {
    cy.getByLabelText(/bill/i);
    cy.toggleDarkMode();
    cy.checkA11y();
    cy.getByLabelText(/bill/i)
      .click()
      .type('12345')
      .checkA11y();
  });
});
