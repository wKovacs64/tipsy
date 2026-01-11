/* eslint-disable playwright/expect-expect */
import { expect, test, type Page } from '@playwright/test';

async function changeDefaults(
  page: Page,
  {
    partySize,
    tipPercent,
  }: {
    partySize: number;
    tipPercent: number;
  },
) {
  await page.goto('/settings');
  await page.getByLabel(/default party size/i).fill(String(partySize));
  await page.getByLabel(/default tip percentage/i).fill(String(tipPercent));
  await page.getByText(/save/i).click();
  await page.goBack();
}

async function expectValues(
  page: Page,
  {
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
  },
) {
  await expect(page.getByLabel(/^tip percent \(%\)$/i)).toHaveValue(tipPercent);
  await expect(page.getByLabel(/^tip amount$/i)).toHaveValue(tipAmount);
  await expect(page.getByLabel(/^total amount$/i)).toHaveValue(totalAmount);
  await expect(page.getByLabel(/^number of people$/i)).toHaveValue(numberOfPeople);
  await expect(page.getByLabel(/^each person pays$/i)).toHaveValue(eachPersonPays);
}

test.describe('Calc Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calc/1235');
    await changeDefaults(page, { partySize: 1, tipPercent: 20 });
  });

  test('displays the bill amount', async ({ page }) => {
    await expect(page.getByText('$12.35')).toBeVisible();
  });

  test('populates initial values using app defaults', async ({ page }) => {
    await expectValues(page, {
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: '1',
      eachPersonPays: '14.82',
    });
  });

  test('populates initial values using custom defaults', async ({ page }) => {
    await changeDefaults(page, { partySize: 4, tipPercent: 18 });
    await expectValues(page, {
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

  test('recalculates on decrementing Tip Percent', async ({ page }) => {
    await page.getByLabel(/decrement tip percent/i).click();
    await expectValues(page, {
      tipPercent: '19',
      tipAmount: '2.35',
      totalAmount: '14.70',
      numberOfPeople: '1',
      eachPersonPays: '14.70',
    });
  });

  test('recalculates on incrementing Tip Percent', async ({ page }) => {
    await page.getByLabel(/increment tip percent/i).click();
    await expectValues(page, {
      tipPercent: '21',
      tipAmount: '2.59',
      totalAmount: '14.94',
      numberOfPeople: '1',
      eachPersonPays: '14.94',
    });
  });

  test('recalculates on manually adjusting Tip Percent', async ({ page }) => {
    await page.getByLabel(/^tip percent \(%\)$/i).fill('15');
    await expectValues(page, {
      tipPercent: '15',
      tipAmount: '1.85',
      totalAmount: '14.20',
      numberOfPeople: '1',
      eachPersonPays: '14.20',
    });
  });

  test('recalculates on decrementing Tip Amount', async ({ page }) => {
    await page.getByLabel(/decrement tip amount/i).click();
    await expectValues(page, {
      tipPercent: '16',
      tipAmount: '2.00',
      totalAmount: '14.35',
      numberOfPeople: '1',
      eachPersonPays: '14.35',
    });
  });

  test('recalculates on incrementing Tip Amount', async ({ page }) => {
    await page.getByLabel(/increment tip amount/i).click();
    await expectValues(page, {
      tipPercent: '24',
      tipAmount: '3.00',
      totalAmount: '15.35',
      numberOfPeople: '1',
      eachPersonPays: '15.35',
    });
  });

  test('recalculates on manually adjusting Tip Amount', async ({ page }) => {
    await page.getByLabel(/^tip amount$/i).fill('2.85');
    await expectValues(page, {
      tipPercent: '23',
      tipAmount: '2.85',
      totalAmount: '15.20',
      numberOfPeople: '1',
      eachPersonPays: '15.20',
    });
  });

  test('recalculates on decrementing Total Amount', async ({ page }) => {
    await page.getByLabel(/decrement total amount/i).click();
    await expectValues(page, {
      tipPercent: '13',
      tipAmount: '1.65',
      totalAmount: '14.00',
      numberOfPeople: '1',
      eachPersonPays: '14.00',
    });
  });

  test('recalculates on incrementing Total Amount', async ({ page }) => {
    await page.getByLabel(/increment total amount/i).click();
    await expectValues(page, {
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: '1',
      eachPersonPays: '15.00',
    });
  });

  test('recalculates on manually adjusting Total Amount', async ({ page }) => {
    await page.getByLabel(/^total amount$/i).fill('1600');
    await expectValues(page, {
      tipPercent: '30',
      tipAmount: '3.65',
      totalAmount: '16.00',
      numberOfPeople: '1',
      eachPersonPays: '16.00',
    });
  });

  test('recalculates on decrementing Number of People', async ({ page }) => {
    await changeDefaults(page, { partySize: 2, tipPercent: 20 });
    await page.getByLabel(/decrement number of people/i).click();
    await expectValues(page, {
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: '1',
      eachPersonPays: '14.82',
    });
  });

  test('recalculates on incrementing Number of People', async ({ page }) => {
    await page.getByLabel(/increment number of people/i).click();
    await expectValues(page, {
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: '2',
      eachPersonPays: '7.41',
    });
  });

  test('recalculates on manually adjusting Number of People', async ({ page }) => {
    await page.getByLabel(/^number of people$/i).fill('3');
    await expectValues(page, {
      tipPercent: '20',
      tipAmount: '2.47',
      totalAmount: '14.82',
      numberOfPeople: '3',
      eachPersonPays: '4.94',
    });
  });

  test('recalculates on decrementing Each Person Pays', async ({ page }) => {
    await page.getByLabel(/decrement each person pays/i).click();
    await expectValues(page, {
      tipPercent: '13',
      tipAmount: '1.65',
      totalAmount: '14.00',
      numberOfPeople: '1',
      eachPersonPays: '14.00',
    });
  });

  test('recalculates on incrementing Each Person Pays', async ({ page }) => {
    await page.getByLabel(/increment each person pays/i).click();
    await expectValues(page, {
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: '1',
      eachPersonPays: '15.00',
    });
  });

  test('recalculates on manually adjusting Each Person Pays', async ({ page }) => {
    await page.getByLabel(/^each person pays$/i).fill('1600');
    await expectValues(page, {
      tipPercent: '30',
      tipAmount: '3.65',
      totalAmount: '16.00',
      numberOfPeople: '1',
      eachPersonPays: '16.00',
    });
  });

  test('recalculates on multiple changes', async ({ page }) => {
    await page.getByLabel(/increment total amount/i).click();
    await page.getByLabel(/increment total amount/i).click();
    await page.getByLabel(/increment number of people/i).click();
    await page.getByLabel(/decrement tip amount/i).click();
    await expectValues(page, {
      tipPercent: '24',
      tipAmount: '3.00',
      totalAmount: '15.35',
      numberOfPeople: '2',
      eachPersonPays: '7.68',
    });
  });

  test('keeps total constant when changing number of people after setting per-person amount', async ({
    page,
  }) => {
    // Set each person pays to $15.00 (total $15.00 with 1 person)
    await page.getByLabel(/^each person pays$/i).fill('1500');
    await expectValues(page, {
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: '1',
      eachPersonPays: '15.00',
    });

    // Increment to 2 people - total should stay $15.00, per-person should become $7.50
    await page.getByLabel(/increment number of people/i).click();
    await expectValues(page, {
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: '2',
      eachPersonPays: '7.50',
    });

    // Increment to 3 people - total should stay $15.00, per-person should become $5.00
    await page.getByLabel(/increment number of people/i).click();
    await expectValues(page, {
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: '3',
      eachPersonPays: '5.00',
    });

    // Decrement back to 2 people - total should stay $15.00
    await page.getByLabel(/decrement number of people/i).click();
    await expectValues(page, {
      tipPercent: '21',
      tipAmount: '2.65',
      totalAmount: '15.00',
      numberOfPeople: '2',
      eachPersonPays: '7.50',
    });
  });
});
