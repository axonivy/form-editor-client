import { expect, type Locator, type Page } from '@playwright/test';

export class Palette {
  protected readonly page: Page;
  protected readonly palette: Locator;

  constructor(page: Page) {
    this.page = page;
    this.palette = page.locator('.palette');
  }

  async expectItemCount(count: number) {
    await expect(this.palette.locator('.palette-item')).toHaveCount(count);
  }
}
