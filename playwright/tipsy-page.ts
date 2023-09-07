import { expect, type Page } from '@playwright/test';

export class TipsyPage {
  constructor(public readonly page: Page) {}

  async changeDefaults({
    partySize,
    tipPercent,
  }: {
    partySize: number;
    tipPercent: number;
  }) {
    await this.page.goto('/settings');
    await this.page.getByLabel(/default party size/i).fill(String(partySize));
    await this.page
      .getByLabel(/default tip percentage/i)
      .fill(String(tipPercent));
    await this.page.getByText(/save/i).click();
    await this.page.goBack();
  }

  async expectValues({
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
  }) {
    await expect(this.page.getByLabel(/^tip percent \(%\)$/i)).toHaveValue(
      tipPercent,
    );
    await expect(this.page.getByLabel(/^tip amount$/i)).toHaveValue(tipAmount);
    await expect(this.page.getByLabel(/^total amount$/i)).toHaveValue(
      totalAmount,
    );
    await expect(this.page.getByLabel(/^number of people$/i)).toHaveValue(
      numberOfPeople,
    );
    await expect(this.page.getByLabel(/^each person pays$/i)).toHaveValue(
      eachPersonPays,
    );
  }

  async fillOutSettings() {
    await this.page.getByLabel(/default party size/i).fill('24');
    await this.page.getByLabel(/default tip percentage/i).fill('42');
  }
}
