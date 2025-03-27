import {
  EMPTY_FORM,
  type FormData,
  type LayoutConfig,
  type ConfigData,
  type TableConfig,
  type ComponentData,
  type TableComponent,
  type ActionColumnComponent,
  isTable,
  isColumn
} from '@axonivy/form-editor-protocol';
import {
  createInitForm,
  creationTargetId,
  DELETE_DROPZONE_ID,
  findComponentElement,
  getParentComponent,
  isEditableTable,
  modifyData
} from './data';
import type { DeepPartial } from '../types/types';
import { renderHook } from '@testing-library/react';
import { useComponents } from '../components/components';

describe('findComponentElement', () => {
  test('find', () => {
    const data = filledData();
    expect(findComponentElement(data, '3')).to.deep.equals({ element: data.components[2], parent: undefined });
    expect(findComponentElement(data, '4')).to.deep.equals({ element: data.components[3], parent: undefined });
    expect(findComponentElement(data, '6')).to.deep.equals(undefined);
  });

  test('find deep', () => {
    const data = filledData();
    expect(findComponentElement(data, '31')).to.deep.equals({
      element: (data.components[2] as LayoutConfig).config.components[0],
      parent: data.components[2]
    });

    expect(findComponentElement(data, '41')).to.deep.equals({
      element: (data.components[3] as LayoutConfig).config.components[0],
      parent: data.components[3]
    });
    expect(findComponentElement(data, '35')).to.deep.equals(undefined);
  });
});

