import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
});

test('form editor', async ({ page }) => {
  await FormEditor.openMock(page);
  await expect(page.locator('.block-input').first()).toBeVisible();
  await screenshot(page, 'form-editor.png', { height: 550, width: 1000 });
});

async function screenshot(page: Page, name: string, size?: { width?: number; height?: number }) {
  await page.setViewportSize({ width: size?.width ?? 700, height: size?.height ?? 550 });
  const dir = process.env.SCREENSHOT_DIR ?? './target';
  const buffer = await page.screenshot({ path: `${dir}/screenshots/${name}`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(3000);
}
