import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('change device mode', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const toolbar = editor.toolbar;
  await toolbar.toggleChangeMode();
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'tablet');
  await toolbar.toggleChangeMode();
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'mobile');
  await page.keyboard.press('s');
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

  await page.keyboard.press('ControlOrMeta+z');
  await expect(toolbar.undoButton).toBeDisabled();
  await expect(toolbar.redoButton).toBeEnabled();

  await page.keyboard.press('ControlOrMeta+Shift+z');
  await expect(toolbar.undoButton).toBeEnabled();
  await expect(toolbar.redoButton).toBeDisabled();
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
  await page.keyboard.press('e');
  await editor.canvas.expectHelpPaddings(true);
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

test('open process', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const msg1 = page.waitForEvent('console');
  await editor.toolbar.locator.getByRole('button', { name: 'Open Process' }).click();
  expect((await msg1).text()).toContain('actionId: openProcess');

  const msg2 = page.waitForEvent('console');
  await page.keyboard.press('p');
  expect((await msg2).text()).toContain('actionId: openProcess');
});

test('open data class', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const msg1 = page.waitForEvent('console');
  await editor.toolbar.locator.getByRole('button', { name: 'Open Data Class' }).click();
  expect((await msg1).text()).toContain('actionId: openDataClass');

  const msg2 = page.waitForEvent('console');
  await page.keyboard.press('d');
  expect((await msg2).text()).toContain('actionId: openDataClass');
});

test('help', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const msg1 = page.waitForEvent('console');
  await editor.toolbar.toggleProperties();
  await editor.inscription.header.getByRole('button', { name: 'Open Help' }).click();
  expect((await msg1).text()).toContain('actionId: openUrl');

  const msg2 = page.waitForEvent('console');
  await page.keyboard.press('F1');
  expect((await msg2).text()).toContain('actionId: openUrl');
  expect((await msg2).text()).toContain('payload: https://dev.axonivy.com');
});
