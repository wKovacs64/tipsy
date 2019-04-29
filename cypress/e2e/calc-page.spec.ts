import {
  appDefaultPartySize,
  appDefaultTipPercent,
} from '../../src/utils/app-defaults';

function changeDefaults({
  partySize,
  tipPercent,
}: {
  partySize: number;
  tipPercent: number;
}): Cypress.Chainable {
  return cy
    .getByLabelText(/settings/i)
    .click()
    .getByLabelText(/default party size/i)
    .click()
    .type(String(partySize))
    .getByLabelText(/default tip percentage/i)
    .click()
    .type(String(tipPercent))
    .getByText(/save/i)
    .click();
}

function setupCalcTests(): Cypress.Chainable {
  return cy
    .getByLabelText(/bill amount/i)
    .click()
    .type('1235')
    .getByText(/next/i)
    .click();
}

function expectValues({
  tipPercent,
  tipAmount,
  totalAmount,
  numberOfPeople,
  eachPersonPays,
}: {
  tipPercent: string;
  tipAmount: string;
  totalAmount: string;
  numberOfPeople: string;
  eachPersonPays: string;
}): Cypress.Chainable {
  return cy
    .getByLabelText(/^tip percent \(%\)$/i)
    .should('have.value', tipPercent)
    .getByLabelText(/^tip amount$/i)
    .should('have.value', tipAmount)
    .getByLabelText(/^total amount$/i)
    .should('have.value', totalAmount)
    .getByLabelText(/^number of people$/i)
    .should('have.value', numberOfPeople)
    .getByLabelText(/^each person pays$/i)
    .should('have.value', eachPersonPays);
}

describe('Calc Page', () => {
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

  it('populates initial values using app defaults', () => {
    setupCalcTests();
    expectValues({
      tipPercent: String(appDefaultTipPercent),
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '14.82',
    });
  });

  it('populates initial values using custom defaults', () => {
    changeDefaults({
      partySize: 4,
      tipPercent: 18,
    });
    setupCalcTests();
    expectValues({
      tipPercent: '18',
      tipAmount: '2.22',
      totalAmount: '14.57',
      numberOfPeople: '4',
      eachPersonPays: '3.65',
    });
  });

  it('has a working Start Over button', () => {
    setupCalcTests()
      .getByText(/start over/i)
      .click();
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('recalculates on decrementing Tip Percent', () => {
    setupCalcTests()
      .getByLabelText(/decrement tip percent/i)
      .click();
    expectValues({
      tipPercent: String(appDefaultTipPercent - 1),
      tipAmount: '2.35',
      totalAmount: '14.70',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '14.70',
    });
  });

  it('recalculates on incrementing Tip Percent', () => {
    setupCalcTests()
      .getByLabelText(/increment tip percent/i)
      .click();
    expectValues({
      tipPercent: String(appDefaultTipPercent + 1),
      tipAmount: '2.59',
      totalAmount: '14.94',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '14.94',
    });
  });

  it('recalculates on manually adjusting Tip Percent', () => {
    setupCalcTests()
      .getByLabelText(/^tip percent \(%\)$/i)
      .click()
      .type('15');
    expectValues({
      tipPercent: '15',
      tipAmount: '1.85',
      totalAmount: '14.20',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '14.20',
    });
  });

  it('recalculates on decrementing Tip Amount', () => {
    setupCalcTests()
      .getByLabelText(/decrement tip amount/i)
      .click();
    expectValues({
      tipPercent: '16',
      tipAmount: '2.00',
      totalAmount: '14.35',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '14.35',
    });
  });

  it('recalculates on incrementing Tip Amount', () => {
    setupCalcTests()
      .getByLabelText(/increment tip amount/i)
      .click();
    expectValues({
      tipPercent: '24',
      tipAmount: '3.00',
      totalAmount: '15.35',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '15.35',
    });
  });

  it('recalculates on manually adjusting Tip Amount', () => {
    setupCalcTests()
      .getByLabelText(/^tip amount$/i)
      .click()
      .type('285');
    expectValues({
      tipPercent: '23',
      tipAmount: '2.85',
      totalAmount: '15.20',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '15.20',
    });
  });

  it('recalculates on decrementing Total Amount', () => {
    setupCalcTests()
      .getByLabelText(/decrement total amount/i)
      .click();
    expectValues({
      tipPercent: '13',
      tipAmount: '1.65',
      totalAmount: '14.00',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '14.00',
    });
  });

  it('recalculates on incrementing Total Amount', () => {
    setupCalcTests()
      .getByLabelText(/increment total amount/i)
      .click();
    expectValues({
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '15.00',
    });
  });

  it('recalculates on manually adjusting Total Amount', () => {
    setupCalcTests()
      .getByLabelText(/^total amount$/i)
      .click()
      .type('1600');
    expectValues({
      tipPercent: '30',
      tipAmount: '3.65',
      totalAmount: '16.00',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '16.00',
    });
  });

  it('recalculates on decrementing Number of People', () => {
    setupCalcTests()
      .getByLabelText(/decrement number of people/i)
      .click();
    expectValues({
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '14.82',
    });
  });

  it('recalculates on incrementing Number of People', () => {
    setupCalcTests()
      .getByLabelText(/increment number of people/i)
      .click();
    expectValues({
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: String(appDefaultPartySize + 1),
      eachPersonPays: '7.41',
    });
  });

  it('recalculates on manually adjusting Number of People', () => {
    setupCalcTests()
      .getByLabelText(/^number of people$/i)
      .click()
      .type('3');
    expectValues({
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: '3',
      eachPersonPays: '4.94',
    });
  });

  it('recalculates on decrementing Each Person Pays', () => {
    setupCalcTests()
      .getByLabelText(/decrement each person pays/i)
      .click();
    expectValues({
      tipPercent: '13',
      tipAmount: '1.65',
      totalAmount: '14.00',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '14.00',
    });
  });

  it('recalculates on incrementing Each Person Pays', () => {
    setupCalcTests()
      .getByLabelText(/increment each person pays/i)
      .click();
    expectValues({
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '15.00',
    });
  });

  it('recalculates on manually adjusting Each Person Pays', () => {
    setupCalcTests()
      .getByLabelText(/^each person pays$/i)
      .click()
      .type('1600');
    expectValues({
      tipPercent: '30',
      tipAmount: '3.65',
      totalAmount: '16.00',
      numberOfPeople: String(appDefaultPartySize),
      eachPersonPays: '16.00',
    });
  });

  it('recalculates on multiple changes', () => {
    setupCalcTests()
      .getByLabelText(/increment total amount/i)
      .click()
      .click()
      .getByLabelText(/increment number of people/i)
      .click()
      .getByLabelText(/decrement tip amount/i)
      .click();
    expectValues({
      tipPercent: '24',
      tipAmount: '3.00',
      totalAmount: '15.35',
      numberOfPeople: '2',
      eachPersonPays: '7.68',
    });
  });
});
