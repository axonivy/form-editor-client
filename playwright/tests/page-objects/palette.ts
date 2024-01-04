import { expect, type Locator, type Page } from '@playwright/test';

export class Palette {
  protected readonly page: Page;
  protected readonly palette: Locator;

  constructor(page: Page, parent: Locator) {
    this.page = page;
    this.palette = parent.locator('.palette-sidebar');
  }

  async expectCategoryCount(count: number) {
    await expect(this.palette.locator('.palette-category')).toHaveCount(count);
  }
}
