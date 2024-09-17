import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Column');
  const table = editor.canvas.blockByNth(0, { datatable: true });

  await table.block.locator('.block-table__label').dblclick();
  await editor.inscription.expectHeader('DataTable');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const label = section.input({ label: 'Label' });
  const listOfObjects = section.input({ label: 'List of Objects' });

  const columnsSection = properties.collapsible('Columns');
  const columnHeader = columnsSection.checkbox({ label: 'header (unbound)' });

  await label.expectValue('Label');
  await listOfObjects.expectValue('');
  await listOfObjects.fill('#{data.locations}');
  await columnHeader.expectValue(true);

  await label.fill('New Label');
  await columnHeader.uncheck();
  await columnHeader.expectValue(false);

  await page.reload();
  await editor.canvas.blockByNth(0).block.dblclick();
  await label.expectValue('New Label');
  await listOfObjects.expectValue('#{data.locations}');
});

test('dataTableColumn', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Column');
  await editor.canvas.blockByNth(0).block.dblclick();
  await editor.inscription.expectHeader('DataTableColumn');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const header = section.input({ label: 'Header' });
  const value = section.input({ label: 'Value' });

  await header.expectValue('header');
  await value.expectValue('value');
  await header.fill('new header');
  await value.fill('title');

  await page.reload();
  await editor.canvas.blockByNth(0).block.dblclick();
  await header.expectValue('new header');
  await value.expectValue('title');
});

test('edit column and update table', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Column');
  await editor.canvas.blockByNth(0).block.dblclick();
  await editor.inscription.expectHeader('DataTableColumn');
  const columnProperties = editor.inscription.section('Properties');
  const columnSection = columnProperties.collapsible('General');
  const header = columnSection.input({ label: 'Header' });
  const value = columnSection.input({ label: 'Value' });

  await header.expectValue('header');
  await value.expectValue('value');
  await header.fill('new header');
  await value.fill('title');

  const table = editor.canvas.blockByNth(0, { datatable: true });

  await table.block.locator('.block-table__label').dblclick();
  await editor.inscription.expectHeader('DataTable');
  const properties = editor.inscription.section('Properties');

  const columnsSection = properties.collapsible('Columns');
  const columnHeader = columnsSection.checkbox({ label: 'new header (unbound)' });
  await columnHeader.expectValue(true);

  await columnHeader.uncheck();
  await columnHeader.expectValue(false);
});

test('columns from attribute', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const table = editor.canvas.blockByNth(0, { datatable: true });

  await table.block.locator('.block-table__label').dblclick();
  await editor.inscription.expectHeader('DataTable');

  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const label = section.input({ label: 'Label' });
  const listOfObjects = section.input({ label: 'List of Objects' });

  const columnsSection = properties.collapsible('Columns');
  const columnAdress = columnsSection.checkbox({ label: 'address' });
  const columnBirthday = columnsSection.checkbox({ label: 'birthday' });
  const columnSurname = columnsSection.checkbox({ label: 'surname' });
  const columnFirstName = columnsSection.checkbox({ label: 'first name' });
  const columnAge = columnsSection.checkbox({ label: 'age (unbound)' });

  await label.expectValue('Label');
  await listOfObjects.expectValue('#{data.data.persons}');
  await columnAdress.expectValue(false);
  await columnBirthday.expectValue(true);
  await columnSurname.expectValue(false);
  await columnFirstName.expectValue(true);
  await columnAge.expectValue(true);

  await columnsSection.toggleControl();
  await columnAdress.expectValue(true);
  await columnBirthday.expectValue(true);
  await columnSurname.expectValue(true);
  await columnFirstName.expectValue(true);
  await columnAge.expectValue(true);

  await listOfObjects.fill('#{data.data.strings}');
  const columnString = columnsSection.checkbox({ label: 'strings' });
  const columnAdressNew = columnsSection.checkbox({ label: 'address (unbound)' });
  const columnBirthdayNew = columnsSection.checkbox({ label: 'birthday (unbound)' });
  const columnSurnameNew = columnsSection.checkbox({ label: 'surname (unbound)' });
  const columnFirstNameNew = columnsSection.checkbox({ label: 'first name (unbound)' });
  const columnAgeNew = columnsSection.checkbox({ label: 'age (unbound)' });
  await columnString.expectValue(false);
  await columnAdressNew.expectValue(true);
  await columnBirthdayNew.expectValue(true);
  await columnSurnameNew.expectValue(true);
  await columnFirstNameNew.expectValue(true);
  await columnAgeNew.expectValue(true);
});
