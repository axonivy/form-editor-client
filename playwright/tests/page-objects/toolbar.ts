import { expect, type Locator, type Page } from '@playwright/test';

export class Toolbar {
  protected readonly page: Page;
  protected readonly palette: Locator;

  constructor(page: Page) {
    this.page = page;
    this.palette = page.locator('.palette-section');
  }

  async expectCategoryCount(count: number) {
    await expect(this.palette.locator('.category-popover')).toHaveCount(count);
  }

  async expectItemInCategoryCount(position: number, count: number) {
    this.palette.locator('.category-popover').nth(position).click();
    await expect(this.page.locator('.palette-item')).toHaveCount(count);
  }
}
