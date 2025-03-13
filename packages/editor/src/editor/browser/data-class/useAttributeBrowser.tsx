import { Message, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../context/useMeta';
import { useCallback, useEffect, useState } from 'react';
import { isTable, type ConfigData, type Dialog, type Variable } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../context/AppContext';
import { findComponentDeep, getParentComponent, useData } from '../../../data/data';
import type { BrowserOptions } from '../Browser';
import { findAttributesOfType, variableTreeData, fullVariablePath } from './variable-tree-data';
import { stripELExpression } from '../../../utils/string';

export const ATTRIBUTE_BROWSER_ID = 'Attribute' as const;

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
    switch (options?.onlyAttributes) {
      case 'DYNAMICLIST':
        setTree(findAttributesOfType(variableInfo, dynamicList));
        break;
      case 'COLUMN':
        if (parentComponent && isTable(parentComponent)) setTree(findAttributesOfType(variableInfo, parentComponent.config.value || ''));
        break;
      default:
        if (parentComponent && parentComponent.type === 'DataTableColumn') {
          const parentTableComponent = getParentComponent(data.components, parentComponent.cid);
          setTree([
            ...findAttributesOfType(variableInfo, isTable(parentTableComponent) ? parentComponent.config.value : '', 10, 'row'),
            ...variableTreeData().of(variableInfo)
          ]);
        } else if (parentComponent && parentComponent.type === 'Dialog') {
          setComponentInDialog(true);
          const dataTable = findComponentDeep(data.components, (parentComponent.config as unknown as Dialog)?.linkedComponent);
          const table = dataTable ? dataTable.data[dataTable.index] : undefined;
          if (table && isTable(table)) {
            setTree(findAttributesOfType(variableInfo, stripELExpression(table.config.value)));
          }
        } else {
          setTree(variableTreeData().of(variableInfo));
          return;
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
    applyModifier: row => getApplyModifierValue(row, componentInDialog, options)
  };
};

export const getApplyModifierValue = (
  row: Row<BrowserNode<unknown>> | undefined,
  componentInDialog: boolean,
  options?: BrowserOptions
): { value: string } => {
  if (!row) {
    return { value: '' };
  }

  const prefix = componentInDialog ? 'genericRowManager.selectedRow' : '';
  const path = fullVariablePath(row, (componentInDialog || options?.onlyAttributes) && false);

  return { value: `${prefix}${componentInDialog && path.length > 0 ? '.' : ''}${path}` };
};
