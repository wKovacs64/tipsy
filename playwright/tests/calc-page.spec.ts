/* eslint-disable playwright/expect-expect */
import { expect, test } from '../utils';

test.describe('Calc Page', () => {
  test.beforeEach(async ({ tipsyPage }) => {
    await tipsyPage.page.goto('/calc/1235');
    await tipsyPage.changeDefaults({ partySize: 1, tipPercent: 20 });
  });

  test('displays the bill amount', async ({ page }) => {
    await expect(page.getByText('$12.35')).toBeVisible();
  });

  test('populates initial values using app defaults', async ({ tipsyPage }) => {
    await tipsyPage.expectValues({
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: '1',
      eachPersonPays: '14.82',
    });
  });

  test('populates initial values using custom defaults', async ({
    tipsyPage,
  }) => {
    await tipsyPage.changeDefaults({ partySize: 4, tipPercent: 18 });
    await tipsyPage.expectValues({
      tipPercent: '18',
      tipAmount: '2.22',
      totalAmount: '14.57',
      numberOfPeople: '4',
      eachPersonPays: '3.65',
    });
  });

  test('has a working Start Over button', async ({ page }) => {
    await page.getByRole('button', { name: /start over/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('recalculates on decrementing Tip Percent', async ({ tipsyPage }) => {
    await tipsyPage.page.getByLabel(/decrement tip percent/i).click();
    await tipsyPage.expectValues({
      tipPercent: '19',
      tipAmount: '2.35',
      totalAmount: '14.70',
      numberOfPeople: '1',
      eachPersonPays: '14.70',
    });
  });

  test('recalculates on incrementing Tip Percent', async ({ tipsyPage }) => {
    await tipsyPage.page.getByLabel(/increment tip percent/i).click();
    await tipsyPage.expectValues({
      tipPercent: '21',
      tipAmount: '2.59',
      totalAmount: '14.94',
      numberOfPeople: '1',
      eachPersonPays: '14.94',
    });
  });

  test('recalculates on manually adjusting Tip Percent', async ({
    tipsyPage,
  }) => {
    await tipsyPage.page.getByLabel(/^tip percent \(%\)$/i).fill('15');
    await tipsyPage.expectValues({
      tipPercent: '15',
      tipAmount: '1.85',
      totalAmount: '14.20',
      numberOfPeople: '1',
      eachPersonPays: '14.20',
    });
  });

  test('recalculates on decrementing Tip Amount', async ({ tipsyPage }) => {
    await tipsyPage.page.getByLabel(/decrement tip amount/i).click();
    await tipsyPage.expectValues({
      tipPercent: '16',
      tipAmount: '2.00',
      totalAmount: '14.35',
      numberOfPeople: '1',
      eachPersonPays: '14.35',
    });
  });

  test('recalculates on incrementing Tip Amount', async ({ tipsyPage }) => {
    await tipsyPage.page.getByLabel(/increment tip amount/i).click();
    await tipsyPage.expectValues({
      tipPercent: '24',
      tipAmount: '3.00',
      totalAmount: '15.35',
      numberOfPeople: '1',
      eachPersonPays: '15.35',
    });
  });

  test('recalculates on manually adjusting Tip Amount', async ({
    tipsyPage,
  }) => {
    await tipsyPage.page.getByLabel(/^tip amount$/i).fill('2.85');
    await tipsyPage.expectValues({
      tipPercent: '23',
      tipAmount: '2.85',
      totalAmount: '15.20',
      numberOfPeople: '1',
      eachPersonPays: '15.20',
    });
  });

  test('recalculates on decrementing Total Amount', async ({ tipsyPage }) => {
    await tipsyPage.page.getByLabel(/decrement total amount/i).click();
    await tipsyPage.expectValues({
      tipPercent: '13',
      tipAmount: '1.65',
      totalAmount: '14.00',
      numberOfPeople: '1',
      eachPersonPays: '14.00',
    });
  });

  test('recalculates on incrementing Total Amount', async ({ tipsyPage }) => {
    await tipsyPage.page.getByLabel(/increment total amount/i).click();
    await tipsyPage.expectValues({
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: '1',
      eachPersonPays: '15.00',
    });
  });

  test('recalculates on manually adjusting Total Amount', async ({
    tipsyPage,
  }) => {
    await tipsyPage.page.getByLabel(/^total amount$/i).fill('1600');
    await tipsyPage.expectValues({
      tipPercent: '30',
      tipAmount: '3.65',
      totalAmount: '16.00',
      numberOfPeople: '1',
      eachPersonPays: '16.00',
    });
  });

  test('recalculates on decrementing Number of People', async ({
    tipsyPage,
  }) => {
    await tipsyPage.changeDefaults({ partySize: 2, tipPercent: 20 });
    await tipsyPage.page.getByLabel(/decrement number of people/i).click();
    await tipsyPage.expectValues({
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: '1',
      eachPersonPays: '14.82',
    });
  });

  test('recalculates on incrementing Number of People', async ({
    tipsyPage,
  }) => {
    await tipsyPage.page.getByLabel(/increment number of people/i).click();
    await tipsyPage.expectValues({
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: '2',
      eachPersonPays: '7.41',
    });
  });

  test('recalculates on manually adjusting Number of People', async ({
    tipsyPage,
  }) => {
    await tipsyPage.page.getByLabel(/^number of people$/i).fill('3');
    await tipsyPage.expectValues({
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: '3',
      eachPersonPays: '4.94',
    });
  });

  test('recalculates on decrementing Each Person Pays', async ({
    tipsyPage,
  }) => {
    await tipsyPage.page.getByLabel(/decrement each person pays/i).click();
    await tipsyPage.expectValues({
      tipPercent: '13',
      tipAmount: '1.65',
      totalAmount: '14.00',
      numberOfPeople: '1',
      eachPersonPays: '14.00',
    });
  });

  test('recalculates on incrementing Each Person Pays', async ({
    tipsyPage,
  }) => {
    await tipsyPage.page.getByLabel(/increment each person pays/i).click();
    await tipsyPage.expectValues({
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: '1',
      eachPersonPays: '15.00',
    });
  });

  test('recalculates on manually adjusting Each Person Pays', async ({
    tipsyPage,
  }) => {
    await tipsyPage.page.getByLabel(/^each person pays$/i).fill('1600');
    await tipsyPage.expectValues({
      tipPercent: '30',
      tipAmount: '3.65',
      totalAmount: '16.00',
      numberOfPeople: '1',
      eachPersonPays: '16.00',
    });
  });

  test('recalculates on multiple changes', async ({ tipsyPage }) => {
    await tipsyPage.page.getByLabel(/increment total amount/i).click();
    await tipsyPage.page.getByLabel(/increment total amount/i).click();
    await tipsyPage.page.getByLabel(/increment number of people/i).click();
    await tipsyPage.page.getByLabel(/decrement tip amount/i).click();
    await tipsyPage.expectValues({
      tipPercent: '24',
      tipAmount: '3.00',
      totalAmount: '15.35',
      numberOfPeople: '2',
      eachPersonPays: '7.68',
    });
  });
});
