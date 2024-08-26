import { expect, type Locator, type Page } from '@playwright/test';

export class Block {
  protected readonly page: Page;
  public readonly block: Locator;

  constructor(page: Page, parent: Locator, by: { text?: string; nth?: number }) {
    this.page = page;
    if (by.text !== undefined) {
      this.block = parent.locator(`.draggable:not(:has(>.block-layout)):has-text("${by.text}")`);
    } else if (by.nth !== undefined) {
      this.block = parent.locator('.draggable:not(:has(>.block-layout))').nth(by.nth);
    }
  }

  async select() {
    await this.block.click();
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
