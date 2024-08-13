import { test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('has sections', async ({ page }) => {
  const processEditor = await FormEditor.openForm(page, 'test');
  const toolbar = processEditor.toolbar();
  await toolbar.expectCategoryCount(5);
  await toolbar.expectItemInCategoryCount(1, 1);
  await toolbar.expectItemInCategoryCount(2, 4);
});
