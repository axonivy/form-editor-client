import { useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../../context/useMeta';
import { findAttributesOfType, fullVariablePath, variableTreeData, findVariablesOfType } from '../../../../data/variable-tree-data';
import { useCallback, useEffect, useState } from 'react';
import type { Variable } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../../context/AppContext';
import { useData } from '../../../../data/data';

export const ATTRIBUTE_BROWSER_ID = 'Attribute' as const;

export const useAttributeBrowser = (onlyAttributes: boolean, onlyTypesOf?: string): Browser => {
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const { element } = useData();
  const dynamicList = element?.config.dynamicItemsList as string;

  useEffect(() => {
    if (onlyTypesOf && !onlyAttributes) {
      setTree(findVariablesOfType(variableInfo, onlyTypesOf));
    } else if (!onlyTypesOf && onlyAttributes) {
      setTree(findAttributesOfType(variableInfo, dynamicList));
    } else {
      setTree(variableTreeData().of(variableInfo));
    }
  }, [onlyTypesOf, onlyAttributes, variableInfo, dynamicList]);

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
    applyModifier: row => ({ value: onlyTypesOf ? row.original.value : fullVariablePath(row, onlyAttributes) })
  };
};
