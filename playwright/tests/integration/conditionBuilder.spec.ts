import { expect, test, type Page } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test.describe('Condition Builder', () => {
  test('Add Condition', async ({ page }) => {
    const editor = await FormEditor.openMock(page);
    await editor.canvas.blockByNth(0).inscribe();
    await editor.inscription.expectHeader('Input');
    const properties = editor.inscription.section('Properties');
    const behaviour = properties.behaviour();

    await behaviour.openConditionBuilder();
    await applyConditionBuilder(page);
    await behaviour.expectVisibleAfterBuilder();
  });
});

export async function applyConditionBuilder(page: Page) {
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByText('Condition').first().click();
  const condition = page.locator('.condition-builder__condition');
  const group = page.locator('.condition-builder__group');

  expect(page.getByRole('dialog').getByRole('combobox').nth(0)).toHaveText('Basic Condition');
  expect(await condition.count()).toBe(1);
  expect(await condition.locator('.ui-inputgroup').count()).toBe(2);

  await condition.locator('.ui-input').nth(0).fill('data.value1');
  await condition.locator('.ui-input').nth(1).fill('10');

  await page.getByLabel('Add Condition').click();
  const newConditions = await condition.count();
  expect(newConditions).toBe(2);
  await condition.nth(1).locator('.ui-input').nth(0).fill('data.value2');
  await condition.nth(1).getByRole('combobox').click();
  await page.getByRole('option', { name: 'greater than', exact: true }).first().click();
  await condition.nth(1).locator('.ui-input').nth(1).fill('5');

  await page.getByRole('dialog').getByRole('combobox').nth(0).click();
  await page.getByRole('option', { name: 'Nested Condition', exact: true }).first().click();

  expect(await group.count()).toBe(1);
  await page.getByLabel('Add Condition Group').click();
  expect(await group.count()).toBe(2);
  await page.locator('.ui-dialog-content').getByRole('combobox').nth(4).click();
  await page.getByRole('option', { name: 'or', exact: true }).first().click();

  await condition.nth(2).locator('.ui-input').nth(0).fill('data.value3');
  await page.locator('.condition-builder__condition').nth(2).getByRole('combobox').click();
  await page.getByRole('option', { name: 'less than', exact: true }).first().click();
  await condition.nth(2).locator('.ui-input').nth(1).fill('6');

  await page.getByRole('button', { name: 'Apply' }).click();
}