describe('modifyData', () => {
  const { result: componentsResult } = renderHook(() => useComponents());
  const { componentByName } = componentsResult.current;

  describe('drag and drop', () => {
    test('add unknown', () => {
      expect(modifyData(emptyData(), { type: 'dnd', data: { activeId: 'unknown', targetId: '' } }, componentByName).newData).to.deep.equals(
        emptyData()
      );
    });

    test('add one', () => {
      const data = modifyData(emptyData(), { type: 'dnd', data: { activeId: 'Input', targetId: '' } }, componentByName).newData;
      expect(data).to.not.deep.equals(emptyData);
      expect(data.components).to.have.length(1);
      expect(data.components[0].cid).toEqual('input1');
      expect(data.components[0].type).toEqual('Input');
      expect(data.components[0].config).not.toBeUndefined();
    });

    test('add two', () => {
      let data = modifyData(emptyData(), { type: 'dnd', data: { activeId: 'Input', targetId: '' } }, componentByName).newData;
      data = modifyData(data, { type: 'dnd', data: { activeId: 'Button', targetId: '' } }, componentByName).newData;
      expect(data).to.not.deep.equals(emptyData());
      expect(data.components).to.have.length(2);
      expect(data.components[1].type).to.equals('Button');
    });

    test('add deep', () => {
      let data = modifyData(emptyData(), { type: 'dnd', data: { activeId: 'Layout', targetId: '' } }, componentByName).newData;
      data = modifyData(
        data,
        { type: 'dnd', data: { activeId: 'Button', targetId: `layout-${data.components[0].cid}` } },
        componentByName
      ).newData;
      data = modifyData(
        data,
        { type: 'dnd', data: { activeId: 'Text', targetId: `layout-${data.components[0].cid}` } },
        componentByName
      ).newData;
      expect(data).to.not.deep.equals(emptyData());
      expect(data.components).to.have.length(1);
      const layoutData = (data.components[0] as LayoutConfig).config.components;
      expect(layoutData).to.have.length(2);
      expect(layoutData[0].type).to.equals('Button');
      expect(layoutData[1].type).to.equals('Text');
    });

    test('move down', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '2' } }, componentByName).newData, [
        '1',
        '2',
        '3',
        '4',
        '5'
      ]);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '3' } }, componentByName).newData, [
        '2',
        '1',
        '3',
        '4',
        '5'
      ]);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '4' } }, componentByName).newData, [
        '2',
        '3',
        '1',
        '4',
        '5'
      ]);
    });

    test('move down deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '31', targetId: '33' } }, componentByName).newData;
      expectOrder(data, ['1', '2', '3', '4', '5']);
      expectOrderDeep(data, '3', ['32', '31', '33']);
    });

    test('move up', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '3' } }, componentByName).newData, [
        '1',
        '2',
        '4',
        '5',
        '3'
      ]);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '2' } }, componentByName).newData, [
        '1',
        '3',
        '2',
        '4',
        '5'
      ]);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '1' } }, componentByName).newData, [
        '3',
        '1',
        '2',
        '4',
        '5'
      ]);
    });

    test('move up deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '33', targetId: '32' } }, componentByName).newData;
      expectOrder(data, ['1', '2', '3', '4', '5']);
      expectOrderDeep(data, '3', ['31', '33', '32']);
    });

    test('move down to deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '1', targetId: '32' } }, componentByName).newData;
      expectOrder(data, ['2', '3', '4', '5']);
      expectOrderDeep(data, '3', ['31', '1', '32', '33']);
    });

    test('move up from deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '32', targetId: '2' } }, componentByName).newData;
      expectOrder(data, ['1', '32', '2', '3', '4', '5']);
      expectOrderDeep(data, '3', ['31', '33']);
    });

    test('move to delete', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: DELETE_DROPZONE_ID } }, componentByName).newData, [
        '2',
        '3',
        '4',
        '5'
      ]);
    });
  });

  describe('remove', () => {
    test('remove', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'remove', data: { id: '1' } }, componentByName).newData, ['2', '3', '4', '5']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '2' } }, componentByName).newData, ['1', '3', '4', '5']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '3' } }, componentByName).newData, ['1', '2', '4', '5']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '4' } }, componentByName).newData, ['1', '2', '3', '5']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '5' } }, componentByName).newData, ['1', '2', '3', '4']);
    });

    test('remove deep', () => {
      const removeDeep = modifyData(filledData(), { type: 'remove', data: { id: '32' } }, componentByName).newData;
      expectOrder(removeDeep, ['1', '2', '3', '4', '5']);
      expectOrderDeep(removeDeep, '3', ['31', '33']);
    });
  });

  describe('add', () => {
    test('normal', () => {
      const data = modifyData(
        emptyData(),
        {
          type: 'add',
          data: { componentName: 'Input', create: { label: 'Age', value: 'age' } }
        },
        componentByName
      ).newData;
      expect(data).not.toEqual(emptyData());
      expect(data.components).toHaveLength(1);
      expect(data.components[0].type).to.equals('Input');
    });

    test('add to structure', () => {
      const data = modifyData(
        filledData(),
        {
          type: 'add',
          data: { componentName: 'Input', create: { label: 'Age', value: 'age' }, targetId: '31' }
        },
        componentByName
      ).newData;
      expect(data).not.toEqual(filledData());
      expectOrder(data, ['1', '2', '3', '4', '5']);
      expectOrderDeep(data, '3', ['input54', '31', '32', '33']);
    });

    test('add to datatable is not possible', () => {
      const data = modifyData(
        tableData(),
        {
          type: 'add',
          data: { componentName: 'Input', create: { label: 'Age', value: 'age' }, targetId: '11' }
        },
        componentByName
      ).newData;
      expect(data).toEqual(tableData());
      expectOrder(data, ['1']);
      expectOrderDeep(data, '1', ['11', '12', '13']);
    });
  });

  describe('paste', () => {
    test('duplicate', () => {
      const data = modifyData(filledData(), { type: 'paste', data: { id: '1' } }, componentByName).newData;
      expect(data).not.toEqual(filledData());
      expect(data.components).toHaveLength(6);
      expectOrder(data, ['input54', '1', '2', '3', '4', '5']);
    });

    test('paste', () => {
      const data = modifyData(filledData(), { type: 'paste', data: { id: '1', targetId: '4' } }, componentByName).newData;
      expect(data).not.toEqual(filledData());
      expect(data.components).toHaveLength(6);
      expectOrder(data, ['1', '2', '3', 'input54', '4', '5']);
    });

    test('paste datatable column', () => {
      // paste a datatable column acts always as duplicate
      const data = modifyData(tableData(), { type: 'paste', data: { id: '11', targetId: '1' } }, componentByName).newData;
      expect(data).not.toEqual(tableData());
      expect(data.components).toHaveLength(1);
      const component = data.components.find(c => c.cid === '1') as TableConfig;
      expect(component.config.components).toHaveLength(4);
      expect(component.config.components[0].cid).toEqual('datatablecolumn15');
    });

    test('paste datatable action column', () => {
      // paste a datatable column acts always as duplicate
      const data = modifyData(tableData(), { type: 'paste', data: { id: '13', targetId: '1' } }, componentByName).newData;
      expect(data).not.toEqual(tableData());
      expect(data.components).toHaveLength(1);
      const component = data.components.find(c => c.cid === '1') as TableConfig;
      expect(component.config.components).toHaveLength(4);
      expect(component.config.components[2].config.components).toHaveLength(1);
      expect(component.config.components[2].config.components[0].cid).toEqual('button16');
    });

    test('paste other things into datatable', () => {
      // paste other things than columns into a datatable is not possible
      const originalData = tableData();
      originalData.components.push({ type: 'Button', cid: '2', config: {} });
      const data = modifyData(originalData, { type: 'paste', data: { id: '2', targetId: '11' } }, componentByName).newData;
      expect(data).toEqual(originalData);
      expectOrder(data, ['1', '2']);
      expectOrderDeep(data, '1', ['11', '12', '13']);
    });

    test('duplicate deep', () => {
      const data = modifyData(filledData(), { type: 'paste', data: { id: '31' } }, componentByName).newData;
      expect(data.components).toHaveLength(5);
      const component = data.components.find(c => c.cid === '3') as LayoutConfig;
      expect(component.config.components).toHaveLength(4);
      expect(component.config.components[0].cid).toEqual('text54');
      expect((component.config.components[0].config as ConfigData).content).toEqual('Hello');
    });

    test('duplicate layout', () => {
      const data = modifyData(filledData(), { type: 'paste', data: { id: '3' } }, componentByName).newData;
      expect(data.components).toHaveLength(6);
      const component = data.components.find(c => c.cid === 'layout54') as LayoutConfig;
      expect(component.config.components).toHaveLength(3);
      expect(component.config.components[0].cid).toEqual('text55');
      expect((component.config.components[0].config as ConfigData).content).toEqual('Hello');
      expect(component.config.components[1].cid).toEqual('button56');
      expect(component.config.components[2].cid).toEqual('input57');
    });

    test('duplicate table', () => {
      const data = modifyData(tableData(), { type: 'paste', data: { id: '1' } }, componentByName).newData;
      expect(data.components).toHaveLength(2);
      const component = data.components.find(c => c.cid === 'datatable15') as TableConfig;
      expect(component.config.components).toHaveLength(3);
      expect(component.config.components[0].cid).toEqual('datatablecolumn16');
      expect(component.config.components[0].config.value).toEqual('Hello');
      expect(component.config.components[1].cid).toEqual('datatablecolumn17');
      expect(component.config.components[2].cid).toEqual('datatablecolumn18');
    });

    test('duplicate table column', () => {
      const data = modifyData(tableData(), { type: 'paste', data: { id: '11' } }, componentByName).newData;
      expectOrder(data, ['1']);
      expectOrderDeep(data, '1', ['datatablecolumn15', '11', '12', '13']);
    });
  });

  describe('move', () => {
    test('down', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveDown', data: { id: '2' } }, componentByName).newData, ['1', '3', '2', '4', '5']);
    });

    test('down deep', () => {
      const data = filledData();
      expectOrderDeep(modifyData(data, { type: 'moveDown', data: { id: '31' } }, componentByName).newData, '3', ['32', '31', '33']);
    });

    test('up', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveUp', data: { id: '2' } }, componentByName).newData, ['2', '1', '3', '4', '5']);
    });

    test('up deep', () => {
      const data = filledData();
      expectOrderDeep(modifyData(data, { type: 'moveUp', data: { id: '33' } }, componentByName).newData, '3', ['31', '33', '32']);
    });

    test('first and last', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveUp', data: { id: '1' } }, componentByName).newData, ['1', '2', '3', '4', '5']);
      expectOrder(modifyData(data, { type: 'moveDown', data: { id: '3' } }, componentByName).newData, ['1', '2', '4', '3', '5']);
    });
  });
});
describe('findParentTableComponent', () => {
  const but1: DeepPartial<ActionColumnComponent> = {
    cid: 'but1',
    config: {},
    type: 'Button'
  };
  const col1: DeepPartial<TableComponent> = {
    cid: 'col1',
    config: {
      components: [but1]
    },
    type: 'DataTableColumn'
  };
  const col2: DeepPartial<TableComponent> = {
    cid: 'col2',
    config: {},
    type: 'DataTableColumn'
  };

  const data: ComponentData[] = [
    {
      cid: '3',
      type: 'DataTable',
      config: { components: [col1, col2] }
    },
    {
      cid: '4',
      type: 'Layout',
      config: {
        components: [{ cid: 'input1', type: 'Input', config: {} }]
      }
    }
  ];

  test('return DataTable containing the element', () => {
    const parent = getParentComponent(data, 'col1');
    expect(parent?.cid).toEqual('3');
    expect(isTable(parent) && parent.config.components[0].cid).toEqual('col1');
    expect(isColumn(parent)).toEqual(false);
  });

  test('return Column containing the element', () => {
    const parent = getParentComponent(data, 'but1');
    expect(parent?.cid).toEqual('col1');
    expect(isTable(parent)).toEqual(false);
    expect(isColumn(parent)).toEqual(true);
  });

  test('return undefined if is no parent', () => {
    const parent = getParentComponent(data, '3');
    expect(parent).toEqual(undefined);
  });

  test('return undefined if is no component', () => {
    const parent = getParentComponent(data, 'notexistent');
    expect(parent).toEqual(undefined);
  });
});

