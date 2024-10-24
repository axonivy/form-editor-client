import { expect, test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Select' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Select');
  const properties = editor.inscription.section('Properties');
  const general = properties.collapsible('General');
  const label = general.badge({ label: 'Label' });
  const value = general.badge({ label: 'Value' });
  const staticOptions = properties.collapsible('Static Options');
  const table = staticOptions.table(['input', 'input']);
  const dynamicOptions = properties.collapsible('Dynamic Options');
  const list = dynamicOptions.badge({ label: 'List of objects' });
  const itemLabel = dynamicOptions.badge({ label: 'Object Label' });
  const itemValue = dynamicOptions.badge({ label: 'Object Value' });
  const behaviour = properties.behaviour();

  await label.expectValue('Select');
  await value.expectValue('');
  await table.expectEmpty();
  await list.expectValue('');
  await expect(itemLabel.locator).toBeHidden();
  await expect(itemValue.locator).toBeHidden();
  await label.fill('select');
  await value.fill('bla');
  const row = await table.addRow();
  await row.fill(['one', 'two']);
  await list.fill('#{data.list}');
  await itemLabel.fill('label');
  await itemValue.fill('value');
  await behaviour.fillRequired();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await label.expectValue('select');
  await value.expectValue('bla');
  await table.row(0).expectValues(['one', 'two']);
  await list.expectValue('list');
  await itemLabel.expectValue('label');
  await itemValue.expectValue('value');
  await behaviour.expectRequired();
});
