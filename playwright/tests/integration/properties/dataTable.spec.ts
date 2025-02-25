import { test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Column');
  const table = editor.canvas.blockByNth(0, { datatable: true });

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await editor.inscription.expectHeader('DataTable');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const listOfObjects = section.input({ label: 'List of Objects' });
  const behaviour = properties.behaviour();

  const columnsSection = properties.collapsible('Columns');
  const columnHeader = columnsSection.listItem({ label: 'header' });

  await listOfObjects.expectValue('');
  await listOfObjects.fill('#{data.locations}');
  await columnHeader.expectButtonsCount(2);

  await behaviour.fillVisible();

  await page.reload();
  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await table.expectSelected();
  await listOfObjects.expectValue('locations');
  await behaviour.expectVisible();
});

test('dataTableColumn', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Column');
  await editor.canvas.blockByNth(1).inscribe();
  await editor.inscription.expectHeader('DataTableColumn');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const header = section.input({ label: 'Header' });
  const content = properties.collapsible('Content');
  const value = content.input({ label: 'Value' });
  const behaviour = properties.behaviour();

  await header.expectValue('header');
  await value.expectValue('');
  await header.fill('new header');
  await value.fill('title');

  await behaviour.fillVisible();

  await page.reload();
  await editor.canvas.blockByNth(1).inscribe();
  await header.expectValue('new header');
  await value.expectValue('title');
  await behaviour.expectVisible();
});

test('edit column and update table', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Column');
  await editor.canvas.blockByNth(1).inscribe();
  await editor.inscription.expectHeader('DataTableColumn');
  const columnProperties = editor.inscription.section('Properties');
  const columnSection = columnProperties.collapsible('General');
  const contentSection = columnProperties.collapsible('Content');
  const header = columnSection.input({ label: 'Header' });
  const value = contentSection.input({ label: 'Value' });

  await header.expectValue('header');
  await value.expectValue('');
  await header.fill('new header');
  await value.fill('title');

  const table = editor.canvas.blockByNth(0, { datatable: true });

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await editor.inscription.expectHeader('DataTable');
  const properties = editor.inscription.section('Properties');

  const columnsSection = properties.collapsible('Columns');
  const columnHeader = columnsSection.listItem({ label: 'new header' });

  await columnHeader.pressButton(1);
  await editor.inscription.expectHeader('DataTableColumn');
  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await editor.inscription.expectHeader('DataTable');

  await columnsSection.expectListItems(1);
  await columnHeader.pressButton(0);
  await columnsSection.expectListItems(0);
});

test('columns from attribute', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const table = editor.canvas.blockByNth(0, { datatable: true });

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await editor.inscription.expectHeader('DataTable');

  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const listOfObjects = section.input({ label: 'List of Objects' });

  const columnsSection = properties.collapsible('Columns');
  await columnsSection.expectListItems(3);
  await listOfObjects.expectValue('data.persons');

  const columnBirthdayNew = columnsSection.listItem({ label: 'birthday' });
  const columnAgeNew = columnsSection.listItem({ label: 'age' });
  const columnFirstNameNew = columnsSection.listItem({ label: 'first name' });

  await columnBirthdayNew.expectBound(true);
  await columnAgeNew.expectBound(false);
  await columnFirstNameNew.expectBound(true);

  await columnsSection.toggleControl();
  await columnsSection.expectListItems(5);

  await listOfObjects.fill('#{data.data.strings}');
  await columnsSection.expectListItems(5);
  const columnString = columnsSection.listItem({ label: 'strings' });
  const columnAdressNew = columnsSection.listItem({ label: 'address' });
  const columnSurnameNew = columnsSection.listItem({ label: 'surname' });
  await columnString.expectBound(false);
  await columnAdressNew.expectBound(false);
  await columnBirthdayNew.expectBound(false);
  await columnSurnameNew.expectBound(false);
  await columnFirstNameNew.expectBound(false);
  await columnAgeNew.expectBound(false);
});

test('dataTableAction', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Action Column');
  await editor.canvas.blockByNth(1).inscribe();
  await editor.inscription.expectHeader('DataTableColumn');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const header = section.input({ label: 'Header' });
  await header.expectValue('Action');
  const asActionColumn = section.checkbox({ label: 'Action Column' });
  await asActionColumn.expectValue(true);

  const contentSection = properties.collapsible('Content');
  await contentSection.expectListItems(0);
  await contentSection.toggleControl();
  await contentSection.expectListItems(1);

  await editor.canvas.blockByNth(2).inscribe();
  await editor.inscription.expectHeader('Button');

  const buttonProperties = editor.inscription.section('Properties');
  const buttonSection = buttonProperties.collapsible('General');
  const name = buttonSection.input({ label: 'Name' });
  await name.expectValue('Action');
  await name.fill('Delete');

  await editor.canvas.blockByNth(1).block.dblclick({ position: { x: 10, y: 10 } });

  const deletButton = contentSection.listItem({ label: 'Delete' });
  await deletButton.expectLabel('Delete');

  await contentSection.toggleControl();
  await contentSection.expectListItems(2);

  const buttonAction = contentSection.listItem({ label: 'Action' });
  await buttonAction.expectLabel('Action');
});