describe('createInitForm', () => {
  const { result: componentsResult } = renderHook(() => useComponents());
  const { componentByName } = componentsResult.current;
  test('create', () => {
    const data = createInitForm(emptyData(), [{ componentName: 'Input', label: 'Age', value: 'age' }], false, componentByName);
    expect(data).not.toEqual(emptyData());
    expect(data.components).toHaveLength(1);
    expect(data.components[0].type).toEqual('Input');
  });

  test('create with workflow buttons', () => {
    const data = createInitForm(emptyData(), [{ componentName: 'Input', label: 'Age', value: 'age' }], true, componentByName);
    expect(data).not.toEqual(emptyData());
    expect(data.components).toHaveLength(2);
    expect(data.components[0].type).toEqual('Input');
    const layout = data.components[1] as LayoutConfig;
    expect(layout.type).toEqual('Layout');
    expect(layout.config.components).toHaveLength(2);
    expect((layout.config.components[0].config as ConfigData).action).toEqual('#{ivyWorkflowView.cancel()}');
    expect((layout.config.components[0].config as ConfigData).type).toEqual('BUTTON');
    expect((layout.config.components[1].config as ConfigData).action).toEqual('#{logic.close}');
    expect((layout.config.components[1].config as ConfigData).type).toEqual('SUBMIT');
  });
});

