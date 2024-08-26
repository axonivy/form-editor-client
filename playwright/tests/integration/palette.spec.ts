import { test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('has sections', async ({ page }) => {
  const editor = await FormEditor.openForm(page);
  await editor.toolbar.expectCategoryCount(5);
});
