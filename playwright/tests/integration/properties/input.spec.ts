import { test } from '@playwright/test';
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
  const behaviour = properties.behaviour();

  await label.expectValue('Input');
  await value.expectValue('');
  await type.expectValue('Text');
  await label.fill('New Label');
  await value.fill('New Value');
  await type.choose('Number');
  await behaviour.fillRequired();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await label.expectValue('New Label');
  await value.expectValue('New Value');
  await type.expectValue('Number');
  await behaviour.expectRequired();
});
