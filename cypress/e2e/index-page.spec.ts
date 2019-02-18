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

  it('enables the otherwise disabled Next button after entering a bill amount', () => {
    cy.getByText(/next/i).should('have.attr', 'disabled');
    cy.getByLabelText(/bill amount/i)
      .click()
      .type('12345');
    cy.getByText(/next/i).should('not.have.attr', 'disabled');
  });

  it('can navigate to /settings', () => {
    cy.getByLabelText(/settings/i).click();
    cy.url().should('include', '/settings');
  });
});
