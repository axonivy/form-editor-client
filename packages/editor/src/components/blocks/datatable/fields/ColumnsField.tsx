import { type DataTableColumn } from '@axonivy/form-editor-protocol';
import { Flex, Message } from '@axonivy/ui-components';
import { useDataTableColumns } from './useDataTableColumns';
import { ListItemWithActions } from './ListItemWithActions';

export type ColumnItem = DataTableColumn & { columnCid: string };

export const ColumnsField = () => {
  const { boundColumns, activeColumns } = useDataTableColumns();

  return (
    <Flex direction='column' gap={1}>
      {boundColumns.length === 0 && <Message variant='warning' message='Defined Object is not valid' />}
      {activeColumns.map((column, index) => (
        <ListItemWithActions
          key={column.columnCid}
          componentCid={column.columnCid}
          label={column.header}
          index={index}
          allItemsCount={activeColumns.length}
          isBound={boundColumns.some(active => active.value === column.value)}
        />
      ))}
    </Flex>
  );
};
