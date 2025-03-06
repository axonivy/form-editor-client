import { Message, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../context/useMeta';
import { useCallback, useEffect, useState } from 'react';
import type { ConfigData, Variable } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../context/AppContext';
import { findParentTableComponent, getParentColumnComponent, useData } from '../../../data/data';
import type { BrowserOptions } from '../Browser';
import { findAttributesOfType, variableTreeData, fullVariablePath } from './variable-tree-data';

export const ATTRIBUTE_BROWSER_ID = 'Attribute';

export const useAttributeBrowser = (options?: BrowserOptions): Browser => {
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const { element, data } = useData();
  const dynamicList = (element?.config as ConfigData).dynamicItemsList as string;

  useEffect(() => {
    if (options?.onlyAttributes === 'DYNAMICLIST') {
      setTree(findAttributesOfType(variableInfo, dynamicList));
    } else if (options?.onlyAttributes === 'COLUMN') {
      const parentTableComponent = findParentTableComponent(data.components, element);
      setTree(findAttributesOfType(variableInfo, parentTableComponent ? parentTableComponent.value : ''));
    } else if (element && getParentColumnComponent(data.components, element.cid).isDataTableColumnComponent) {
      const parentTableComponent = findParentTableComponent(
        data.components,
        getParentColumnComponent(data.components, element.cid).component
      );
      setTree([
        ...findAttributesOfType(variableInfo, parentTableComponent ? parentTableComponent.value : '', 10, 'row'),
        ...variableTreeData().of(variableInfo)
      ]);
    } else {
      setTree(variableTreeData().of(variableInfo));
    }
  }, [data.components, dynamicList, element, options?.onlyAttributes, variableInfo]);

  const loadChildren = useCallback<(row: BrowserNode) => void>(
    row => setTree(tree => variableTreeData().loadChildrenFor(variableInfo, row.info, tree)),
    [variableInfo, setTree]
  );
  const browser = useBrowser(tree, { loadChildren: row => loadChildren(row.original) });
  return {
    name: ATTRIBUTE_BROWSER_ID,
    icon: IvyIcons.Attribute,
    browser,
    header: options?.typeHint ? <Message variant='info' message={`Type '${options.typeHint}' defined by the input field`} /> : undefined,
    infoProvider: row => row?.original.info,
    applyModifier: row => (row ? { value: fullVariablePath(row, options?.onlyAttributes && true) } : { value: '' })
  };
};
