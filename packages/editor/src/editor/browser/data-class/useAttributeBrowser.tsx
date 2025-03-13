import { Message, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../context/useMeta';
import { useCallback, useEffect, useState } from 'react';
import { type ConfigData, type Dialog, type Variable } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../context/AppContext';
import { findParentTableComponent, getParentComponent, useData } from '../../../data/data';
import type { BrowserOptions } from '../Browser';
import { findAttributesOfType, variableTreeData, fullVariablePath } from './variable-tree-data';

export const ATTRIBUTE_BROWSER_ID = 'Attribute';

export const useAttributeBrowser = (options?: BrowserOptions): Browser => {
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const [componentInDialog, setComponentInDialog] = useState(false);
  const { context } = useAppContext();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const { element, data } = useData();
  const dynamicList = (element?.config as ConfigData).dynamicItemsList as string;

  useEffect(() => {
    if (!element) {
      setTree(variableTreeData().of(variableInfo));
      return;
    }

    const parentComponent = getParentComponent(data.components, element.cid);
    const parentTableComponent = findParentTableComponent(data.components, element);

    switch (options?.onlyAttributes) {
      case 'DYNAMICLIST':
        setTree(findAttributesOfType(variableInfo, dynamicList));
        break;
      case 'COLUMN':
        setTree(findAttributesOfType(variableInfo, parentTableComponent?.value || ''));
        break;
      default:
        if (!parentComponent) {
          setTree(variableTreeData().of(variableInfo));
          return;
        }
        if (parentComponent.type === 'DataTableColumn') {
          setTree([
            ...findAttributesOfType(variableInfo, parentTableComponent?.value || '', 10, 'row'),
            ...variableTreeData().of(variableInfo)
          ]);
        } else if (parentComponent.type === 'Dialog') {
          setComponentInDialog(true);
          setTree(findAttributesOfType(variableInfo, (parentComponent.config as unknown as Dialog)?.onApply));
        }
        break;
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
    applyModifier: row =>
      row
        ? {
            value: `${componentInDialog ? 'genericRowManager.selectedRow' : ''}${componentInDialog && fullVariablePath(row, true).length > 0 ? '.' : ''}${fullVariablePath(row, componentInDialog || (options?.onlyAttributes && true))}`
          }
        : { value: '' }
  };
};
