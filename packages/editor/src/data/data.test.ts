import {
  EMPTY_FORM,
  type ComponentData,
  type FormData,
  type LayoutConfig,
  type DataTable,
  type ConfigData,
  type DataTableColumnComponent
} from '@axonivy/form-editor-protocol';
import { createInitForm, creationTargetId, DELETE_DROPZONE_ID, findComponentElement, findParentTableComponent, modifyData } from './data';
import type { DeepPartial } from '../types/types';

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
      // @ts-ignore
      element: data.components[2].config.components[0],
      parent: data.components[2]
    });

    expect(findComponentElement(data, '41')).to.deep.equals({
      // @ts-ignore
      element: data.components[3].config.components[0],
      parent: data.components[3]
    });
    expect(findComponentElement(data, '35')).to.deep.equals(undefined);
  });
});

describe('modifyData', () => {
  describe('drag and drop', () => {
    test('add unknown', () => {
      expect(modifyData(emptyData(), { type: 'dnd', data: { activeId: 'unknown', targetId: '' } }).newData).to.deep.equals(emptyData());
    });

    test('add one', () => {
      const data = modifyData(emptyData(), { type: 'dnd', data: { activeId: 'Input', targetId: '' } }).newData;
      expect(data).to.not.deep.equals(emptyData);
      expect(data.components).to.have.length(1);
      expect(data.components[0].cid).toEqual('Input1');
      expect(data.components[0].type).toEqual('Input');
      expect(data.components[0].config).not.toBeUndefined();
    });

    test('add two', () => {
      let data = modifyData(emptyData(), { type: 'dnd', data: { activeId: 'Input', targetId: '' } }).newData;
      data = modifyData(data, { type: 'dnd', data: { activeId: 'Button', targetId: '' } }).newData;
      expect(data).to.not.deep.equals(emptyData());
      expect(data.components).to.have.length(2);
      expect(data.components[1].type).to.equals('Button');
    });

    test('add deep', () => {
      let data = modifyData(emptyData(), { type: 'dnd', data: { activeId: 'Layout', targetId: '' } }).newData;
      data = modifyData(data, { type: 'dnd', data: { activeId: 'Button', targetId: `layout-${data.components[0].cid}` } }).newData;
      data = modifyData(data, { type: 'dnd', data: { activeId: 'Text', targetId: `layout-${data.components[0].cid}` } }).newData;
      expect(data).to.not.deep.equals(emptyData());
      expect(data.components).to.have.length(1);
      const layoutData = (data.components[0] as LayoutConfig).config.components;
      expect(layoutData).to.have.length(2);
      expect(layoutData[0].type).to.equals('Button');
      expect(layoutData[1].type).to.equals('Text');
    });

    test('move down', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '2' } }).newData, ['1', '2', '3', '4', '5']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '3' } }).newData, ['2', '1', '3', '4', '5']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '4' } }).newData, ['2', '3', '1', '4', '5']);
    });

    test('move down deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '31', targetId: '33' } }).newData;
      expectOrder(data, ['1', '2', '3', '4', '5']);
      expectOrderDeep(data, '3', ['32', '31', '33']);
    });

    test('move up', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '3' } }).newData, ['1', '2', '4', '5', '3']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '2' } }).newData, ['1', '3', '2', '4', '5']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '1' } }).newData, ['3', '1', '2', '4', '5']);
    });

    test('move up deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '33', targetId: '32' } }).newData;
      expectOrder(data, ['1', '2', '3', '4', '5']);
      expectOrderDeep(data, '3', ['31', '33', '32']);
    });

    test('move down to deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '1', targetId: '32' } }).newData;
      expectOrder(data, ['2', '3', '4', '5']);
      expectOrderDeep(data, '3', ['31', '1', '32', '33']);
    });

    test('move up from deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '32', targetId: '2' } }).newData;
      expectOrder(data, ['1', '32', '2', '3', '4', '5']);
      expectOrderDeep(data, '3', ['31', '33']);
    });

    test('move to delete', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: DELETE_DROPZONE_ID } }).newData, ['2', '3', '4', '5']);
    });
  });

  describe('remove', () => {
    test('remove', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'remove', data: { id: '1' } }).newData, ['2', '3', '4', '5']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '2' } }).newData, ['1', '3', '4', '5']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '3' } }).newData, ['1', '2', '4', '5']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '4' } }).newData, ['1', '2', '3', '5']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '5' } }).newData, ['1', '2', '3', '4']);
    });

    test('remove deep', () => {
      const removeDeep = modifyData(filledData(), { type: 'remove', data: { id: '32' } }).newData;
      expectOrder(removeDeep, ['1', '2', '3', '4', '5']);
      expectOrderDeep(removeDeep, '3', ['31', '33']);
    });
  });

  test('add', () => {
    const data = modifyData(emptyData(), {
      type: 'add',
      data: { componentName: 'Input', create: { label: 'Age', value: 'age' } }
    }).newData;
    expect(data).not.toEqual(emptyData());
    expect(data.components).toHaveLength(1);
    expect(data.components[0].type).to.equals('Input');
  });

  describe('duplicate', () => {
    test('duplicate', () => {
      const data = modifyData(filledData(), { type: 'duplicate', data: { id: '1' } }).newData;
      expect(data).not.toEqual(filledData());
      expect(data.components).toHaveLength(6);
      expect(data.components[0].cid).toEqual('Input54');
    });

    test('duplicate deep', () => {
      const data = modifyData(filledData(), { type: 'duplicate', data: { id: '31' } }).newData;
      expect(data.components).toHaveLength(5);
      const component = data.components.find(c => c.cid === '3') as LayoutConfig;
      expect(component.config.components).toHaveLength(4);
      expect(component.config.components[0].cid).toEqual('Text54');
      expect((component.config.components[0].config as ConfigData).content).toEqual('Hello');
    });
  });

  describe('move', () => {
    test('down', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveDown', data: { id: '2' } }).newData, ['1', '3', '2', '4', '5']);
    });

    test('down deep', () => {
      const data = filledData();
      expectOrderDeep(modifyData(data, { type: 'moveDown', data: { id: '31' } }).newData, '3', ['32', '31', '33']);
    });

    test('up', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveUp', data: { id: '2' } }).newData, ['2', '1', '3', '4', '5']);
    });

    test('up deep', () => {
      const data = filledData();
      expectOrderDeep(modifyData(data, { type: 'moveUp', data: { id: '33' } }).newData, '3', ['31', '33', '32']);
    });

    test('first and last', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveUp', data: { id: '1' } }).newData, ['1', '2', '3', '4', '5']);
      expectOrder(modifyData(data, { type: 'moveDown', data: { id: '3' } }).newData, ['1', '2', '4', '3', '5']);
    });
  });
});

