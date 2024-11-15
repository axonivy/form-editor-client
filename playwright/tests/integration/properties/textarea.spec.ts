import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Textarea' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Textarea');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const label = section.input({ label: 'Label' });
  const value = section.input({ label: 'Value' });
  const rows = section.input({ label: 'Visible Rows', type: 'number' });
  const behaviour = properties.behaviour();

  await label.expectValue('Textarea');
  await value.expectValue('');
  await rows.expectValue('5');
  await label.fill('New Label');
  await value.fill('New Value');
  await rows.fill('3');
  await behaviour.fillRequired();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await label.expectValue('New Label');
  await value.expectValue('New Value');
  await rows.expectValue('3');
  await behaviour.expectRequired();
});
