import { expect, type Locator, type Page } from '@playwright/test';

export class Inscription {
  protected readonly page: Page;
  public readonly locator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator('#properties');
  }

  async expectEmptyPage() {
    await expect(this.locator).toContainText('Select an Element to edit its properties.');
  }
}
