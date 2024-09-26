import type { DataTableColumn } from '@axonivy/form-editor-protocol';
import { BasicCheckbox, Flex, Message } from '@axonivy/ui-components';
import { isSameColumn, useDataTableColumns } from './useDataTableColumns';

type ColumnsCheckboxFieldProps = {
  onChange: (value: DataTableColumn[]) => void;
};

export type CheckboxColumn = DataTableColumn & { selected: boolean };

export const ColumnsCheckboxField = ({ onChange }: ColumnsCheckboxFieldProps) => {
  const { boundColumns, activeColumns, boundSelectColumns, unboundSelectColumns, setUnboundSelectColumns, setActiveColumnsHistory } =
    useDataTableColumns();

  const handleCheckboxChange = (e: boolean | 'indeterminate', column: CheckboxColumn) => {
    if (e === true) {
      const newColumn: DataTableColumn = { ...column };
      const newColumns = [...activeColumns, newColumn];
      const updatedLocalUnbindedColumns = unboundSelectColumns.map(col => {
        if (isSameColumn(col, column)) {
          return { ...col, selected: true };
        }
        return col;
      });
      setActiveColumnsHistory(prevArray => [...prevArray, newColumn]);
      setUnboundSelectColumns(updatedLocalUnbindedColumns);
      onChange(newColumns);
    } else if (e === false) {
      const newColumns = activeColumns.filter(col => !isSameColumn(col, column));
      const updatedLocalUnbindedColumns = unboundSelectColumns.map(col => {
        if (isSameColumn(col, column)) {
          return { ...col, selected: false };
        }
        return col;
      });

      setUnboundSelectColumns(updatedLocalUnbindedColumns);
      onChange(newColumns);
    }
  };

  return (
    <Flex direction='column' gap={1}>
      {boundColumns.length === 0 ? (
        <Message variant='warning' message='Defined Object is not valid' />
      ) : (
        boundSelectColumns.map(column => (
          <BasicCheckbox
            key={column.id}
            label={column.config.header}
            checked={column.selected}
            onCheckedChange={e => handleCheckboxChange(e, column)}
          />
        ))
      )}
      {unboundSelectColumns.map(column => {
        const isStartingWithBound = boundSelectColumns.some(boundCol => column.config.value.startsWith(`${boundCol.config.value}.`));
        return (
          <BasicCheckbox
            key={column.id}
            label={column.config.header + (isStartingWithBound ? '' : ' (unbound)')}
            checked={column.selected}
            onCheckedChange={e => handleCheckboxChange(e, column)}
          />
        );
      })}
    </Flex>
  );
};
