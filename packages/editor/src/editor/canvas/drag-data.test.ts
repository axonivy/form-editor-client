import type { FormData } from '@axonivy/form-editor-protocol';
import { dragData, isDropZoneDisabled, type DragData } from './drag-data';
import type { Active } from '@dnd-kit/core';
import type { DeepPartial } from '../../types/types';

describe('dragData', () => {
  test('normal', () => {
    const data = filledData();
    expectDragData(dragData(data.components[0]), []);
  });

  test('layout', () => {
    const data = filledData();
    expectDragData(dragData(data.components[2]), ['31', '32', '33']);
  });

  test('fieldset', () => {
    const data = filledData();
    expectDragData(dragData(data.components[3]), ['41', '42', '43']);
  });

  test('panel', () => {
    const data = filledData();
    expectDragData(dragData(data.components[4]), ['51', '52', '53']);
  });
});

describe('isDragZoneDisabled', () => {
  test('false', () => {
    const active: Partial<Active> = { id: '1', data: { current: undefined } };
    expect(isDropZoneDisabled('', active as Active)).toBeFalsy();
    expect(isDropZoneDisabled('2', active as Active)).toBeFalsy();
  });

  test('true', () => {
    const active: Partial<Active> = { id: '1', data: { current: undefined } };
    expect(isDropZoneDisabled('1', active as Active)).toBeTruthy();
    expect(isDropZoneDisabled('2', active as Active, '1')).toBeTruthy();
  });
});

const expectDragData = (data: DragData, ids: Array<string>) => {
  expect(data).to.deep.equals({ disabledIds: ids });
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
      },
      {
        id: '4',
        type: 'Fieldset',
        config: {
          legend: 'Legend',
          collapsible: true,
          disabled: false,
          collapsed: false,
          components: [
            { id: '41', type: 'Text', config: { content: 'Hello' } },
            { id: '42', type: 'Button', config: {} },
            { id: '43', type: 'Input', config: {} }
          ]
        }
      },
      {
        id: '5',
        type: 'Panel',
        config: {
          title: 'Title',
          collapsible: true,
          collapsed: false,
          components: [
            { id: '51', type: 'Text', config: { content: 'Hello' } },
            { id: '52', type: 'Button', config: {} },
            { id: '53', type: 'Input', config: {} }
          ]
        }
      }
    ]
  };
  return prefilledData as FormData;
};
