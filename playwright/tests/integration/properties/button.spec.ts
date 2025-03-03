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
  const type = section.select({ label: 'Type' });
  const variant = section.select({ label: 'Variant' });
  const behaviour = properties.behaviour();

  await name.expectValue('Action');
  await action.expectValue('');
  await type.expectValue('Button');
  await variant.expectValue('Primary');
  await name.fill('Cancel');
  await action.fill('#{logic.close}');
  await type.choose('Submit');
  await variant.choose('Secondary');
  await behaviour.fillDisable();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await name.expectValue('Cancel');
  await action.expectValue('close');
  await type.expectValue('Submit');
  await variant.expectValue('Secondary');
  await behaviour.excpectDisabled();
});
