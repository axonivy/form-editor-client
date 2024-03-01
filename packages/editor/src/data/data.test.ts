import { EMPTY_FORM, type ComponentData, type FormData, isLayout } from '@axonivy/form-editor-protocol';
import { findComponent, modifyData } from './data';
import type { DeepPartial } from '../test-utils/type-utils';

describe('findComponent', () => {
  test('find', () => {
    const data = filledData();
    expect(findComponent(data.components, '3')).to.deep.equals({ data: data.components, index: 2 });
    expect(findComponent(data.components, '5')).to.deep.equals(undefined);
  });

  test('find deep', () => {
    const data = filledData();
    expect(findComponent(data.components, '31')).to.deep.equals({ data: data.components[2].config.components, index: 0 });
    expect(findComponent(data.components, '35')).to.deep.equals(undefined);
  });
});

describe('modifyData', () => {
  describe('drag and drop', () => {
    test('add unknown', () => {
      expect(modifyData(emptyData(), { type: 'dnd', data: { activeId: 'unknown', targetId: '' } })).to.deep.equals(emptyData());
    });

    test('add one', () => {
      const data = modifyData(emptyData(), { type: 'dnd', data: { activeId: 'Input', targetId: '' } });
      expect(data).to.not.deep.equals(emptyData);
      expect(data.components).to.have.length(1);
      expect(data.components[0].id).to.match(/^Input-/);
      expect(data.components[0].type).to.equals('Input');
      expect(data.components[0].config).to.not.undefined;
    });

    test('add two', () => {
      let data = modifyData(emptyData(), { type: 'dnd', data: { activeId: 'Input', targetId: '' } });
      data = modifyData(data, { type: 'dnd', data: { activeId: 'Button', targetId: '' } });
      expect(data).to.not.deep.equals(emptyData());
      expect(data.components).to.have.length(2);
      expect(data.components[1].type).to.equals('Button');
    });

    test('add deep', () => {
      let data = modifyData(emptyData(), { type: 'dnd', data: { activeId: 'Layout', targetId: '' } });
      data = modifyData(data, { type: 'dnd', data: { activeId: 'Button', targetId: `layout-${data.components[0].id}` } });
      data = modifyData(data, { type: 'dnd', data: { activeId: 'Text', targetId: `layout-${data.components[0].id}` } });
      expect(data).to.not.deep.equals(emptyData());
      expect(data.components).to.have.length(1);
      const layoutData = data.components[0].config.components as ComponentData[];
      expect(layoutData).to.have.length(2);
      expect(layoutData[0].type).to.equals('Button');
      expect(layoutData[1].type).to.equals('Text');
    });

    test('move down', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '2' } }), ['1', '2', '3']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '3' } }), ['2', '1', '3']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '1', targetId: '4' } }), ['2', '3', '1']);
    });

    test('move down deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '31', targetId: '33' } });
      expectOrder(data, ['1', '2', '3']);
      expectOrderDeep(data, '3', ['32', '31', '33']);
    });

    test('move up', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '3' } }), ['1', '2', '3']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '2' } }), ['1', '3', '2']);
      expectOrder(modifyData(data, { type: 'dnd', data: { activeId: '3', targetId: '1' } }), ['3', '1', '2']);
    });

    test('move up deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '33', targetId: '32' } });
      expectOrder(data, ['1', '2', '3']);
      expectOrderDeep(data, '3', ['31', '33', '32']);
    });

    test('move down to deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '1', targetId: '32' } });
      expectOrder(data, ['2', '3']);
      expectOrderDeep(data, '3', ['31', '1', '32', '33']);
    });

    test('move up from deep', () => {
      const data = modifyData(filledData(), { type: 'dnd', data: { activeId: '32', targetId: '2' } });
      expectOrder(data, ['1', '32', '2', '3']);
      expectOrderDeep(data, '3', ['31', '33']);
    });
  });

  describe('remove', () => {
    test('remove', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'remove', data: { id: '1' } }), ['2', '3']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '2' } }), ['1', '3']);
      expectOrder(modifyData(data, { type: 'remove', data: { id: '3' } }), ['1', '2']);
    });

    test('remove deep', () => {
      const removeDeep = modifyData(filledData(), { type: 'remove', data: { id: '32' } });
      expectOrder(removeDeep, ['1', '2', '3']);
      expectOrderDeep(removeDeep, '3', ['31', '33']);
    });
  });

  describe('move', () => {
    test('down', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveDown', data: { id: '2' } }), ['1', '3', '2']);
    });

    test('down deep', () => {
      const data = filledData();
      expectOrderDeep(modifyData(data, { type: 'moveDown', data: { id: '31' } }), '3', ['32', '31', '33']);
    });

    test('up', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveUp', data: { id: '2' } }), ['2', '1', '3']);
    });

    test('up deep', () => {
      const data = filledData();
      expectOrderDeep(modifyData(data, { type: 'moveUp', data: { id: '33' } }), '3', ['31', '33', '32']);
    });

    test('first and last', () => {
      const data = filledData();
      expectOrder(modifyData(data, { type: 'moveUp', data: { id: '1' } }), ['1', '2', '3']);
      expectOrder(modifyData(data, { type: 'moveDown', data: { id: '3' } }), ['1', '2', '3']);
    });
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
