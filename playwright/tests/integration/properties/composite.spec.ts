import { expect, test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('address', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page);
  const palette = await editor.toolbar.openPalette('Composite');
  await palette.dndTo('Address Component', editor.canvas.dropZone);

  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Composite');
  const properties = editor.inscription.section('Properties');
  const parameters = editor.inscription.section('Parameters');
  const section = properties.collapsible('General');
  const name = section.input({ label: 'Name' });
  const method = section.select({ label: 'Start Method' });
  const section2 = parameters.collapsible('General');
  const address = section2.input({ label: 'Address' });

  await name.expectValue('form.test.project.AddressComponent');
  await method.expectValue('');
  await method.expectOptions(['start(Address)', 'empty()']);
  await method.choose('empty()');
  await parameters.toggle();
  await expect(address.locator).toBeHidden();

  await properties.toggle();
  await method.choose('start(Address)');
  await parameters.toggle();
  await address.expectValue('');
  await address.fill('#{data.address}');

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await name.expectValue('form.test.project.AddressComponent');
  await method.expectValue('start(Address)');
  await parameters.toggle();
  await address.expectValue('#{data.address}');
});

test('person', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page);
  const palette = await editor.toolbar.openPalette('Composite');
  await palette.dndTo('Person Component', editor.canvas.dropZone);

  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Composite');
  const properties = editor.inscription.section('Properties');
  const parameters = editor.inscription.section('Parameters');
  const section = properties.collapsible('General');
  const name = section.input({ label: 'Name' });
  const method = section.select({ label: 'Start Method' });
  const section2 = parameters.collapsible('General');
  const person = section2.input({ label: 'Person' });

  await name.expectValue('form.test.project.PersonComponent');
  await method.expectValue('');
  await method.expectOptions(['start(Person)']);
  await method.choose('start(Person)');
  await parameters.toggle();

  await person.expectValue('');
  await person.fill('#{data.person}');

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await name.expectValue('form.test.project.PersonComponent');
  await method.expectValue('start(Person)');
  await parameters.toggle();
  await person.expectValue('#{data.person}');
});

test('parameters browser', async ({ page }) => {
  const editor = await FormEditor.openForm(page);
  await editor.canvas.blockByText('PersonComponent').inscribe();
  const parameters = editor.inscription.section('Parameters');
  const section = parameters.collapsible('General');
  const person = section.input({ label: 'Person' });

  await parameters.toggle();
  let browser = await person.openBrowser();
  await browser.expectEntries(['data.person']);
  await browser.close();

  await editor.canvas.blockByText('AddressComponent').inscribe();
  const address = section.input({ label: 'Address' });
  browser = await address.openBrowser();
  await browser.expectEntries(['data.address', 'data.person.billingAddress', 'data.person.deliveryAddress']);
});
