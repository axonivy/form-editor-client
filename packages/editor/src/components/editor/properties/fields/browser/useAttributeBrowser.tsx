import { useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../../../context/useMeta';
import { useAppContext } from '../../../../../context/useData';
import { variableTreeData } from './variable-tree-data';
import { useCallback, useEffect, useState } from 'react';
import type { Row } from '@tanstack/table-core';
import type { Variable } from '@axonivy/form-editor-protocol';

export const ATTRIBUTE_BROWSER_ID = 'Attribute' as const;

const fullPath = (row: Row<BrowserNode>): string => {
  const value = row.original.value;
  const parent = row.getParentRow();
  if (parent) {
    return `${fullPath(parent)}.${value}`;
  }
  return value;
};

export const useAttributeBrowser = (): Browser => {
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  useEffect(() => setTree(variableTreeData().of(variableInfo)), [variableInfo]);
  const loadChildren = useCallback<(row: BrowserNode) => void>(
    row => setTree(tree => variableTreeData().loadChildrenFor(variableInfo, row.info, tree)),
    [variableInfo, setTree]
  );
  const attributes = useBrowser(tree, row => loadChildren(row.original));
  return {
    name: ATTRIBUTE_BROWSER_ID,
    icon: IvyIcons.Attribute,
    browser: attributes,
    infoProvider: row => row?.original.info,
    applyModifier: row => ({ value: fullPath(row) })
  };
};
