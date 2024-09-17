import { expect, type Locator, type Page } from '@playwright/test';

export class Block {
  protected readonly page: Page;
  public readonly block: Locator;

  constructor(
    page: Page,
    parent: Locator,
    by: { text: string } | { nth: number } | { layout: boolean; nth: number } | { datatable: boolean; nth: number }
  ) {
    this.page = page;
    if ('text' in by) {
      this.block = parent.locator(`.draggable:not(:has(>.block-layout)):has-text("${by.text}")`);
    } else if ('layout' in by && by.layout) {
      this.block = parent.locator('.draggable:has(>.block-layout)').nth(by.nth);
    } else if ('datatable' in by && by.datatable) {
      this.block = parent.locator('.draggable:has(>.block-table)').nth(by.nth);
    } else if (by.nth !== undefined) {
      this.block = parent.locator('.draggable:not(:has(>.block-layout))').nth(by.nth);
    }
  }

  async select() {
    await this.block.click();
    await this.expectSelected();
  }

  async inscribe() {
    await this.block.dblclick();
    await this.expectSelected();
  }

  async quickAction(name: string) {
    await this.select();
    this.page.getByRole('button', { name });
    await this.page.locator('.quickbar').getByRole('button', { name }).click();
  }

  async dndTo(target: Block) {
    await this.block.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(10, 10);
    await target.block.hover();
    await this.page.mouse.up();
  }

  async expectSelected() {
    await expect(this.block).toHaveClass(/selected/);
  }
}
