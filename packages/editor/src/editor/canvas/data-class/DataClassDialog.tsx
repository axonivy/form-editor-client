import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ExpandableCell,
  SelectRow,
  Table,
  TableBody,
  TableCell,
  useTableExpand,
  useTableSelect,
  type BrowserNode
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../context/useMeta';
import { useAppContext } from '../../../context/useData';
import { useCallback, useEffect, useState } from 'react';
import type { Variable } from '@axonivy/form-editor-protocol';
import { variableTreeData } from '../../properties/fields/browser/variable-tree-data';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import { modifyData } from '../../../data/data';
import type { CreateData } from '../../../types/config';
import { componentForType } from '../../../components/components';
import { labelText } from '../../../utils/string';

export const DataClassDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button icon={IvyIcons.DatabaseLink} variant='outline'>
        Create from data class
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create from data class</DialogTitle>
      </DialogHeader>
      <DataClassSelect />
    </DialogContent>
  </Dialog>
);

const DataClassSelect = () => {
  const { context, setData } = useAppContext();
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const dataClass = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  useEffect(() => setTree(variableTreeData().of(dataClass)), [dataClass]);
  const loadChildren = useCallback<(row: Row<BrowserNode>) => void>(
    row => setTree(tree => variableTreeData().loadChildrenFor(dataClass, row.original.info, tree)),
    [dataClass, setTree]
  );
  const columns: ColumnDef<BrowserNode, string>[] = [
    {
      accessorKey: 'value',
      cell: cell => (
        <ExpandableCell
          cell={cell}
          icon={cell.row.original.icon}
          lazy={cell.row.original.isLoaded !== undefined ? { isLoaded: cell.row.original.isLoaded, loadChildren } : undefined}
        >
          <span>{cell.getValue()}</span>
          <span style={{ color: 'var(--N500)' }}>{cell.row.original.info}</span>
        </ExpandableCell>
      )
    }
  ];
  const [filter, setFilter] = useState('');
  const expanded = useTableExpand<BrowserNode>({ '0': true });
  const select = useTableSelect<BrowserNode>();
  const table = useReactTable({
    ...expanded.options,
    ...select.options,
    enableMultiRowSelection: true,
    enableSubRowSelection: true,
    data: tree,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
      ...expanded.tableState,
      ...select.tableState
    }
  });
  const createFromSelection = () => {
    const creates = table
      .getSelectedRowModel()
      .flatRows.filter(row => componentForType(row.original.info) !== undefined)
      .map<CreateData>(row => {
        const node = row.original;
        const component = componentForType(node.info)!;
        return {
          componentName: component.component.name,
          label: labelText(node.value),
          value: `#{${row
            .getParentRows()
            .map(parent => parent.original.value)
            .join('.')}.${node.value}}`,
          ...component.defaultProps
        };
      });
    setData(data => modifyData(data, { type: 'add', data: { creates } }).newData);
  };
  return (
    <>
      <Table>
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
      <DialogFooter>
        <DialogClose asChild>
          <Button variant='primary' onClick={createFromSelection}>
            Create
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant='outline'>Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};
