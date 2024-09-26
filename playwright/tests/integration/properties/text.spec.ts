import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Text' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Text');
  const properties = editor.inscription.section('Properties');
  const general = properties.collapsible('General');
  const content = general.input({ label: 'Content' });
  const type = general.select({ label: 'Type' });
  const behaviour = properties.behaviour();

  await content.expectValue('This is a text');
  await type.expectValue('Text');
  await content.fill('lorem ipsum');
  await type.choose('Markdown');
  await behaviour.fillVisible();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await content.expectValue('lorem ipsum');
  await type.expectValue('Markdown');
  await behaviour.expectVisible();
});
