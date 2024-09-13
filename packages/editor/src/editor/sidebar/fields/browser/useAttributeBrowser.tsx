import { useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../../context/useMeta';
import { findAttributesOfType, fullVariablePath, variableTreeData, findVariablesOfType } from '../../../../data/variable-tree-data';
import { useCallback, useEffect, useState } from 'react';
import type { ConfigData, Variable } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../../context/AppContext';
import { findParentTableComponent, useData } from '../../../../data/data';
import type { OnlyAttributeSelection } from '../../../../types/config';

export const ATTRIBUTE_BROWSER_ID = 'Attribute' as const;

export const useAttributeBrowser = (onlyAttributesFor?: OnlyAttributeSelection, onlyTypesOf?: string): Browser => {
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const { element, data } = useData();
  const dynamicList = (element?.config as ConfigData).dynamicItemsList as string;

  useEffect(() => {
    if (onlyTypesOf && !onlyAttributesFor) {
      setTree(findVariablesOfType(variableInfo, onlyTypesOf));
    } else if (!onlyTypesOf && onlyAttributesFor === 'DYNAMICLIST') {
      setTree(findAttributesOfType(variableInfo, dynamicList));
    } else if (!onlyTypesOf && onlyAttributesFor === 'COLUMN') {
      const parentTableComponent = findParentTableComponent(data.components, element);
      setTree(findAttributesOfType(variableInfo, parentTableComponent ? parentTableComponent.value : ''));
    } else {
      setTree(variableTreeData().of(variableInfo));
    }
  }, [data.components, dynamicList, element, onlyAttributesFor, onlyTypesOf, variableInfo]);

  const loadChildren = useCallback<(row: BrowserNode) => void>(
    row => setTree(tree => variableTreeData().loadChildrenFor(variableInfo, row.info, tree)),
    [variableInfo, setTree]
  );
  const attributes = useBrowser(tree, onlyTypesOf ? undefined : row => loadChildren(row.original));
  return {
    name: ATTRIBUTE_BROWSER_ID,
    icon: IvyIcons.Attribute,
    browser: attributes,
    infoProvider: row => row?.original.info,
    applyModifier: row => ({ value: onlyTypesOf ? row.original.value : fullVariablePath(row, onlyAttributesFor && true) })
  };
};
