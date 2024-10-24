import { Button, type CollapsibleControlProps } from '@axonivy/ui-components';
import { createInitTableColumns, useData } from '../../../../data/data';
import { useDataTableColumns } from '../fields/useDataTableColumns';
import { IvyIcons } from '@axonivy/ui-icons';
import type { CreateComponentData } from '../../../../types/config';
import { isTable } from '@axonivy/form-editor-protocol';

export const ColumnControl = (props: CollapsibleControlProps) => {
  const { element, setData } = useData();
  const { boundSelectColumns } = useDataTableColumns();
  const allDeselectedColumns = boundSelectColumns.filter(col => !col.selected);

  if (allDeselectedColumns.length === 0) {
    return null;
  }

  const bindAllColumns = () => {
    if (isTable(element)) {
      setData(data => {
        const creates = allDeselectedColumns
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

  return <Button icon={IvyIcons.Connector} onClick={bindAllColumns} title='Set default Columns' {...props} />;
};
