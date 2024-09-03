import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('filter', async ({ page }) => {
  const { toolbar } = await FormEditor.openMock(page);
  const palette = await toolbar.openPalette('All Components');
  const button = palette.paletteItem('Button');
  const input = palette.paletteItem('Input');
  await palette.expectSections(['Elements', 'Action', 'Structure']);
  await expect(button).toBeVisible();
  await expect(input).toBeVisible();

  await palette.filter('inp');
  await palette.expectSections(['Elements']);
  await expect(button).toBeHidden();
  await expect(input).toBeVisible();
});

test('add elements', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page);
  const palette = await editor.toolbar.openPalette('Structure');
  await palette.dndTo('Layout', editor.canvas.dropZone);
  const layout = editor.canvas.blockByNth(0, true);
  await expect(layout.block).toContainText('Drag first element inside the layout');

  await editor.toolbar.openPalette('Elements');
  await palette.dndTo('Text', layout.block);
  const text = editor.canvas.blockByNth(0);
  await expect(layout.block).not.toContainText('Drag first element inside the layout');
  await expect(layout.block).toContainText('This is a text');

  await editor.toolbar.openPalette('Action');
  await palette.dndTo('Button', text.block);
  await editor.canvas.expectFormOrder(['Action', 'This is a text']);
});

test('data', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'form/test/project/empty/empty');
  const palette = await editor.toolbar.openPalette('Data');
  await palette.expectSections(['data', 'data.address', 'data.address.location']);
  await expect(palette.paletteItem('age')).toBeVisible();
  await expect(palette.paletteItem('aproved')).toBeVisible();
  await expect(palette.paletteItem('zip')).toBeVisible();
  await expect(palette.paletteItem('street')).toBeVisible();
  await expect(palette.paletteItem('geo')).toBeVisible();
  await expect(palette.paletteItem('country')).toBeVisible();
});
