import { EMPTY_FORM, type FormData } from '@axonivy/form-editor-protocol';
import { modifyData } from './data';
import type { DeepPartial } from '../test-utils/type-utils';

describe('data', () => {
  const emptyData: FormData = EMPTY_FORM;

  test('modifyData - add unknown', () => {
    expect(modifyData(emptyData, 'unknown', '')).to.deep.equals(emptyData);
  });

  test('modifyData - add one', () => {
    const addedInput = modifyData(emptyData, 'Input', '');
    expect(addedInput).to.not.deep.equals(emptyData);
    expect(addedInput.components).to.have.length(1);
    expect(addedInput.components[0].id).to.match(/^Input-/);
    expect(addedInput.components[0].type).to.equals('Input');
    expect(addedInput.components[0].config).to.not.undefined;
  });

  test('modifyData - add two', () => {
    const addedInput = modifyData(emptyData, 'Input', '');
    const addedButton = modifyData(addedInput, 'Button', '');
    expect(addedButton).to.not.deep.equals(addedInput);
    expect(addedButton.components).to.have.length(2);
    expect(addedButton.components[1].type).to.equals('Button');
  });

  const prefilledData: DeepPartial<FormData> = {
    components: [
      { id: '1', type: 'Input', config: {} },
      { id: '2', type: 'Button', config: {} },
      { id: '3', type: 'Text', config: {} }
    ]
  };

  test('modifyData - move down', () => {
    const data = prefilledData as FormData;
    expectOrder(data, ['1', '2', '3']);
    expectOrder(modifyData(data, '1', '2'), ['1', '2', '3']);
    expectOrder(modifyData(data, '1', '3'), ['2', '1', '3']);
    expectOrder(modifyData(data, '1', '4'), ['2', '3', '1']);
  });

  test('modifyData - move up', () => {
    const data = prefilledData as FormData;
    expectOrder(data, ['1', '2', '3']);
    expectOrder(modifyData(data, '3', '3'), ['1', '2', '3']);
    expectOrder(modifyData(data, '3', '2'), ['1', '3', '2']);
    expectOrder(modifyData(data, '3', '1'), ['3', '1', '2']);
  });

  const expectOrder = (data: FormData, order: string[]) => {
    expect(data.components.map(c => c.id)).to.eql(order);
  };
});
