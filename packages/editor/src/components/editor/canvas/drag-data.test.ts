import type { FormData } from '@axonivy/form-editor-protocol';
import { dragData, isDropZoneDisabled, type DragData } from './drag-data';
import type { DeepPartial } from '../../../test-utils/type-utils';
import type { Active } from '@dnd-kit/core';

describe('dragData', () => {
  test('normal', () => {
    const data = filledData();
    expectDragData(dragData(data.components[0]), []);
  });

  test('layout', () => {
    const data = filledData();
    expectDragData(dragData(data.components[2]), ['31', '32', '33']);
  });
});

describe('isDragZoneDisabled', () => {
  test('false', () => {
    const active: Partial<Active> = { id: '1', data: { current: undefined } };
    expect(isDropZoneDisabled('', active as Active)).to.be.false;
    expect(isDropZoneDisabled('2', active as Active)).to.be.false;
  });

  test('true', () => {
    const active: Partial<Active> = { id: '1', data: { current: undefined } };
    expect(isDropZoneDisabled('1', active as Active)).to.be.true;
    expect(isDropZoneDisabled('2', active as Active, '1')).to.be.true;
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
      }
    ]
  };
  return prefilledData as FormData;
};
