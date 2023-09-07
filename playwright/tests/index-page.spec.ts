import { expect, test } from '../utils';

test.describe('Index Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('enables the otherwise disabled Next button after entering a bill amount', async ({
    page,
  }) => {
    await expect(page.getByRole('button', { name: /next/i })).toBeDisabled();
    await page.getByLabel(/bill amount/i).fill('12345');
    await expect(page.getByRole('button', { name: /next/i })).toBeEnabled();
  });

  test('can navigate to /settings', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL('/settings');
  });
});
