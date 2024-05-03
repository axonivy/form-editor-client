import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test.describe('screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
  });

  test('form editor', async ({ page }) => {
    await FormEditor.open(page);
    await page.locator(".block-input").click();
    await page.locator(".property-item").first().isVisible();
    await screenshot(page, 'form-editor.png', { height: 350, width: 700 });
  });
});

async function screenshot(page: Page, name: string, size?: { width?: number; height?: number }) {
  await page.setViewportSize({ width: size?.width ?? 700, height: size?.height ?? 550 });
  await hideQuery(page);
  const dir = process.env.SCREENSHOT_DIR ?? './target';
  const buffer = await page.screenshot({ path: `${dir}/screenshots/${name}`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(3000);
}

async function hideQuery(page: Page) {
  await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
}
