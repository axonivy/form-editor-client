import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Checkbox' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Checkbox');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const label = section.input({ label: 'Label' });
  const selected = section.input({ label: 'Selected' });

  await label.expectValue('Label');
  await selected.expectValue('true');
  await label.fill('Hi');
  await selected.fill('#{data.approve}');

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await label.expectValue('Hi');
  await selected.expectValue('#{data.approve}');
});
