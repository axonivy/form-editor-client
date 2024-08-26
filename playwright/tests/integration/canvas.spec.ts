import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test.describe('empty', () => {
  test('create init', async ({ page }) => {
    const { canvas } = await FormEditor.openNewForm(page);
    const dialog = await canvas.openInitCreateDialog();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toBeHidden();

    await canvas.openInitCreateDialog();
    await dialog.getByRole('button', { name: 'Create' }).click();
    await expect(dialog).toBeHidden();
    await expect(canvas.blockByText('Cancel').block).toBeVisible();
    await expect(canvas.blockByText('Proceed').block).toBeVisible();
  });

  test('init data', async ({ page }) => {
    const { canvas } = await FormEditor.openForm(page, 'form/test/project/empty/empty');
    const dialog = await canvas.openInitCreateDialog();
    await expect(dialog.getByRole('row')).toHaveCount(5);
  });
});

test.describe('dnd', () => {
  test('move', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').dndTo(canvas.blockByText('Address'));
    await canvas.expectFormOrder(['Lastname', 'Firstname', 'Address']);
  });

  test('delete', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    const dropZone = canvas.locator.locator('.delete-drop-zone');
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').block.hover();
    await page.mouse.down();
    await expect(dropZone).toBeHidden();
    await page.mouse.move(10, 10);
    await expect(dropZone).toBeVisible();
    await dropZone.hover();
    await page.mouse.up();
    await canvas.expectFormOrder(['Lastname', 'Address']);
  });
});

test.describe('keyboard', () => {
  test('move', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').select();
    await page.keyboard.press('ArrowDown');
    await canvas.expectFormOrder(['Lastname', 'Firstname', 'Address']);
    await page.keyboard.press('ArrowDown');
    await canvas.expectFormOrder(['Lastname', 'Address', 'Firstname']);
  });

  test('delete', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').select();
    await page.keyboard.press('Delete');
    await canvas.expectFormOrder(['Lastname', 'Address']);
  });
});

test.describe('quickbar', () => {
  test('delete', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').quickAction('Delete');
    await canvas.expectFormOrder(['Lastname', 'Address']);
  });

  test('duplicate', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname']);
    await canvas.blockByText('Firstname').quickAction('Duplicate');
    await canvas.expectFormOrder(['Firstname', 'Firstname', 'Lastname']);
  });

  test('add', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').quickAction('All Components');
    await page.getByRole('button', { name: 'Input' }).click();
    await canvas.expectFormOrder(['Label', 'Firstname', 'Lastname', 'Address']);
  });
});
