import { expect, test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DatePicker' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('DatePicker');
  const properties = editor.inscription.section('Properties');
  const general = properties.collapsible('General');
  const label = general.input({ label: 'Label' });
  const value = general.input({ label: 'Value' });
  const datePattern = general.input({ label: 'Date Pattern', type: 'text' });
  const showTime = general.checkbox({ label: 'Show Time' });
  const timePattern = general.input({ label: 'Time Pattern', type: 'text' });
  const behaviour = properties.behaviour();

  await label.expectValue('Date Picker');
  await value.expectValue('');
  await datePattern.expectValue('dd.MM.yyyy');
  await showTime.expectValue(false);
  await expect(timePattern.locator).toBeHidden();
  await label.fill('select');
  await value.fill('bla');
  await datePattern.fill('dd/MM/yy');
  await showTime.check();
  await expect(timePattern.locator).toBeVisible();
  await timePattern.expectValue('HH:mm');
  await timePattern.fill('HH:mm:ss');
  await behaviour.fillRequired();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await label.expectValue('select');
  await value.expectValue('bla');
  await datePattern.expectValue('dd/MM/yy');
  await showTime.expectValue(true);
  await timePattern.expectValue('HH:mm:ss');
  await behaviour.expectRequired();
});
