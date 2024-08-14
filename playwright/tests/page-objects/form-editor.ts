import type { Page } from '@playwright/test';
import { Toolbar } from './toolbar';
import { Canvas } from './canvas';
import { Inscription } from './inscription';

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

  static async openForm(page: Page, file: string, options?: { readonly?: boolean; theme?: string }) {
    const server = process.env.BASE_URL ?? 'localhost:8081';
    const app = process.env.TEST_APP ?? 'designer';
    const serverUrl = server.replace(/^https?:\/\//, '');
    const pmv = 'form-test-project';
    let url = `?server=${serverUrl}&app=${app}&pmv=${pmv}&file=form/test/project/${file}/${file}.f.json`;
    if (options) {
      url += Object.entries(options)
        .map(([key, value]) => `&${key}=${value}`)
        .join('');
    }
    return await this.open(page, url);
  }

  static async openMock(page: Page) {
    return await this.open(page, 'mock.html');
  }

  get toolbar() {
    return new Toolbar(this.page);
  }

  get canvas() {
    return new Canvas(this.page);
  }

  get inscription() {
    return new Inscription(this.page);
  }
}
