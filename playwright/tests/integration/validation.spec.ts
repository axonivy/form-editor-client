import { test, expect } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('canvas', async ({ page }) => {
  const { canvas } = await FormEditor.openMock(page);
  await expect(canvas.blockByText('Firstname').block).not.toHaveClass(/validation/);
  await expect(canvas.blockByText('Address').block).toHaveClass(/validation error/);
  await expect(canvas.blockByText('City').block).toHaveClass(/validation warning/);
});

test('inscription input', async ({ page }) => {
  const { canvas, inscription } = await FormEditor.openMock(page);
  await canvas.blockByText('Address').inscribe();
  const input = inscription.section('Properties').collapsible('General').input({ label: 'Value' });
  await expect(input.locator).toHaveAccessibleDescription(/Value is required/);
  await input.fill('bla');
  await expect(input.locator).not.toHaveAccessibleDescription('Value is required');
});
