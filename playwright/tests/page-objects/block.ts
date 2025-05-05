import { expect, type Locator, type Page } from '@playwright/test';

export class Block {
  protected readonly page: Page;
  public readonly block: Locator;

  constructor(
    page: Page,
    parent: Locator,
    by:
      | { text: string }
      | { nth: number }
      | { layout: boolean; nth: number }
      | { datatable: boolean; nth: number }
      | { dialog: boolean; datatableNth: number; nth: number }
      | { dialogContent: boolean; datatableNth: number; nth: number }
      | { column: boolean; datatableNth: number; nth: number }
      | { actionButton: boolean; datatableNth: number; columnNth: number; nth: number }
  ) {
    this.page = page;
    if ('text' in by) {
      this.block = parent.locator(`.draggable:not(:has(>.block-layout)):has-text("${by.text}")`);
    } else if ('layout' in by && by.layout) {
      this.block = parent.locator('.draggable:has(>.block-layout)').nth(by.nth);
    } else if ('datatable' in by && by.datatable) {
      this.block = parent.locator('.draggable:has(>.block-table)').nth(by.nth);
    } else if ('datatableNth' in by && 'dialog' in by && by.dialog) {
      const datatable = parent.locator('.draggable:has(>.block-table)').nth(by.datatableNth);
      this.block = datatable.locator('.block-table__dialog');
    } else if ('datatableNth' in by && 'dialogContent' in by && by.dialogContent) {
      const datatable = parent.locator('.draggable:has(>.block-table)').nth(by.datatableNth);
      const dialog = datatable.locator('.block-table__dialog');
      const input = dialog.locator('.draggable').nth(by.nth ?? 0);
      this.block = input;
    } else if ('datatableNth' in by && 'column' in by && by.column) {
      const datatable = parent.locator('.draggable:has(>.block-table)').nth(by.datatableNth);
      this.block = datatable.locator('.draggable:has(>.block-column)').nth(by.nth);
    } else if ('datatableNth' in by && 'columnNth' in by && 'actionButton' in by && by.actionButton) {
      const datatable = parent.locator('.draggable:has(>.block-table)').nth(by.datatableNth);
      const column = datatable.locator('.draggable:has(>.block-column)').nth(by.columnNth);
      const button = column.locator('.draggable:has(>.block-button)').nth(by.nth);
      this.block = button;
    } else {
      this.block = parent.locator('.draggable:not(:has(>.block-layout))').nth(by.nth);
    }
  }

  async select(options?: { force?: boolean; position?: { x: number; y: number } }) {
    await this.block.click(options);
    await this.expectSelected();
  }

  async inscribe() {
    await this.block.dblclick();
    await this.expectSelected();
  }

  async quickAction(name: string, force: boolean = false) {
    await this.select({ force: force });
    await this.page.locator('.quickbar').getByRole('button', { name }).click();
  }

  async dndTo(target: Block) {
    await this.block.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(100, 100);
    await target.block.hover();
    await this.page.mouse.up();
  }

  async expectSelected() {
    await expect(this.block).toHaveClass(/selected/);
  }
}
