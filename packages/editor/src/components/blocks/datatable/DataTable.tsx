import type { DataTable, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './DataTable.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './DataTable.svg?react';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { useAppContext } from '../../../context/AppContext';
import { Button, Message } from '@axonivy/ui-components';
import { useMeta } from '../../../context/useMeta';
import { findAttributesOfType } from '../../../data/variable-tree-data';
import { componentByName } from '../../components';
import { createInitiTableColumns } from '../../../data/data';
import { IvyIcons } from '@axonivy/ui-icons';

type DataTableProps = Prettify<DataTable>;

export const defaultDataTableProps: DataTable = {
  components: [],
  label: 'Label',
  value: '',
  ...defaultBaseComponent
} as const;

export const DataTableComponent: ComponentConfig<DataTableProps> = {
  name: 'DataTable',
  category: 'Elements',
  subcategory: 'Input',
  icon: <IconSvg />,
  description: 'A datatable component',
  defaultProps: defaultDataTableProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultDataTableProps, label, value, ...defaultProps }),
  outlineInfo: component => component.label,
  fields: {
    components: { subsection: 'General', type: 'hidden' },
    label: { subsection: 'General', label: 'Label', type: 'text' },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', options: { onlyTypesOf: 'List<' } },
    ...baseComponentFields
  }
};

const UiBlock = ({ id, label, components, value }: UiComponentProps<DataTableProps>) => (
  <div className='block-table'>
    <div className='block-table__label'>
      <span>{label}</span>
      <span style={{ color: 'var(--N600)' }}>{value.length > 0 ? value : 'value is empty'}</span>
    </div>
    {components.length > 0 && (
      <div className='block-table__columns'>
        {components.map((column, index) => (
          <ComponentBlock key={column.id} component={column} preId={components[index - 1]?.id} />
        ))}
      </div>
    )}
    {components.length === 0 && <EmptyDataTableColumn id={id} initValue={value} />}
  </div>
);

const EmptyDataTableColumn = ({ id, initValue }: { id: string; initValue: string }) => {
  const { context, setData } = useAppContext();
  const dataClass = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;

  if (initValue.length === 0) {
    return <Message variant='warning' message='Value of DataTable is empty. Define value within Properties of DataTable' />;
  }

  const createColumns = () => {
    const tree = findAttributesOfType(dataClass, initValue);
    setData(data => {
      const creates = tree[0].children
        .map(attribute => {
          const component = componentByName('DataTableColumn');
          if (component === undefined) {
            return undefined;
          }
          return {
            componentName: component.name,
            label: attribute.value,
            value: attribute.value
          };
        })
        .filter(create => create !== undefined);
      return createInitiTableColumns(id, data, creates);
    });
  };

  return (
    <Button icon={IvyIcons.DatabaseLink} variant='outline' onClick={createColumns}>
      Create columns from value
    </Button>
  );
};
