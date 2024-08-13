import type { VariableInfo } from '@axonivy/form-editor-protocol';
import { findListVariables, fullVariablePath, rowToCreateData, variableTreeData } from './variable-tree-data';
import type { BrowserNode } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';

const variableInfo: VariableInfo = {
  variables: [
    {
      attribute: 'param.procurementRequest',
      type: 'workflow.humantask.ProcurementRequest',
      simpleType: 'ProcurementRequest',
      description: ''
    }
  ],
  types: {
    'workflow.humantask.ProcurementRequest': [
      {
        attribute: 'accepted',
        type: 'Boolean',
        simpleType: 'Boolean',
        description: ''
      },
      {
        attribute: 'amount',
        type: 'Number',
        simpleType: 'Number',
        description: ''
      },
      {
        attribute: 'requester',
        type: 'workflow.humantask.User',
        simpleType: 'User',
        description: ''
      }
    ],
    'workflow.humantask.User': [
      {
        attribute: 'email',
        type: 'String',
        simpleType: 'String',
        description: ''
      }
    ]
  }
};

const endlessParamInfo: VariableInfo = {
  variables: [
    {
      attribute: 'param.Endless',
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
      },
      {
        attribute: 'endlessList',
        type: 'List<demo.Endless>',
        simpleType: 'List<demo.Endless>',
        description: ''
      },
      {
        attribute: 'something',
        type: 'String',
        simpleType: 'String',
        description: ''
      }
    ]
  }
};

describe('variableTreeData', () => {
  test('of', () => {
    const tree = variableTreeData().of(variableInfo);
    expect(tree).toHaveLength(1);
    expect(tree[0].value).equals('param.procurementRequest');
    expect(tree[0].children).toHaveLength(3);
    expect(tree[0].children[0].value).equals('accepted');
    expect(tree[0].children[1].value).equals('amount');
    expect(tree[0].children[2].value).equals('requester');
  });

  test('of with lazy loading', () => {
    const tree = variableTreeData().of(variableInfo);
    expect(tree[0].children[0].isLoaded).toBeTruthy();
    expect(tree[0].children[1].isLoaded).toBeTruthy();
    expect(tree[0].children[2].isLoaded).toBeFalsy();

    variableTreeData().loadChildrenFor(variableInfo, 'workflow.humantask.User', tree);
    expect(tree[0].children[2].isLoaded).toBeTruthy();
    expect(tree[0].children[2].children).toHaveLength(1);
  });

  test('of endless', () => {
    const tree = variableTreeData().of(endlessParamInfo);
    expect(tree[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].isLoaded).toBeFalsy();

    variableTreeData().loadChildrenFor(endlessParamInfo, 'demo.Endless', tree);
    expect(tree[0].children[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].children[0].isLoaded).toBeFalsy();

    variableTreeData().loadChildrenFor(endlessParamInfo, 'demo.Endless', tree);
    expect(tree[0].children[0].children[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].children[0].children[0].isLoaded).toBeFalsy();
  });

  test('of endless', () => {
    const tree = variableTreeData().of(endlessParamInfo);
    expect(tree[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].isLoaded).toBeFalsy();

    variableTreeData().loadChildrenFor(endlessParamInfo, 'demo.Endless', tree);
    expect(tree[0].children[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].children[0].isLoaded).toBeFalsy();

    variableTreeData().loadChildrenFor(endlessParamInfo, 'demo.Endless', tree);
    expect(tree[0].children[0].children[0].isLoaded).toBeTruthy();
    expect(tree[0].children[0].children[0].children[0].isLoaded).toBeFalsy();
  });
});

test('of endless', () => {
  const list = findListVariables(endlessParamInfo);
  expect(list.length).toEqual(1);
  expect(list[0].value).toEqual('param.Endless.endlessList');
  expect(list[0].info).toEqual('List<demo.Endless>');
});

const row = {
  original: { value: 'country', info: 'String' },
  getParentRows: () => [{ original: { value: 'data' } }, { original: { value: 'address' } }, { original: { value: 'location' } }]
} as Row<BrowserNode>;

test('fullVariablePath', () => {
  expect(fullVariablePath(row)).toEqual('data.address.location.country');
});

test('rowToCreateData', () => {
  expect(rowToCreateData({ original: { value: 'country', info: 'java.util.List' } } as Row<BrowserNode>)).toEqual(undefined);
  expect(rowToCreateData(row)).toEqual({
    componentName: 'Input',
    label: 'Country',
    value: '#{data.address.location.country}'
  });
});