describe('createInitForm', () => {
  test('create', () => {
    const data = createInitForm(emptyData(), [{ componentName: 'Input', label: 'Age', value: 'age' }], false);
    expect(data).not.toEqual(emptyData());
    expect(data.components).toHaveLength(1);
    expect(data.components[0].type).toEqual('Input');
  });

  test('create with workflow buttons', () => {
    const data = createInitForm(emptyData(), [{ componentName: 'Input', label: 'Age', value: 'age' }], true);
    expect(data).not.toEqual(emptyData());
    expect(data.components).toHaveLength(2);
    expect(data.components[0].type).toEqual('Input');
    const layout = data.components[1] as LayoutConfig;
    expect(layout.type).toEqual('Layout');
    expect(layout.config.components).toHaveLength(2);
    expect((layout.config.components[0].config as ConfigData).action).toEqual('#{ivyWorkflowView.cancel()}');
    expect((layout.config.components[1].config as ConfigData).action).toEqual('#{logic.close}');
  });
});

describe('findParentTableComponent', () => {
  const dataTable: DeepPartial<DataTable> = {
    components: [
      { cid: 'column-1', config: {} },
      { cid: 'column-2', config: {} }
    ]
  };

  const data: ComponentData[] = [
    {
      cid: '3',
      type: 'DataTable',
      config: { components: dataTable.components as ComponentData[] }
    }
  ];

  test('return DataTable containing the element', () => {
    const element: DataTableColumnComponent = {
      cid: 'column-1',
      type: 'DataTableColumn',
      config: { header: '', value: '', filterable: false, sortable: false, visible: 'true' }
    };
    expect(findParentTableComponent(data, element)).toEqual(dataTable);
  });

  test('return undefined if element is no Column', () => {
    const element: ComponentData = { cid: 'button', type: 'Button', config: {} };
    expect(findParentTableComponent(data, element)).toBeUndefined();
  });

  test('return undefined if the element is undefined', () => {
    expect(findParentTableComponent(data, undefined)).toBeUndefined();
  });

  test('return undefined if there are no DataTable components', () => {
    const noTableData: ComponentData[] = [
      { cid: '1', type: 'Input', config: {} },
      { cid: '2', type: 'Button', config: {} }
    ];
    const element: DataTableColumnComponent = {
      cid: 'column-1',
      type: 'DataTableColumn',
      config: { header: '', value: '', filterable: false, sortable: false, visible: 'true' }
    };
    expect(findParentTableComponent(noTableData, element)).toBeUndefined();
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

const expectOrder = (data: FormData, order: string[]) => {
  expect(data.components.map(c => c.cid)).to.eql(order);
};

const expectOrderDeep = (data: FormData, deepId: string, order: string[]) => {
  const component = data.components.find(c => c.cid === deepId) as LayoutConfig;
  expect(component.config.components.map(c => c.cid)).to.eql(order);
};
