import { expect, test, type Page } from '@playwright/test';
import { readJsonSync } from 'fs-extra/esm';
import type { PackageJson } from 'type-fest';

const packageJsonUrl = new URL('../../package.json', import.meta.url);
const packageJsonObj = readJsonSync(packageJsonUrl) as PackageJson;

async function fillOutSettings(page: Page) {
  await page.getByLabel(/default party size/i).fill('24');
  await page.getByLabel(/default tip percentage/i).fill('42');
}

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('displays the version', async ({ page }) => {
    await expect(page.getByText(`v${packageJsonObj.version}`)).toBeVisible();
  });

  test('toggles dark mode', async ({ page }) => {
    const html = page.locator('//html');
    await expect(html).not.toHaveClass('dark');
    await page.getByText(/dark mode/i).click();
    await expect(html).toHaveClass('dark');
    await page.getByText(/dark mode/i).click();
    await expect(html).not.toHaveClass('dark');
  });

  test('persists numeric options only on save', async ({ page }) => {
    await fillOutSettings(page);
    await page.goto('/');
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByLabel(/default party size/i)).not.toHaveValue('24');
    await expect(page.getByLabel(/default tip percentage/i)).not.toHaveValue(
      '42',
    );
    await fillOutSettings(page);
    await page.getByRole('button', { name: /save/i }).click();
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByLabel(/default party size/i)).toHaveValue('24');
    await expect(page.getByLabel(/default tip percentage/i)).toHaveValue('42');
  });
});
