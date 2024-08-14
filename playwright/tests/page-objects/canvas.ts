import { expect, type Locator, type Page } from '@playwright/test';

export class Canvas {
  protected readonly page: Page;
  public readonly locator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator('.canvas');
  }

  async expectHelpPaddings(paddings: boolean) {
    const draggable = this.locator.locator('.draggable').first();
    const emptyBlock = this.locator.locator('.empty-block').first();
    if (paddings) {
      await expect(draggable).toHaveCSS('padding', '8px 16px');
      await expect(draggable).toHaveCSS('margin', '8px');
      await expect(emptyBlock).toBeVisible();
    } else {
      await expect(draggable).toHaveCSS('padding', '0px');
      await expect(draggable).toHaveCSS('margin', '0px');
      await expect(emptyBlock).toBeHidden();
    }
  }
}
