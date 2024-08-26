import { expect, type Locator, type Page } from '@playwright/test';
import { Palette } from './palette';

export class Toolbar {
  protected readonly page: Page;
  protected readonly toolbar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toolbar = page.locator('.toolbar');
  }

  get undoButton() {
    return this.toolbar.getByRole('button', { name: 'Undo' });
  }

  get redoButton() {
    return this.toolbar.getByRole('button', { name: 'Redo' });
  }

  get helpPaddings() {
    return this.toolbar.getByRole('switch', { name: 'Help Paddings' });
  }

  get palette() {
    return this.toolbar.locator('.palette-section');
  }

  async changeMode(mode: 'mobile' | 'tablet' | 'desktop') {
    const deviceMode = this.toolbar.getByRole('group', { name: 'Device mode' });
    await deviceMode.getByRole('radio', { name: mode }).click();
  }

  async openPalette(name: string) {
    await expect(async () => {
      const paletteBtn = this.palette.getByRole('button', { name });
      await expect(paletteBtn).toHaveAttribute('data-state', 'closed');
      await paletteBtn.click();
      await expect(paletteBtn).toHaveAttribute('data-state', 'open');
    }).toPass({ intervals: [100, 100, 100] });
    return new Palette(this.page);
  }

  async toggleTheme() {
    const dialog = await this.openOptionsMenu();
    await dialog.getByRole('switch', { name: 'Theme' }).click();
  }

  async toggleDataSource() {
    const dialog = await this.openOptionsMenu();
    await dialog.getByRole('switch', { name: 'Data Source' }).click();
  }

  async toggleProperties() {
    await this.toolbar.getByRole('button', { name: 'Toggle Property View' }).click();
  }

  private async openOptionsMenu() {
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeHidden();
    await this.toolbar.getByRole('button', { name: 'Options' }).click();
    await expect(dialog).toBeVisible();
    return dialog;
  }
}
