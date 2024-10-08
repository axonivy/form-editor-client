import { type ColumnDef } from '@tanstack/react-table';
import type { SelectItem } from '@axonivy/form-editor-protocol';
import { InputCellWithBrowser } from './InputCellWithBrowser';
import { TableField, type TableFieldProps } from './TableField';

type SelectTableFieldProps = Omit<TableFieldProps<SelectItem>, 'columns' | 'emptyDataObject'>;

const selectTableColumns: ColumnDef<SelectItem, string>[] = [
  {
    accessorKey: 'label',
    header: () => <span>Label</span>,
    cell: cell => <InputCellWithBrowser cell={cell} />,
    minSize: 50
  },
  {
    accessorKey: 'value',
    header: () => <span>Value</span>,
    cell: cell => <InputCellWithBrowser cell={cell} />
  }
];

export const SelectTableField = (props: SelectTableFieldProps) => (
  <TableField {...props} columns={selectTableColumns} emptyDataObject={{ label: '', value: '' }} />
);
