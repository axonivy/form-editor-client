import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('filter', async ({ page }) => {
  const { toolbar } = await FormEditor.openMock(page);
  const palette = await toolbar.openPalette('All Components');
  const button = palette.paletteItem('Button');
  const input = palette.paletteItem('Input');
  await palette.expectSections(['Elements', 'Actions', 'Structures']);
  await expect(button).toBeVisible();
  await expect(input).toBeVisible();

  await palette.filter('inp');
  await palette.expectSections(['Elements']);
  await expect(button).toBeHidden();
  await expect(input).toBeVisible();
});

test('add elements', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page);
  const palette = await editor.toolbar.openPalette('Structures');
  await palette.dndTo('Layout', editor.canvas.dropZone);
  const layout = editor.canvas.blockByNth(0, { layout: true });
  await expect(layout.block).toContainText('Drag first element inside the layout');

  await editor.toolbar.openPalette('Elements');
  await palette.dndTo('Text', layout.block);
  const text = editor.canvas.blockByNth(0);
  await expect(layout.block).not.toContainText('Drag first element inside the layout');
  await expect(layout.block).toContainText('This is a Text');

  await editor.toolbar.openPalette('Actions');
  await palette.dndTo('Button', text.block);
  await editor.canvas.expectFormOrder(['Action', 'This is a Text']);
});

test('data', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page);
  const dataButton = editor.toolbar.dataButton;
  await expect(dataButton).toBeVisible();
  await dataButton.click();
  await expect(page.getByRole('dialog', { name: 'Create from data' })).toBeVisible();
});
