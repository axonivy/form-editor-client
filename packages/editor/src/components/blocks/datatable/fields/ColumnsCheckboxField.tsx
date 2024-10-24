import { isTable, type DataTableColumnConfig } from '@axonivy/form-editor-protocol';
import { BasicCheckbox, Flex, Message } from '@axonivy/ui-components';
import { isSameColumn, useDataTableColumns } from './useDataTableColumns';
import { modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../../../data/data';

export type CheckboxColumn = DataTableColumnConfig & { selected: boolean };

export const ColumnsCheckboxField = () => {
  const { setData, element } = useData();
  const { boundColumns, boundSelectColumns, unboundSelectColumns, setUnboundSelectColumns, setActiveColumnsHistory } =
    useDataTableColumns();

  const handleCheckboxChange = (change: boolean, column: CheckboxColumn) => {
    if (change) {
      const newColumn: DataTableColumnConfig = { ...column };
      setActiveColumnsHistory(prevArray => [...prevArray, newColumn]);
      setUnboundSelectColumns(unboundSelectColumns.map(col => (isSameColumn(col, column) ? { ...col, selected: true } : col)));
      setData(
        oldData =>
          modifyData(oldData, {
            type: 'add',
            data: {
              componentName: 'DataTableColumn',
              targetId: TABLE_DROPZONE_ID_PREFIX + element?.cid,
              create: { value: newColumn.value, label: newColumn.header, defaultProps: { ...newColumn } }
            }
          }).newData
      );
    } else {
      setUnboundSelectColumns(unboundSelectColumns.map(col => (isSameColumn(col, column) ? { ...col, selected: false } : col)));
      const columnId = isTable(element) ? element?.config.components.find(c => isSameColumn(c.config, column))?.cid : undefined;
      if (columnId) {
        setData(oldData => modifyData(oldData, { type: 'remove', data: { id: columnId } }).newData);
      }
    }
  };

  return (
    <Flex direction='column' gap={1}>
      {boundColumns.length === 0 ? (
        <Message variant='warning' message='Defined Object is not valid' />
      ) : (
        boundSelectColumns.map(column => (
          <BasicCheckbox
            key={column.value}
            label={column.header}
            checked={column.selected}
            onCheckedChange={change => handleCheckboxChange(change as boolean, column)}
          />
        ))
      )}
      {unboundSelectColumns.map(column => {
        const isStartingWithBound = boundSelectColumns.some(boundCol => column.value.startsWith(`${boundCol.value}.`));
        return (
          <BasicCheckbox
            key={column.value}
            label={column.header + (isStartingWithBound ? '' : ' (unbound)')}
            checked={column.selected}
            onCheckedChange={change => handleCheckboxChange(change as boolean, column)}
          />
        );
      })}
    </Flex>
  );
};
