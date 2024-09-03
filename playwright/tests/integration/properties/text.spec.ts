import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Text' });
  await editor.canvas.blockByNth(0).block.dblclick();
  await editor.inscription.expectHeader('Text');
  const properties = editor.inscription.section('Properties');
  const general = properties.collapsible('General');
  const content = general.input({ label: 'Content' });
  const type = general.select({ label: 'Type' });

  await content.expectValue('This is a text');
  await type.expectValue('Text');
  await content.fill('lorem ipsum');
  await type.choose('Markdown');

  await page.reload();
  await editor.canvas.blockByNth(0).block.dblclick();
  await content.expectValue('lorem ipsum');
  await type.expectValue('Markdown');
});