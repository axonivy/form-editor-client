import { flexRender, type ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import {
  Button,
  deepEqual,
  Fieldset,
  SelectRow,
  Table,
  TableAddRow,
  TableBody,
  TableCell,
  TableResizableHeader,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEffect } from 'react';

export type TableFieldProps<TData extends object> = {
  label: string;
  data: TData[];
  onChange: (change: TData[]) => void;
  columns: ColumnDef<TData, string>[];
  emptyDataObject: TData;
};

export const TableField = <TData extends object>({ label, data, onChange, columns, emptyDataObject }: TableFieldProps<TData>) => {
  const addRow = () => {
    const newData = [...data];
    newData.push(emptyDataObject);
    onChange(newData);
    tableSelection.options.onRowSelectionChange({ [`${newData.length - 1}`]: true });
  };

  const removeRow = () => {
    const index = table.getRowModel().rowsById[Object.keys(tableSelection.tableState.rowSelection!)[0]].index;
    const newData = [...data];
    newData.splice(index, 1);
    if (newData.length === 0) {
      tableSelection.options.onRowSelectionChange({});
    } else if (index === data.length - 1) {
      tableSelection.options.onRowSelectionChange({ [`${newData.length - 1}`]: true });
    }
    onChange(newData);
  };

  const showAddButton = () => {
    if (data.filter(obj => deepEqual(obj, emptyDataObject)).length === 0) {
      return <TableAddRow addRow={addRow} />;
    }
    return null;
  };

  const tableSelection = useTableSelect<TData>();
  const table = useReactTable({
    ...tableSelection.options,
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...tableSelection.tableState
    },
    meta: {
      updateData: (rowId: string, columnId: string, value: string) => {
        const rowIndex = parseInt(rowId);
        const updatedData = data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              [columnId]: value
            };
          }
          return row;
        });
        onChange(updatedData);
      }
    }
  });

  useEffect(() => {
    if (Object.keys(table.getSelectedRowModel().rows).length !== 1) {
      const filteredData = data.filter(obj => !deepEqual(obj, emptyDataObject));

      if (filteredData.length !== data.length) {
        table.setRowSelection({});
        onChange(filteredData);
      }
      return;
    }
  }, [data, emptyDataObject, onChange, table, tableSelection.tableState.rowSelection]);

  return (
    <Fieldset
      label={label}
      control={table.getSelectedRowModel().rows.length > 0 && <Button icon={IvyIcons.Trash} aria-label='Remove row' onClick={removeRow} />}
      className='table-field'
    >
      <Table>
        <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.setRowSelection({})} />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <SelectRow key={row.id} row={row}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </SelectRow>
          ))}
        </TableBody>
      </Table>
      {showAddButton()}
    </Fieldset>
  );
};
