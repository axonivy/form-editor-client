import { EMPTY_FORM, type ComponentData, type FormData, isLayout, type LayoutConfig } from '@axonivy/form-editor-protocol';
import { createInitForm, findComponentElement, modifyData } from './data';
import type { DeepPartial } from '../test-utils/type-utils';

describe('findComponentElement', () => {
  test('find', () => {
    const data = filledData();
    expect(findComponentElement(data, '3')).to.deep.equals({ element: data.components[2], parent: undefined });
    expect(findComponentElement(data, '5')).to.deep.equals(undefined);
  });

  test('find deep', () => {
    const data = filledData();
    expect(findComponentElement(data, '31')).to.deep.equals({
      // @ts-ignore
      element: data.components[2].config.components[0],
      parent: data.components[2]
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
      expect(data.components[0].id).to.match(/^Input-/);
      expect(data.components[0].type).to.equals('Input');
      expect(data.components[0].config).to.not.undefined;
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
      data = modifyData(data, { type: 'dnd', data: { activeId: 'Button', targetId: `layout-${data.components[0].id}` } }).newData;
      data = modifyData(data, { type: 'dnd', data: { activeId: 'Text', targetId: `layout-${data.components[0].id}` } }).newData;
      expect(data).to.not.deep.equals(emptyData());
      expect(data.components).to.have.length(1);
      const layoutData = data.components[0].config.components as ComponentData[];
      expect(layoutData).to.have.length(2);
      expect(layoutData[0].type).to.equals('Button');
      expect(layoutData[1].type).to.equals('Text');
    });

    test('move down', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '2' } }).newData, ['1', '2', '3']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '3' } }).newData, ['2', '1', '3']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '4' } }).newData, ['2', '3', '1']);
    });

    test('move down deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '31', targetId: '33' } }).newData;
      expectOrder(data, ['1', '2', '3']);
      expectOrderDeep(data, '3', ['32', '31', '33']);
    });

    test('move up', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '3' } }).newData, ['1', '2', '3']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '2' } }).newData, ['1', '3', '2']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '1' } }).newData, ['3', '1', '2']);
    });

    test('move up deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '33', targetId: '32' } }).newData;
      expectOrder(data, ['1', '2', '3']);
      expectOrderDeep(data, '3', ['31', '33', '32']);
    });

    test('move down to deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '1', targetId: '32' } }).newData;
      expectOrder(data, ['2', '3']);
      expectOrderDeep(data, '3', ['31', '1', '32', '33']);
    });

    test('move up from deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '32', targetId: '2' } }).newData;
      expectOrder(data, ['1', '32', '2', '3']);
      expectOrderDeep(data, '3', ['31', '33']);
    });
  });

  describe('remove', () => {
    test('remove', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'remove', data: { id: '1' } }).newData, ['2', '3']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '2' } }).newData, ['1', '3']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '3' } }).newData, ['1', '2']);
    });

    test('remove deep', () => {
      const removeDeep = modifyData(filledData(), { type: 'remove', data: { id: '32' } }).newData;
      expectOrder(removeDeep, ['1', '2', '3']);
      expectOrderDeep(removeDeep, '3', ['31', '33']);
    });
  });

  test('add', () => {
    const data = modifyData(emptyData(), { type: 'add', data: { create: { componentName: 'Input', label: 'Age', value: 'age' } } }).newData;
    expect(data).not.toEqual(emptyData());
    expect(data.components).toHaveLength(1);
    expect(data.components[0].type).to.equals('Input');
  });

  describe('move', () => {
    test('down', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveDown', data: { id: '2' } }).newData, ['1', '3', '2']);
    });

    test('down deep', () => {
      const data = filledData();
      expectOrderDeep(modifyData(data, { type: 'moveDown', data: { id: '31' } }).newData, '3', ['32', '31', '33']);
    });

    test('up', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveUp', data: { id: '2' } }).newData, ['2', '1', '3']);
    });

    test('up deep', () => {
      const data = filledData();
      expectOrderDeep(modifyData(data, { type: 'moveUp', data: { id: '33' } }).newData, '3', ['31', '33', '32']);
    });

    test('first and last', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveUp', data: { id: '1' } }).newData, ['1', '2', '3']);
      expectOrder(modifyData(data, { type: 'moveDown', data: { id: '3' } }).newData, ['1', '2', '3']);
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
    expect(layout.config.components[0].config.action).toEqual('#{ivyWorkflowView.cancel()}');
    expect(layout.config.components[1].config.action).toEqual('#{logic.close}');
  });
});

const emptyData = () => {
  return structuredClone(EMPTY_FORM);
};

const filledData = () => {
  const prefilledData: DeepPartial<FormData> = {
    components: [
      { id: '1', type: 'Input', config: {} },
      { id: '2', type: 'Button', config: {} },
      {
        id: '3',
        type: 'Layout',
        config: {
          components: [
            { id: '31', type: 'Text', config: {} },
            { id: '32', type: 'Button', config: {} },
            { id: '33', type: 'Input', config: {} }
          ]
        }
      }
    ]
  };
  const filledData = prefilledData as FormData;
  expectOrder(filledData, ['1', '2', '3']);
  expectOrderDeep(filledData, '3', ['31', '32', '33']);
  return filledData;
};

const expectOrder = (data: FormData, order: string[]) => {
  expect(data.components.map(c => c.id)).to.eql(order);
};

const expectOrderDeep = (data: FormData, deepId: string, order: string[]) => {
  const component = data.components.find(c => c.id === deepId);
  if (component && isLayout(component)) {
    expect(component.config.components.map(c => c.id)).to.eql(order);
  }
};
