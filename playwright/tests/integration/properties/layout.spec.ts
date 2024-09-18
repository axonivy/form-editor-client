import { expect, test, type Page } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const { editor, type, columns, justify } = await layout(page);
  await type.expectValue('Grid');
  await columns.expectValue('2 Columns');
  await expect(justify.locator).toBeHidden();
  await type.choose('Flex');
  await expect(columns.locator).toBeHidden();
  await expect(justify.locator).toBeVisible();
  await justify.choose('End');

  await reload(editor);
  await type.expectValue('Flex');
  await expect(columns.locator).toBeHidden();
  await justify.expectValue('End');
  await type.choose('Grid');
  await columns.choose('Free');

  await reload(editor);
  await type.expectValue('Grid');
  await columns.expectValue('Free');
  await expect(justify.locator).toBeHidden();
});

test('children in free layout', async ({ page }) => {
  const { editor, layoutBlock, properties, columns } = await layout(page);
  await editor.createBlock('Input', layoutBlock.block);
  const inputBlock = editor.canvas.blockByNth(0);
  const layoutAccordion = editor.inscription.section('Layout');
  const largeSpan = layoutAccordion.collapsible('General').select({ label: 'Large Span' });
  const mediumSpan = layoutAccordion.collapsible('General').select({ label: 'Medium Span' });

  await inputBlock.select();
  await expect(layoutAccordion.item).toBeHidden();

  await layoutBlock.select();
  await columns.choose('Free');
  await inputBlock.select();
  await expect(layoutAccordion.item).toBeVisible();
  await layoutAccordion.toggle();
  await largeSpan.expectValue('3');
  await mediumSpan.expectValue('6');
  await largeSpan.choose('1');
  await mediumSpan.choose('2');

  await reload(editor);
  await inputBlock.select();
  await layoutAccordion.toggle();
  await largeSpan.expectValue('1');
  await mediumSpan.expectValue('2');

  await layoutBlock.select();
  await properties.toggle();
  await columns.choose('4 Columns');
  await inputBlock.select();
  expect(layoutAccordion.item).toBeHidden();
});

const layout = async (page: Page) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Layout' });
  const layoutBlock = editor.canvas.blockByNth(0, { layout: true });
  await layoutBlock.inscribe();
  await editor.inscription.expectHeader('Layout');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const type = section.select({ label: 'Type' });
  const columns = section.select({ label: 'Columns' });
  const justify = section.select({ label: 'Justify content' });
  return { editor, layoutBlock, properties, type, columns, justify };
};

const reload = async (editor: FormEditor) => {
  await editor.page.reload();
  await editor.canvas.blockByNth(0, { layout: true }).inscribe();
};
