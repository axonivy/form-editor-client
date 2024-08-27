import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Input' });
  await editor.canvas.blockByNth(0).block.dblclick();
  await editor.inscription.expectHeader('Input');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const label = section.input({ label: 'Label' });
  const required = section.checkbox({ label: 'Required' });
  const value = section.input({ label: 'Value' });
  const type = section.select({ label: 'Type' });

  await label.expectValue('Label');
  await required.expectValue(false);
  await value.expectValue('');
  await type.expectValue('Text');
  await label.fill('New Label');
  await required.check();
  await value.fill('New Value');
  await type.choose('Number');

  await page.reload();
  await editor.canvas.blockByNth(0).block.dblclick();
  await label.expectValue('New Label');
  await required.expectValue(true);
  await value.expectValue('New Value');
  await type.expectValue('Number');
});
