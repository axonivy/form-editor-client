import { Button, Flex, type CollapsibleControlProps } from '@axonivy/ui-components';
import { createInitTableColumns, useData } from '../../../../data/data';
import { useDataTableColumns } from '../fields/useDataTableColumns';
import { IvyIcons } from '@axonivy/ui-icons';
import type { CreateComponentData } from '../../../../types/config';
import { isTable } from '@axonivy/form-editor-protocol';

export const ColumnControl = (props: CollapsibleControlProps) => {
  const { element, setData } = useData();
  const { boundInactiveColumns } = useDataTableColumns();

  const bindAllColumns = () => {
    if (isTable(element)) {
      setData(data => {
        const creates = boundInactiveColumns
          .map<CreateComponentData>(column => ({
            componentName: 'DataTableColumn',
            label: column.value.length > 0 ? column.value : column.header,
            value: column.value
          }))
          .filter(create => create !== undefined);
        return createInitTableColumns(element.cid, data, creates);
      });
    }
  };

  return (
    <Flex gap={1}>
      <Button icon={IvyIcons.Plus} size={'small'} onClick={bindAllColumns} title='Set default Columns' {...props} />
    </Flex>
  );
};
