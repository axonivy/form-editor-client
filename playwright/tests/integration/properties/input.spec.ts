import { expect, test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Input' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Input');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const label = section.input({ label: 'Label' });
  const value = section.input({ label: 'Value' });
  const type = section.select({ label: 'Type' });
  const formattingSection = properties.collapsible('Formatting');
  const decimalPlaces = formattingSection.input({ label: 'Decimal Places', type: 'number' });
  const symbol = formattingSection.input({ label: 'Symbol' });
  const symbolPosition = formattingSection.select({ label: 'Symbol Position' });
  const behaviour = properties.behaviour();

  await label.expectValue('Input');
  await value.expectValue('');
  await type.expectValue('Text');
  await label.fill('New Label');
  await value.fill('New Value');
  await type.choose('Number');
  await decimalPlaces.expectValue('0');
  await symbol.expectValue('');
  await decimalPlaces.fill('2');
  await symbol.fill('CHF ');
  await symbolPosition.choose('Prefix');
  await behaviour.fillRequired();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await label.expectValue('New Label');
  await value.expectValue('New Value');
  await type.expectValue('Number');
  await decimalPlaces.expectValue('2');
  await symbol.expectValue('CHF ');
  await symbolPosition.expectValue('Prefix');
  await behaviour.expectRequired();
});

test('id', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  await editor.canvas.blockByNth(0).inscribe();
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const id = section.input({ label: 'Id' });
  await expect(id.locator).toHaveAttribute('placeholder', 'Input1');
  await id.expectEmpty();
});
