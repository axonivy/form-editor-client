import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Link' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Link');
  const properties = editor.inscription.section('Properties');
  const general = properties.collapsible('General');
  const name = general.input({ label: 'Name' });
  const href = general.input({ label: 'Href' });

  await name.expectValue('link');
  await href.expectValue('');
  await name.fill('axon home');
  await href.fill('www.axonivy.com');

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await name.expectValue('axon home');
  await href.expectValue('www.axonivy.com');
});
