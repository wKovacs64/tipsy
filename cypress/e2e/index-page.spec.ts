describe('Index Page', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/').injectAxe();
  });

  it('has no detectable a11y violations on load', () => {
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]')
      .getByText(/bill/i)
      .checkA11y();
  });
});
