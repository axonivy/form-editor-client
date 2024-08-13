import type { Page } from '@playwright/test';
import { Toolbar } from './toolbar';

export class FormEditor {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private static async open(page: Page, url = '') {
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
    return new FormEditor(page);
  }

  static async openForm(page: Page, file: string) {
    const server = process.env.BASE_URL ?? 'localhost:8081';
    const app = process.env.TEST_APP ?? 'designer';
    const serverUrl = server.replace(/^https?:\/\//, '');
    const pmv = 'form-test-project';
    const url = `?server=${serverUrl}&app=${app}&pmv=${pmv}&file=form/test/project/${file}/${file}.f.json`;
    return await this.open(page, url);
  }

  static async openMock(page: Page) {
    return await this.open(page, 'mock.html');
  }

  toolbar() {
    return new Toolbar(this.page);
  }
}
