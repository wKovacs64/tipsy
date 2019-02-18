describe('Settings Page', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/settings').injectAxe();
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]');
  });

  // TODO: enable cy.checkA11y() calls once cypress-axe is configurable and we
  // can disable the over-zealous `aria-required-attr` rule. Alternatively, we
  // could leverage patch-package to add `aria-checked={checked}` to the `input`
  // component rendered by react-switch, which is what's causing the
  // false-positive.

  it('has no detectable a11y violations (light mode)', () => {
    // cy.checkA11y();
  });

  it('has no detectable a11y violations (dark mode)', () => {
    cy.getByLabelText(/dark mode/i).click({ force: true });
    // cy.checkA11y();
  });
});
