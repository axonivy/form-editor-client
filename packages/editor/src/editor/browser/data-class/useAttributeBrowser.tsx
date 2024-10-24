import { useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../context/useMeta';
import { useCallback, useEffect, useState } from 'react';
import type { ConfigData, Variable } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../context/AppContext';
import { findParentTableComponent, useData } from '../../../data/data';
import type { BrowserOptions } from '../Browser';
import { findVariablesOfType, findAttributesOfType, variableTreeData, fullVariablePath } from './variable-tree-data';

export const ATTRIBUTE_BROWSER_ID = 'Attribute' as const;

export const useAttributeBrowser = (options?: BrowserOptions): Browser => {
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const { element, data } = useData();
  const dynamicList = (element?.config as ConfigData).dynamicItemsList as string;

  useEffect(() => {
    if (options?.onlyTypesOf) {
      setTree(findVariablesOfType(variableInfo, options.onlyTypesOf));
    } else {
      if (options?.onlyAttributes === 'DYNAMICLIST') {
        setTree(findAttributesOfType(variableInfo, dynamicList));
      } else if (options?.onlyAttributes === 'COLUMN') {
        const parentTableComponent = findParentTableComponent(data.components, element);
        setTree(findAttributesOfType(variableInfo, parentTableComponent ? parentTableComponent.value : ''));
      } else {
        setTree(variableTreeData().of(variableInfo));
      }
    }
  }, [data.components, dynamicList, element, options?.onlyAttributes, options?.onlyTypesOf, variableInfo]);

  const loadChildren = useCallback<(row: BrowserNode) => void>(
    row => setTree(tree => variableTreeData().loadChildrenFor(variableInfo, row.info, tree)),
    [variableInfo, setTree]
  );
  const browser = useBrowser(tree, { loadChildren: options?.onlyTypesOf ? undefined : row => loadChildren(row.original) });
  return {
    name: ATTRIBUTE_BROWSER_ID,
    icon: IvyIcons.Attribute,
    browser,
    infoProvider: row => row?.original.info,
    applyModifier: row => ({ value: options?.onlyTypesOf ? row.original.value : fullVariablePath(row, options?.onlyAttributes && true) })
  };
};
