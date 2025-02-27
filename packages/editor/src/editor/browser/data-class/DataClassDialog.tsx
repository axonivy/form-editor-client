import {
  BasicCheckbox,
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
  useHotkeys,
  useTableExpand,
  useTableSelect,
  type BrowserNode
} from '@axonivy/ui-components';
import { useMeta } from '../../../context/useMeta';
import { useAppContext } from '../../../context/AppContext';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { Variable } from '@axonivy/form-editor-protocol';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import { createInitForm, creationTargetId } from '../../../data/data';
import { variableTreeData, rowToCreateData } from './variable-tree-data';
import { useKnownHotkeys } from '../../../utils/hotkeys';

type DataClassDialogProps = {
  children: ReactNode;
  worfkflowButtonsInit?: boolean;
  creationTarget?: string;
};

export const DataClassDialog = ({ children, worfkflowButtonsInit = true, creationTarget }: DataClassDialogProps) => {
  const [open, setOpen] = useState(false);
  const { createFromData: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => setOpen(true), { scopes: ['global'] });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Create from data</DialogTitle>
        </DialogHeader>
        <DataClassSelect worfkflowButtonsInit={worfkflowButtonsInit} creationTarget={creationTarget} />
      </DialogContent>
    </Dialog>
  );
};

const DataClassSelect = ({ worfkflowButtonsInit, creationTarget }: { worfkflowButtonsInit: boolean; creationTarget?: string }) => {
  const { context, setData } = useAppContext();

  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const [workflowButtons, setWorkflowButtons] = useState(worfkflowButtonsInit);
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
  const createForm = () => {
    setData(data => {
      const creates = table
        .getSelectedRowModel()
        .flatRows.map(rowToCreateData)
        .filter(create => create !== undefined);
      return createInitForm(data, creates, workflowButtons, creationTargetId(data.components, creationTarget));
    });
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
      <BasicCheckbox
        checked={workflowButtons}
        onCheckedChange={change => setWorkflowButtons(Boolean(change))}
        label='Create proceed and cancel buttons'
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant='primary' onClick={createForm}>
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
