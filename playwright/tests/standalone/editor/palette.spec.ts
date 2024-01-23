import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test.describe('palette', () => {
  test('has sections', async ({ page }) => {
    const processEditor = await FormEditor.open(page);
    const palette = processEditor.palette();
    await palette.expectItemCount(3);
  });
});
