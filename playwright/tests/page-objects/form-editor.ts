import type { Page } from '@playwright/test';
import { Toolbar } from './toolbar';

export class FormEditor {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async open(page: Page) {
    await page.goto('');
    await page.addStyleTag({ content: '.form-editor-root {transition: none !important;}' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    return new FormEditor(page);
  }

  toolbar() {
    return new Toolbar(this.page);
  }
}
