import { test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('new empty form', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page);
  await editor.canvas.expectEmpty();
});
