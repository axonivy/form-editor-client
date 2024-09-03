import type { VariableInfo } from '@axonivy/form-editor-protocol';
import { paletteItems } from './data-class-data';

const variableInfo: VariableInfo = {
  variables: [{ attribute: 'data', type: 'jsf.renderer.test.testData', simpleType: 'testData', description: '' }],
  types: {
    'jsf.renderer.Address': [
      { attribute: 'street', type: 'String', simpleType: 'String', description: '' },
      { attribute: 'zip', type: 'Number', simpleType: 'Number', description: '' }
    ],
    'jsf.renderer.test.testData': [
      { attribute: 'address', type: 'jsf.renderer.Address', simpleType: 'Address', description: '' },
      { attribute: 'age', type: 'Number', simpleType: 'Number', description: '' },
      { attribute: 'firstName', type: 'String', simpleType: 'String', description: '' }
    ]
  }
};

const endlessParamInfo: VariableInfo = {
  variables: [
    {
      attribute: 'data',
      type: 'demo.Endless',
      simpleType: 'Endless',
      description: ''
    }
  ],
  types: {
    'demo.Endless': [
      {
        attribute: 'endless',
        type: 'demo.Endless',
        simpleType: 'Endless',
        description: ''
      }
    ]
  }
};

test('of', () => {
  const items = paletteItems(variableInfo, 2);
  console.log(Object.keys(items));
  expect(Object.keys(items)).toEqual(['data', 'data.address', 'data.age', 'data.firstName']);
  expect(items.data[0].name).toEqual('age');
  expect(items.data[0].data).toEqual({ componentName: 'Input', label: 'Age', value: '#{data.age}', type: 'NUMBER' });
  expect(items.data[1].name).toEqual('firstName');
  expect(items.data[1].data).toEqual({ componentName: 'Input', label: 'First Name', value: '#{data.firstName}' });
  expect(items['data.address']).toHaveLength(2);
  expect(items['data.address'][0].name).toEqual('street');
  expect(items['data.address'][0].data).toEqual({ componentName: 'Input', label: 'Street', value: '#{data.address.street}' });
  expect(items['data.address'][1].name).toEqual('zip');
  expect(items['data.address'][1].data).toEqual({ componentName: 'Input', label: 'Zip', value: '#{data.address.zip}', type: 'NUMBER' });
});

test('of endless', () => {
  const items = paletteItems(endlessParamInfo, 2);
  expect(Object.keys(items)).toEqual(['data', 'data.endless']);
});
