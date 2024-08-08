import type { Variable, VariableInfo } from '@axonivy/form-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Row } from '@tanstack/react-table';
import { componentForType } from '../components/components';
import { labelText } from '../utils/string';
import type { CreateData } from '../types/config';

export const variableTreeData = () => {
  const of = (paramInfo: VariableInfo): Array<BrowserNode<Variable>> => {
    return paramInfo.variables.map(param => ({
      value: param.attribute,
      info: param.type,
      icon: IvyIcons.Attribute,
      data: param,
      children: typesOfParam(paramInfo, param.type),
      isLoaded: true
    }));
  };

  const loadChildrenFor = (
    paramInfo: VariableInfo,
    paramType: string,
    tree: Array<BrowserNode<Variable>>
  ): Array<BrowserNode<Variable>> => {
    return tree.map(node => {
      if (node.isLoaded === false && node.info === paramType) {
        node.children = typesOfParam(paramInfo, paramType);
        node.isLoaded = true;
      } else {
        loadChildrenFor(paramInfo, paramType, node.children);
      }
      return node;
    });
  };

  const typesOfParam = (paramInfo: VariableInfo, paramType: string): Array<BrowserNode<Variable>> =>
    paramInfo.types[paramType]?.map(type => ({
      value: type.attribute,
      info: type.type,
      icon: IvyIcons.Attribute,
      data: type,
      children: [],
      isLoaded: paramInfo.types[type.type] === undefined
    })) ?? [];

  return { of, loadChildrenFor };
};

export const fullVariablePath = (row: Row<BrowserNode>): string => {
  return `${row
    .getParentRows()
    .map(parent => parent.original.value)
    .join('.')}.${row.original.value}`;
};

export const rowToCreateData = (row: Row<BrowserNode>): CreateData | undefined => {
  const node = row.original;
  const component = componentForType(node.info);
  if (component === undefined) {
    return undefined;
  }
  return {
    componentName: component.component.name,
    label: labelText(node.value),
    value: `#{${fullVariablePath(row)}}`,
    ...component.defaultProps
  };
};
