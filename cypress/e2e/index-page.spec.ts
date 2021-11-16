describe('Index Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearLocalStorage();
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
