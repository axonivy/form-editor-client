import type { VariableInfo } from '@axonivy/form-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';
import { findAttributesOfType, formatVariableValue, fullVariablePath, rowToCreateData, variableTreeData } from './variable-tree-data';
import { renderHook } from '@testing-library/react';
import { useComponents } from '../../../components/components';

// Needs because 'renderHook' is imported
/* eslint-disable testing-library/no-node-access */

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
    expect(tree[0].children[2].isLoaded).toBeTruthy();
    expect(tree[0].children[2].children).toHaveLength(1);
    expect(tree[0].children[2].children[0].value).equals('email');
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

test('findAttributesOfType of List<demo.Endless>', () => {
  const list = findAttributesOfType(endlessParamInfo, 'param.Endless.endlessList');
  expect(list.length).toEqual(1);
  expect(list[0].value).toEqual('variable');
  expect(list[0].info).toEqual('demo.Endless');
  expect(list[0].children[0].value).toEqual('endless');
  expect(list[0].children[0].info).toEqual('demo.Endless');
  expect(list[0].children[2].value).toEqual('something');
  expect(list[0].children[2].info).toEqual('String');
});

const row = {
  original: { value: 'country', info: 'String' },
  getParentRows: () => [{ original: { value: 'data' } }, { original: { value: 'address' } }, { original: { value: 'location' } }]
} as Row<BrowserNode>;

test('fullVariablePath', () => {
  expect(fullVariablePath(row)).toEqual('data.address.location.country');
});

test('fullVariablePath dontShowRootNode', () => {
  expect(fullVariablePath(row, false)).toEqual('address.location.country');
});

test('rowToCreateData', () => {
  const { result: componentsResult } = renderHook(() => useComponents());
  const { componentForType } = componentsResult.current;
  expect(rowToCreateData({ original: { value: 'country', info: 'java.util.List' } } as Row<BrowserNode>, componentForType)).toEqual(
    undefined
  );
  expect(rowToCreateData(row, componentForType)).toEqual({
    componentName: 'Input',
    label: 'Country',
    value: '#{data.address.location.country}'
  });
});

test('return the variable path wrapped in #{ } when no prefix is provided', () => {
  expect(formatVariableValue('some.path')).toBe('#{some.path}');
});

test('prepend prefix when given', () => {
  expect(formatVariableValue('some.path', 'prefix')).toBe('#{prefix.some.path}');
});

test('return only the prefix when variablePath is empty', () => {
  expect(formatVariableValue('', 'prefix')).toBe('#{prefix}');
});

test('return an empty #{ } when both prefix and variablePath are empty', () => {
  expect(formatVariableValue('')).toBe('#{}');
});
