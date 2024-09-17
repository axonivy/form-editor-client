import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Button' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Button');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const name = section.input({ label: 'Name' });
  const action = section.input({ label: 'Action' });
  const variant = section.select({ label: 'Variant' });
  const icon = section.select({ label: 'Icon' });

  await name.expectValue('Action');
  await action.expectValue('');
  await variant.expectValue('Primary');
  await icon.expectValue('Select an option');
  await name.fill('Cancel');
  await action.fill('#{locig.close}');
  await variant.choose('Secondary');
  await icon.choose('Home');

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await name.expectValue('Cancel');
  await action.expectValue('#{locig.close}');
  await variant.expectValue('Secondary');
  await icon.expectValue('Home');
});
