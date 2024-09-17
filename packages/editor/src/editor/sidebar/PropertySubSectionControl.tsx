import { createId, createInitiTableColumns, useData } from '../../data/data';
import { Button, type CollapsibleControlProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDataTableColumns } from './fields/datatable-columns/useDataTableColumns';

const ColumnControlButton = (props: CollapsibleControlProps) => {
  const { element, setData } = useData();
  const { boundSelectColumns } = useDataTableColumns();
  const allDeselectedColumns = boundSelectColumns
    .filter(col => !col.selected)
    .map(column => ({
      config: {
        header: column.config.header,
        value: column.config.value
      },
      id: createId('DataTableColumn')
    }));

  const bindAllColumns = () => {
    if (element && element.id.startsWith('DataTable')) {
      setData(data => {
        const creates = allDeselectedColumns
          .map(column => {
            return {
              componentName: 'DataTableColumn',
              label: column.config.value.length > 0 ? column.config.value : column.config.header,
              value: column.config.value
            };
          })
          .filter(create => create !== undefined);
        return createInitiTableColumns(element.id, data, creates);
      });
    }
  };

  return allDeselectedColumns.length > 0 ? (
    <Button icon={IvyIcons.Connector} onClick={bindAllColumns} title='Set default Columns' {...props} />
  ) : null;
};

export const PropertySubSectionControl = ({ title, ...props }: CollapsibleControlProps & { title: string }) => {
  const { element } = useData();
  if (element === undefined) {
    return null;
  }
  if (!element.id.startsWith('DataTable') || (element.id.startsWith('DataTable') && title !== 'Columns')) {
    return null;
  }
  return <ColumnControlButton {...props} />;
};
