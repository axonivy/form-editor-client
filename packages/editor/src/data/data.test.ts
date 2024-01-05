import { modifyData, type UiEditorData } from './data';

describe('data', () => {
  const emptyData: UiEditorData = { root: {}, content: [] };

  test('modifyData - add unknown', () => {
    expect(modifyData(emptyData, 'unknown', '')).to.deep.equals(emptyData);
  });

  test('modifyData - add one', () => {
    const addedInput = modifyData(emptyData, 'Input', '');
    expect(addedInput).to.not.deep.equals(emptyData);
    expect(addedInput.content).to.have.length(1);
    expect(addedInput.content[0].id).to.match(/^Input-/);
    expect(addedInput.content[0].type).to.equals('Input');
    expect(addedInput.content[0].props).to.not.undefined;
  });

  test('modifyData - add two', () => {
    const addedInput = modifyData(emptyData, 'Input', '');
    const addedButton = modifyData(addedInput, 'Button', '');
    expect(addedButton).to.not.deep.equals(addedInput);
    expect(addedButton.content).to.have.length(2);
    expect(addedButton.content[1].type).to.equals('Button');
  });

  const prefilledData: UiEditorData = {
    root: {},
    content: [
      { id: '1', type: 'Input', props: {} },
      { id: '2', type: 'Button', props: {} },
      { id: '3', type: 'Text', props: {} }
    ]
  };

  test('modifyData - move down', () => {
    expectOrder(prefilledData, ['1', '2', '3']);
    expectOrder(modifyData(prefilledData, '1', '2'), ['1', '2', '3']);
    expectOrder(modifyData(prefilledData, '1', '3'), ['2', '1', '3']);
    expectOrder(modifyData(prefilledData, '1', '4'), ['2', '3', '1']);
  });

  test('modifyData - move up', () => {
    expectOrder(prefilledData, ['1', '2', '3']);
    expectOrder(modifyData(prefilledData, '3', '3'), ['1', '2', '3']);
    expectOrder(modifyData(prefilledData, '3', '2'), ['1', '3', '2']);
    expectOrder(modifyData(prefilledData, '3', '1'), ['3', '1', '2']);
  });

  const expectOrder = (data: UiEditorData, order: string[]) => {
    expect(data.content.map(c => c.id)).to.eql(order);
  };
});
