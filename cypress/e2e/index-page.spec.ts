describe('Index Page', () => {
  beforeEach(() => {
    cy.visit('/');
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]');
  });

  afterEach(() => {
    cy.clearLocalStorageForReal();
  });

  it('enables the otherwise disabled Next button after entering a bill amount', () => {
    cy.findByText(/next/i).should('have.attr', 'disabled');
    cy.findByLabelText(/bill amount/i)
      .click()
      .type('12345');
    cy.findByText(/next/i).should('not.have.attr', 'disabled');
  });

  it('can navigate to /settings', () => {
    cy.findByRole('img', { name: /settings/i }).click();
    cy.url().should('include', '/settings');
  });
});
