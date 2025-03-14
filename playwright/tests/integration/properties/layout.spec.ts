import { expect, test, type Page } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const { editor, type, columns, justify, align, behaviour } = await layout(page);
  await type.expectValue('Grid');
  await columns.expectValue('2 Columns');
  await align.expectSelected('Top');
  await expect(justify.locator).toBeHidden();
  await type.choose('Flex');
  await expect(columns.locator).toBeHidden();
  await expect(justify.locator).toBeVisible();
  await justify.choose('Right');
  await behaviour.fillVisible();

  await reload(editor);
  await type.expectValue('Flex');
  await expect(columns.locator).toBeHidden();
  await justify.expectSelected('Right');
  await type.choose('Grid');
  await columns.choose('Free');
  await align.choose('Center');

  await reload(editor);
  await type.expectValue('Grid');
  await columns.expectValue('Free');
  await align.expectSelected('Center');
  await expect(justify.locator).toBeHidden();
  await behaviour.expectVisible();
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
  await expect(layoutAccordion.item).toBeHidden();
});

test('1 col grid', async ({ page }) => {
  const { type, columns, align } = await layout(page);
  await type.expectValue('Grid');
  await columns.expectValue('2 Columns');
  await expect(align.locator).toBeVisible();
  await align.expectSelected('Top');
  await columns.choose('1 Column');
  await expect(align.locator).toBeHidden();
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
  const justify = section.toggleGroup({ label: 'Horizontal Alignment' });
  const align = section.toggleGroup({ label: 'Vertical Alignment' });
  const behaviour = properties.behaviour();
  return { editor, layoutBlock, properties, type, columns, justify, align, behaviour };
};

const reload = async (editor: FormEditor) => {
  await editor.page.reload();
  await editor.canvas.blockByNth(0, { layout: true }).inscribe();
};
