import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test.describe('palette', () => {
  test('has sections', async ({ page }) => {
    const processEditor = await FormEditor.open(page);
    const toolbar = processEditor.toolbar();
    await toolbar.expectCategoryCount(4);
    await toolbar.expectItemInCategoryCount(0, 1);
    await toolbar.expectItemInCategoryCount(1, 2);
  });
});
