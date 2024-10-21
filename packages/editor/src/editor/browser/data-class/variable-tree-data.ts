import type { Variable, VariableInfo } from '@axonivy/form-editor-protocol';
import { labelText, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Row } from '@tanstack/react-table';
import { componentForType } from '../../../components/components';
import type { CreateComponentData } from '../../../types/config';

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

  return { of, loadChildrenFor, typesOfParam };
};

export const fullVariablePath = (row: Row<BrowserNode>, dontShowRootNode: boolean = false): string => {
  const parentRows = row.getParentRows();
  const isFlatStructure = parentRows.length === 0;
  const relevantParents = dontShowRootNode && !isFlatStructure ? parentRows.slice(1) : parentRows;

  const parentPath = relevantParents.map(parent => parent.original.value).join('.');

  if (row.original.value === 'Use entire Object' && dontShowRootNode) {
    return '';
  }
  return parentPath ? `${parentPath}.${row.original.value}` : row.original.value;
};

export const rowToCreateData = (row: Row<BrowserNode>): CreateComponentData | undefined => {
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

export const findVariablesOfType = (variableInfo: VariableInfo, type: string, maxDepth: number = 10): Array<BrowserNode<Variable>> => {
  const result: Array<BrowserNode<Variable>> = [];
  const visitedTypes = new Set<string>();

  const traverse = (currentType: string, path: string[], depth: number): void => {
    if (depth > maxDepth) return;

    const variables = variableInfo.types[currentType];
    if (!variables || visitedTypes.has(currentType)) return;

    visitedTypes.add(currentType);

    for (const variable of variables) {
      const newPath = [...path, variable.attribute];
      if (variable.type.includes(type)) {
        result.push({
          value: newPath.join('.'),
          info: variable.type,
          icon: IvyIcons.Attribute,
          data: variable,
          children: [],
          isLoaded: true
        });
      } else {
        traverse(variable.type, newPath, depth + 1);
      }
    }

    visitedTypes.delete(currentType);
  };

  for (const rootVariable of variableInfo.variables) {
    traverse(rootVariable.type, [rootVariable.attribute], 0);
  }

  return result;
};

export function findAttributesOfType(data: VariableInfo, variableName: string, maxDepth: number = 10): Array<BrowserNode<Variable>> {
  const nameToSearch = extractVariableName(variableName);

  for (const attributes of Object.values(data.types)) {
    const foundType = attributes.find(attr => attr.attribute === nameToSearch);
    if (foundType) {
      const extractedType = extractTypeFromList(foundType.type);
      const children = processType(data, extractedType, maxDepth);

      return [
        {
          value: 'Use entire Object',
          info: extractedType,
          icon: IvyIcons.Attribute,
          data: { attribute: nameToSearch, description: '', simpleType: extractedType, type: extractedType },
          children,
          isLoaded: true
        }
      ];
    }
  }

  return [];
}

function processType(data: VariableInfo, type: string, currentDepth: number): Array<BrowserNode<Variable>> {
  if (currentDepth <= 0) {
    return [];
  }

  const foundAttributes = data.types[type];
  if (!foundAttributes) {
    return [];
  }

  return foundAttributes.map(param => ({
    value: param.attribute,
    info: param.type,
    icon: IvyIcons.Attribute,
    data: param,
    children: processType(data, param.type, currentDepth - 1),
    isLoaded: true
  }));
}

function extractVariableName(variableName: string): string {
  const cleanedName = variableName.replace(/^#\{|\}$/g, '').trim();

  const lastDotIndex = cleanedName.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return cleanedName.substring(lastDotIndex + 1);
  }

  return cleanedName;
}

function extractTypeFromList(type: string): string {
  const match = type.match(/^List<(.+)>$/);
  return match ? match[1] : '';
}
