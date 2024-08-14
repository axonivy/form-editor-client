import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('change device mode', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'test');
  const toolbar = editor.toolbar;
  await toolbar.changeMode('mobile');
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'mobile');
  await toolbar.changeMode('tablet');
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'tablet');
  await toolbar.changeMode('desktop');
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'desktop');
});

test('undo/redo', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'test');
  const toolbar = editor.toolbar;
  await expect(toolbar.undoButton).toBeDisabled();
  await expect(toolbar.redoButton).toBeDisabled();

  await editor.canvas.locator.locator('.draggable').first().click();
  await page.keyboard.press('ArrowDown');
  await expect(toolbar.undoButton).toBeEnabled();
  await expect(toolbar.redoButton).toBeDisabled();

  await toolbar.undoButton.click();
  await expect(toolbar.undoButton).toBeDisabled();
  await expect(toolbar.redoButton).toBeEnabled();

  await toolbar.redoButton.click();
  await expect(toolbar.undoButton).toBeEnabled();
  await expect(toolbar.redoButton).toBeDisabled();
  await toolbar.undoButton.click();
});

test('has sections', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'test');
  await editor.toolbar.expectCategoryCount(5);
});

test('help paddings', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'test');
  const toolbar = editor.toolbar;
  await editor.canvas.expectHelpPaddings(true);
  await toolbar.helpPaddings.click();
  await editor.canvas.expectHelpPaddings(false);
});

test('theme', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'test');
  const toolbar = editor.toolbar;
  const html = page.locator('html');
  await expect(html).toHaveClass('light');
  await toolbar.toggleTheme();
  await expect(html).toHaveClass('dark');
});

test('data source', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'test');
  const toolbar = editor.toolbar;
  expect(editor.canvas.locator).toBeVisible();
  await toolbar.toggleDataSource();
  expect(editor.canvas.locator).toBeHidden();
  await expect(page.getByRole('textbox')).toHaveValue(/schema/);
});

test('properties', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'test');
  const toolbar = editor.toolbar;
  await expect(editor.inscription.locator).toBeHidden();
  await toolbar.toggleProperties();
  await expect(editor.inscription.locator).toBeVisible();
  await editor.inscription.expectEmptyPage();
});