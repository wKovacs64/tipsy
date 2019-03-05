function fillOutSettings(): Cypress.Chainable {
  return cy
    .getByLabelText(/default party size/i)
    .should('not.have.value', '24')
    .click()
    .type('24{enter}')
    .getByLabelText(/default tip percentage/i)
    .should('not.have.value', '42')
    .click()
    .type('42{enter}');
}

describe('Settings Page', () => {
  beforeEach(() => {
    cy.visit('/settings').injectAxe();
    cy.configureAxe({
      rules: [
        {
          // https://github.com/markusenglund/react-switch/issues/34
          id: 'aria-required-attr',
          enabled: false,
        },
      ],
    });
    // wait for the content to ensure the app has been rendered
    cy.get('html[lang="en"]');
  });

  it('has no detectable a11y violations (light mode)', () => {
    cy.checkA11y();
  });

  it('has no detectable a11y violations (dark mode)', () => {
    cy.getByLabelText(/dark mode/i).click({ force: true });
    cy.checkA11y();
  });

  it('toggles dark mode', () => {
    cy.get('body')
      .should('have.class', 'light-mode')
      .getByLabelText(/dark mode:/i)
      .click({ force: true })
      .get('body')
      .should('have.class', 'dark-mode')
      .getByLabelText(/dark mode:/i)
      .click({ force: true })
      .get('body')
      .should('have.class', 'light-mode');
  });

  it('persists numeric options only on save', () => {
    fillOutSettings()
      .visit('/')
      .getByLabelText(/settings/i)
      .click()
      .getByLabelText(/default party size/i)
      .should('not.have.value', '24')
      .getByLabelText(/default tip percentage/i)
      .should('not.have.value', '42')
      .getByLabelText(/default party size/i)
      .then(fillOutSettings)
      .getByText(/save/i)
      .click()
      .getByLabelText(/settings/i)
      .click()
      .getByLabelText(/default party size/i)
      .should('have.value', '24')
      .getByLabelText(/default tip percentage/i)
      .should('have.value', '42');
  });
});
