import { test as base } from '@playwright/test';
import { TipsyPage } from './tipsy-page';

export const test = base.extend<{ tipsyPage: TipsyPage }>({
  tipsyPage: async ({ page }, use) => {
    const tipsyPage = new TipsyPage(page);
    await use(tipsyPage);
  },
});

export { expect } from '@playwright/test';
