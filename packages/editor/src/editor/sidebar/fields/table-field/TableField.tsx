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
import { useCallback, useState } from 'react';

export type TableFieldProps<TData extends object> = {
  label: string;
  data: TData[];
  onChange: (change: TData[]) => void;
  columns: ColumnDef<TData, string>[];
  emptyDataObject: TData;
};

export const TableField = <TData extends object>({ label, data, onChange, columns, emptyDataObject }: TableFieldProps<TData>) => {
  const [tableData, setTableData] = useState(data);
  const changeData = useCallback(
    (change: TData[]) => {
      setTableData(change);
      onChange(change.filter(obj => !deepEqual(obj, emptyDataObject)));
    },
    [emptyDataObject, onChange]
  );

  const addRow = () => {
    const newData = [...tableData];
    newData.push(emptyDataObject);
    changeData(newData);
    tableSelection.options.onRowSelectionChange({ [`${newData.length - 1}`]: true });
  };

  const removeRow = () => {
    const index = table.getRowModel().rowsById[Object.keys(tableSelection.tableState.rowSelection!)[0]].index;
    const newData = [...tableData];
    newData.splice(index, 1);
    if (newData.length === 0) {
      tableSelection.options.onRowSelectionChange({});
    } else if (index === tableData.length - 1) {
      tableSelection.options.onRowSelectionChange({ [`${newData.length - 1}`]: true });
    }
    changeData(newData);
  };

  const showAddButton = () => {
    if (tableData.filter(obj => deepEqual(obj, emptyDataObject)).length === 0) {
      return <TableAddRow addRow={addRow} />;
    }
    return null;
  };

  const tableSelection = useTableSelect<TData>();
  const table = useReactTable({
    ...tableSelection.options,
    data: tableData,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...tableSelection.tableState
    },
    meta: {
      updateData: (rowId: string, columnId: string, value: string) => {
        const rowIndex = parseInt(rowId);
        const updatedData = tableData.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              [columnId]: value
            };
          }
          return row;
        });
        changeData(updatedData);
      }
    }
  });

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