test('creationTargetId', () => {
  const components = filledData().components;
  expect(creationTargetId(components)).toEqual(undefined);
  expect(creationTargetId(components, 'abc')).toEqual('abc');
  expect(creationTargetId(components, '1')).toEqual('1');
  expect(creationTargetId(components, '3')).toEqual('layout-3');
  expect(creationTargetId(components, '31')).toEqual('31');
  expect(creationTargetId(components, '4')).toEqual('layout-4');
  expect(creationTargetId(components, '5')).toEqual('layout-5');
});

const emptyData = () => {
  return structuredClone(EMPTY_FORM);
};

const filledData = () => {
  const prefilledData: DeepPartial<FormData> = {
    components: [
      { cid: '1', type: 'Input', config: {} },
      { cid: '2', type: 'Button', config: {} },
      {
        cid: '3',
        type: 'Layout',
        config: {
          components: [
            { cid: '31', type: 'Text', config: { content: 'Hello' } },
            { cid: '32', type: 'Button', config: {} },
            { cid: '33', type: 'Input', config: {} }
          ]
        }
      },
      {
        cid: '4',
        type: 'Fieldset',
        config: {
          legend: 'Legend',
          collapsible: true,
          disabled: false,
          collapsed: false,
          components: [
            { cid: '41', type: 'Text', config: { content: 'Hello' } },
            { cid: '42', type: 'Button', config: {} },
            { cid: '43', type: 'Input', config: {} }
          ]
        }
      },
      {
        cid: '5',
        type: 'Panel',
        config: {
          title: 'Title',
          collapsible: true,
          collapsed: false,
          components: [
            { cid: '51', type: 'Text', config: { content: 'Hello' } },
            { cid: '52', type: 'Button', config: {} },
            { cid: '53', type: 'Input', config: {} }
          ]
        }
      }
    ]
  };
  const filledData = prefilledData as FormData;
  expectOrder(filledData, ['1', '2', '3', '4', '5']);
  expectOrderDeep(filledData, '3', ['31', '32', '33']);
  expectOrderDeep(filledData, '4', ['41', '42', '43']);
  expectOrderDeep(filledData, '5', ['51', '52', '53']);
  return filledData;
};

const tableData = () => {
  const prefilledData: DeepPartial<FormData> = {
    components: [
      {
        cid: '1',
        type: 'DataTable',
        config: {
          components: [
            { cid: '11', type: 'DataTableColumn', config: { value: 'Hello' } },
            { cid: '12', type: 'DataTableColumn', config: {} },
            { cid: '13', type: 'DataTableColumn', config: { components: [{ cid: '14', type: 'Button', config: {} }] } }
          ]
        }
      }
    ]
  };
  return prefilledData as FormData;
};

const expectOrder = (data: FormData, order: string[]) => {
  expect(data.components.map(c => c.cid)).to.eql(order);
};

const expectOrderDeep = (data: FormData, deepId: string, order: string[]) => {
  const component = data.components.find(c => c.cid === deepId) as LayoutConfig;
  expect(component.config.components.map(c => c.cid)).to.eql(order);
};

describe('isEditableTable', () => {
  test('returns true for editable table', () => {
    const table: ComponentData = {
      cid: 'table1',
      type: 'DataTable',
      config: { isEditable: true, components: [] }
    };
    expect(isEditableTable([table], table)).toBe(true);
  });

  test('returns false for non-editable table', () => {
    const table: ComponentData = {
      cid: 'table2',
      type: 'DataTable',
      config: { isEditable: false, components: [] }
    };
    expect(isEditableTable([table], table)).toBe(false);
  });

  test('returns false if element is undefined', () => {
    expect(isEditableTable([], undefined)).toBe(false);
  });
});
