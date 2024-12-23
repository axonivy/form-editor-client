import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('change device mode', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const toolbar = editor.toolbar;
  await toolbar.toggleChangeMode();
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'tablet');
  await toolbar.toggleChangeMode();
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'mobile');
  await toolbar.toggleChangeMode();
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'desktop');
});

test('undo/redo', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
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

test('palette', async ({ page }) => {
  const { toolbar } = await FormEditor.openMock(page);
  await expect(toolbar.palette.locator('.palette-button')).toHaveCount(6);
});

test('help paddings', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const toolbar = editor.toolbar;
  await editor.canvas.expectHelpPaddings(true);
  await toolbar.helpPaddings.click();
  await editor.canvas.expectHelpPaddings(false);
});

test('theme', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const toolbar = editor.toolbar;
  const html = page.locator('html');
  await expect(html).toHaveClass('light');
  await toolbar.toggleTheme();
  await expect(html).toHaveClass('dark');
});

test('properties', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const toolbar = editor.toolbar;
  await expect(editor.inscription.view).toBeHidden();
  await toolbar.toggleProperties();
  await expect(editor.inscription.view).toBeVisible();
  await editor.inscription.expectEmptyPage();
});

test('responsive', async ({ page }) => {
  const {
    toolbar: { palette, redoButton, undoButton }
  } = await FormEditor.openMock(page);
  const paletteBtn = palette.locator('.category-label:has-text("Structure")');
  await expect(paletteBtn).toBeVisible();
  await expect(undoButton).toBeVisible();
  await expect(redoButton).toBeVisible();

  await page.setViewportSize({ width: 600, height: 500 });
  await expect(paletteBtn).toBeHidden();
  await expect(undoButton).toBeVisible();
  await expect(redoButton).toBeVisible();

  await page.setViewportSize({ width: 400, height: 500 });
  await expect(paletteBtn).toBeHidden();
  await expect(undoButton).toBeHidden();
  await expect(redoButton).toBeHidden();
});
