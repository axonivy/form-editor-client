import type { DataTable, DataTableColumn, Variable } from '@axonivy/form-editor-protocol';

import type { BrowserNode } from '@axonivy/ui-components';
import { useAppContext } from '../../../../context/AppContext';
import { createId, useData } from '../../../../data/data';
import { useMeta } from '../../../../context/useMeta';
import { findAttributesOfType } from '../../../../data/variable-tree-data';
import type { CheckboxColumn } from './ColumnsCheckboxField';
import { useEffect, useState } from 'react';
import { DataTableColumnComponent } from '../../../../components/blocks/datatablecolumn/DataTableColumn';

export const useDataTableColumns = () => {
  const { context } = useAppContext();
  const { element } = useData();

  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const attributesOfTableType = findAttributesOfType(
    variableInfo,
    element && element.id.startsWith('DataTable') ? (element.config as unknown as DataTable).value : ''
  );
  const activeColumns = element && element.id.startsWith('DataTable') ? (element.config as unknown as DataTable).components : [];
  const boundColumns = convertBrowserNodesToColumns(attributesOfTableType);

  const [activeColumnsHistory, setActiveColumnsHistory] = useState<DataTableColumn[]>(activeColumns);

  const boundSelectColumns = boundColumns.map<CheckboxColumn>(column => ({
    ...(activeColumnsHistory.find(col => isSameColumn(col, column)) ?? column),
    selected: activeColumns ? activeColumns.some(col => isSameColumn(col, column)) : false
  }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activeUnboundSelectColumns = activeColumns
    ? activeColumns
        .filter(col => !boundColumns.some(dataCol => isSameColumn(col, dataCol)))
        .map<CheckboxColumn>(column => ({
          ...column,
          selected: true
        }))
    : [];

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
  const columns: DataTableColumn[] = [];

  const convertNode = (node: BrowserNode<Variable>) => {
    if (!node.children || node.children.length === 0) {
      columns.push({
        id: createId('DataTableColumn'),
        config: DataTableColumnComponent.create({ label: node.data?.attribute ?? '', value: '' })
      });
    } else {
      node.children.forEach(childNode => {
        columns.push({
          id: createId('DataTableColumn'),
          config: DataTableColumnComponent.create({ label: childNode.value, value: childNode.value })
        });
      });
    }
  };

  nodes.forEach(convertNode);

  return columns;
};

export const isSameColumn = (col1: DataTableColumn | CheckboxColumn, col2: DataTableColumn | CheckboxColumn) =>
  col1.config.value === col2.config.value;
