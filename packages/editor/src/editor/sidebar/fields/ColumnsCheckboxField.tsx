import type { DataTable, DataTableColumn, Variable } from '@axonivy/form-editor-protocol';
import { BasicCheckbox, Fieldset, Message, type BrowserNode } from '@axonivy/ui-components';
import { useMeta } from '../../../context/useMeta';
import { useAppContext } from '../../../context/AppContext';
import { createId, useData } from '../../../data/data';
import { findAttributesOfType } from '../../../data/variable-tree-data';

type ColumnsCheckboxFieldProps = {
  label: string;
  columns: DataTableColumn[];
  onChange: (value: DataTableColumn[]) => void;
};

type CheckboxColumn = DataTableColumn & { selected: boolean };

export const ColumnsCheckboxField = ({ label, columns, onChange }: ColumnsCheckboxFieldProps) => {
  const { context } = useAppContext();
  const { element } = useData();

  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const attributesOfTableType = findAttributesOfType(variableInfo, element ? (element.config as unknown as DataTable).value : '');
  const dataTableColumns = convertBrowserNodesToColumns(attributesOfTableType);

  const selectableDataTableColumns: CheckboxColumn[] = dataTableColumns.map(column => ({
    ...column,
    selected: columns.some(col => col.config.value === column.config.value)
  }));

  const handleCheckboxChange = (e: boolean | 'indeterminate', column: CheckboxColumn) => {
    if (e === true) {
      const newColumn: DataTableColumn = {
        config: {
          header: column.config.header,
          value: column.config.value
        },
        id: createId('DataTableColumn')
      };
      const newColumns = [...columns, newColumn];
      onChange(newColumns);
    } else if (e === false) {
      const newColumns = columns.filter(col => !(col.config.value === column.config.value));
      onChange(newColumns);
    }
  };

  return dataTableColumns.length === 0 ? (
    <Message variant='warning' message='Defined Object is not valid' />
  ) : (
    <Fieldset label={label}>
      {selectableDataTableColumns.map(column => (
        <BasicCheckbox
          key={column.id}
          label={column.config.header}
          checked={column.selected}
          onCheckedChange={e => handleCheckboxChange(e, column)}
        />
      ))}
    </Fieldset>
  );
};

const convertBrowserNodesToColumns = (nodes: Array<BrowserNode<Variable>>): DataTableColumn[] => {
  const columns: DataTableColumn[] = [];

  const convertNode = (node: BrowserNode<Variable>) => {
    if (!node.children || node.children.length === 0) {
      columns.push({
        id: createId('DataTableColumn'),
        config: {
          header: node.data?.attribute ?? '',
          value: ''
        }
      });
    } else {
      node.children.forEach(childNode => {
        columns.push({
          id: createId('DataTableColumn'),
          config: {
            header: childNode.value,
            value: childNode.value
          }
        });
      });
    }
  };

  nodes.forEach(convertNode);

  return columns;
};
