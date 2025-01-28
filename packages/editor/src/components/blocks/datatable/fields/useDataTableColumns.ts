import { isTable, type DataTableColumn, type Variable } from '@axonivy/form-editor-protocol';

import type { BrowserNode } from '@axonivy/ui-components';
import { useAppContext } from '../../../../context/AppContext';
import { useData } from '../../../../data/data';
import { useMeta } from '../../../../context/useMeta';
import type { CheckboxColumn } from './ColumnsCheckboxField';
import { useEffect, useMemo, useState } from 'react';
import { DataTableColumnComponent } from '../../../../components/blocks/datatablecolumn/DataTableColumn';
import { findAttributesOfType } from '../../../../editor/browser/data-class/variable-tree-data';

export const useDataTableColumns = () => {
  const { context } = useAppContext();
  const { element } = useData();

  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const attributesOfTableType = findAttributesOfType(variableInfo, isTable(element) ? element.config.value : '');
  const activeColumns = useMemo(() => (isTable(element) ? element.config.components.map(c => c.config) : []), [element]);
  const boundColumns = convertBrowserNodesToColumns(attributesOfTableType);

  const [activeColumnsHistory, setActiveColumnsHistory] = useState<DataTableColumn[]>(activeColumns);

  const boundSelectColumns = boundColumns.map<CheckboxColumn>(column => ({
    ...(activeColumnsHistory.find(col => isSameColumn(col, column)) ?? column),
    selected: activeColumns ? activeColumns.some(col => isSameColumn(col, column)) : false
  }));
  const activeUnboundSelectColumns = useMemo(
    () =>
      activeColumns
        ? activeColumns
            .filter(col => !boundColumns.some(dataCol => isSameColumn(col, dataCol)))
            .map<CheckboxColumn>(column => ({
              ...column,
              selected: true
            }))
        : [],
    [activeColumns, boundColumns]
  );

  const [unboundSelectColumns, setUnboundSelectColumns] = useState<CheckboxColumn[]>(activeUnboundSelectColumns);

  useEffect(() => {
    const newColumns = activeUnboundSelectColumns.filter(
      newColumn => !unboundSelectColumns.some(localColumn => isSameColumn(localColumn, newColumn))
    );
    const removeColumns = boundSelectColumns.filter(removeColumn =>
      unboundSelectColumns.some(localColumn => isSameColumn(localColumn, removeColumn))
    );

    if (newColumns.length > 0) {
      setUnboundSelectColumns(prevColumns => [...prevColumns, ...newColumns.map(column => ({ ...column, selected: true }))]);
    }

    if (removeColumns.length > 0) {
      setUnboundSelectColumns(prevColumns =>
        prevColumns.filter(localColumn => !removeColumns.some(removeColumn => isSameColumn(localColumn, removeColumn)))
      );
    }
  }, [boundSelectColumns, unboundSelectColumns, activeUnboundSelectColumns]);

  return {
    boundColumns,
    activeColumns,
    boundSelectColumns,
    unboundSelectColumns,
    setUnboundSelectColumns,
    setActiveColumnsHistory
  };
};

const convertBrowserNodesToColumns = (nodes: Array<BrowserNode<Variable>>): DataTableColumn[] => {
  return nodes.flatMap(node => {
    if (!node.children || node.children.length === 0) {
      return [DataTableColumnComponent.create({ label: node.data?.attribute ?? '', value: '' })];
    }
    return node.children.map(childNode => DataTableColumnComponent.create({ label: childNode.value, value: childNode.value }));
  });
};

export const isSameColumn = (col1: DataTableColumn, col2: DataTableColumn) => col1.value === col2.value;
