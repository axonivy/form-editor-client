import { expect, test } from '@playwright/test';
import { FormEditor, testForm } from '../page-objects/form-editor';

test('theme light', async ({ page }) => {
  await FormEditor.openForm(page, testForm, { theme: 'light' });
  await expect(page.locator('html')).toHaveClass('light');
});

test('theme dark', async ({ page }) => {
  await FormEditor.openForm(page, testForm, { theme: 'dark' });
  await expect(page.locator('html')).toHaveClass('dark');
});

test('readonly false', async ({ page }) => {
  const editor = await FormEditor.openForm(page, testForm, { readonly: false });
  await editor.canvas.expectHelpPaddings(true);
  await expect(editor.toolbar.redoButton).toBeVisible();
  await expect(editor.toolbar.undoButton).toBeVisible();
  await expect(editor.toolbar.helpPaddings).toBeVisible();
  await expect(editor.toolbar.palette).toBeVisible();
});

test('readonly true', async ({ page }) => {
  const editor = await FormEditor.openForm(page, testForm, { readonly: true });
  await editor.canvas.expectHelpPaddings(false);
  await expect(editor.toolbar.redoButton).toBeHidden();
  await expect(editor.toolbar.undoButton).toBeHidden();
  await expect(editor.toolbar.helpPaddings).toBeHidden();
  await expect(editor.toolbar.palette).toBeHidden();
});
