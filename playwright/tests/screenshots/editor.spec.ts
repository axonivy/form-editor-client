import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';
import { screenshot } from './screenshot-util';

test('editor', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'src_hd/form/test/project/free/free');
  await editor.canvas.blockByNth(0).select();
  await screenshot(page, 'editor', { height: 550, width: 1000 });
});

test('preview mode', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'src_hd/form/test/project/free/free');
  await expect(editor.canvas.blockByNth(0).block).toBeVisible();
  await editor.toolbar.helpPaddings.click();
  await screenshot(page, 'editor-preview', { height: 550, width: 1000 });
});

test('mobile mode', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'src_hd/form/test/project/free/free');
  await expect(editor.canvas.blockByNth(0).block).toBeVisible();
  await editor.toolbar.toggleChangeMode();
  await editor.toolbar.toggleChangeMode();
  await screenshot(page, 'editor-mobile', { height: 550, width: 1000 });
});
