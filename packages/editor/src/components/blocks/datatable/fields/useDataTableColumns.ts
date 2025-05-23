import { isTable, type DataTableColumn, type Variable } from '@axonivy/form-editor-protocol';

import type { BrowserNode } from '@axonivy/ui-components';
import { useAppContext } from '../../../../context/AppContext';
import { useData } from '../../../../data/data';
import { useMeta } from '../../../../context/useMeta';
import { useMemo } from 'react';
import { useDataTableColumnComponent } from '../../../../components/blocks/datatablecolumn/DataTableColumn';
import { findAttributesOfType } from '../../../../editor/browser/data-class/variable-tree-data';
import type { ColumnItem } from './ColumnsField';

export const useDataTableColumns = () => {
  const { context } = useAppContext();
  const { element } = useData();
  const { DataTableColumnComponent } = useDataTableColumnComponent();

  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const attributesOfTableType = findAttributesOfType(variableInfo, isTable(element) ? element.config.value : '', 10, 'row');

  const activeColumns = useMemo(
    () =>
      isTable(element)
        ? element.config.components.map<ColumnItem>(c => ({
            ...c.config,
            columnCid: c.cid
          }))
        : [],
    [element]
  );

  const convertBrowserNodesToColumns = (nodes: Array<BrowserNode<Variable>>): DataTableColumn[] => {
    return nodes.flatMap(node => {
      if (node.children.length === 0) {
        return [DataTableColumnComponent.create({ label: node.data?.attribute ?? '', value: '' })];
      }
      return node.children.map(childNode => DataTableColumnComponent.create({ label: childNode.value, value: childNode.value }));
    });
  };

  const boundColumns = convertBrowserNodesToColumns(attributesOfTableType);

  const boundInactiveColumns = useMemo(() => {
    return boundColumns.filter(boundCol => !activeColumns.some(activeCol => activeCol.value === boundCol.value));
  }, [boundColumns, activeColumns]);

  return {
    boundColumns,
    activeColumns,
    boundInactiveColumns
  };
};
