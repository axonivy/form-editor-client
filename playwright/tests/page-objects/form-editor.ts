import type { Locator, Page } from '@playwright/test';
import { Palette } from './palette';

export class FormEditor {
  protected readonly page: Page;
  protected readonly editor: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editor = this.page.locator('.form-editor-root');
  }

  static async open(page: Page) {
    await page.goto('');
    await page.addStyleTag({ content: '.form-editor-root {transition: none !important;}' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    return new FormEditor(page);
  }

  palette() {
    return new Palette(this.page, this.editor);
  }
}
