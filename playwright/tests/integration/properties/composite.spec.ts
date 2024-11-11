import { expect, test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('address', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page);
  const palette = await editor.toolbar.openPalette('Composites');
  await palette.dndTo('Address Component', editor.canvas.dropZone);

  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Composite');
  const properties = editor.inscription.section('Properties');
  const general = properties.collapsible('General');
  const composite = general.input({ label: 'Composite' });
  const method = general.select({ label: 'Start Method' });
  const parameters = properties.collapsible('Parameters');
  const addressParam = parameters.input({ label: 'Address' });
  const labelParam = parameters.input({ label: 'Label' });

  await composite.expectValue('form.test.project.AddressComponent');
  await expect(composite.locator).toBeDisabled();
  await method.expectValue('');
  await method.expectOptions(['start(Address)', 'empty()']);
  await expect(addressParam.locator).toBeHidden();
  await expect(labelParam.locator).toBeHidden();

  await method.choose('empty()');
  await expect(addressParam.locator).toBeHidden();
  await expect(labelParam.locator).toBeVisible();

  await method.choose('start(Address)');
  await addressParam.expectValue('');
  await addressParam.fill('#{data.address}');
  await labelParam.expectValue('');
  await labelParam.fill('my composite');

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await method.expectValue('start(Address)');
  await addressParam.expectValue('#{data.address}');
  await labelParam.expectValue('my composite');
});

test('person', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page);
  const palette = await editor.toolbar.openPalette('Composites');
  await palette.dndTo('Person Component', editor.canvas.dropZone);

  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Composite');
  const properties = editor.inscription.section('Properties');
  const general = properties.collapsible('General');
  const composite = general.input({ label: 'Composite' });
  const method = general.select({ label: 'Start Method' });
  const parameters = properties.collapsible('Parameters');
  const person = parameters.input({ label: 'Person' });

  await composite.expectValue('form.test.project.PersonComponent');
  await expect(composite.locator).toBeDisabled();
  await method.expectValue('');
  await method.expectOptions(['start(Person)']);
  await method.choose('start(Person)');

  await person.expectValue('');
  await person.fill('#{data.person}');

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await method.expectValue('start(Person)');
  await person.expectValue('#{data.person}');
});

test('parameters browser', async ({ page }) => {
  const editor = await FormEditor.openForm(page);
  await editor.canvas.blockByText('PersonComponent').inscribe();
  const section = editor.inscription.section('Properties');
  const parameters = section.collapsible('Parameters');
  const person = parameters.input({ label: 'Person' });

  let browser = await person.openBrowser();
  await browser.expectEntries(['data.person']);
  await browser.close();

  await editor.canvas.blockByText('AddressComponent').inscribe();
  const address = parameters.input({ label: 'Address' });
  browser = await address.openBrowser();
  await browser.expectEntries(['data.address', 'data.person.billingAddress', 'data.person.deliveryAddress']);
});
