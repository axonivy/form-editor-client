import type { DataTable, DataTableColumnComponent, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './DataTable.css';
import { baseComponentFields, defaultBaseComponent, defaultVisibleComponent, visibleComponentField } from '../base';
import IconSvg from './DataTable.svg?react';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { useAppContext } from '../../../context/AppContext';
import { Button, Flex, Message } from '@axonivy/ui-components';
import { useMeta } from '../../../context/useMeta';
import { componentByName } from '../../components';
import { createInitTableColumns } from '../../../data/data';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBlockHeader } from '../../UiBlockHeader';
import { findAttributesOfType } from '../../../editor/browser/data-class/variable-tree-data';
import { ColumnControl } from './controls/ColumnControl';
import { ColumnsCheckboxField } from './fields/ColumnsCheckboxField';

type DataTableProps = Prettify<DataTable>;

export const defaultDataTableProps: DataTable = {
  components: [],
  value: '',
  paginator: false,
  maxRows: '10',
  ...defaultVisibleComponent,
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
  outlineInfo: component => component.value,
  fields: {
    ...baseComponentFields,
    value: {
      subsection: 'General',
      label: 'List of Objects',
      type: 'textBrowser',
      browsers: ['ATTRIBUTE'],
      options: { onlyTypesOf: 'List<' }
    },
    components: { subsection: 'Columns', label: 'Object-Bound Columns', type: 'generic', render: () => <ColumnsCheckboxField /> },
    paginator: { subsection: 'Paginator', label: 'Enable Paginator', type: 'checkbox' },
    maxRows: { subsection: 'Paginator', label: 'Rows per Page', type: 'number', hide: data => !data.paginator },
    ...visibleComponentField
  },
  quickActions: ['DELETE', 'DUPLICATE', 'CREATECOLUMN'],
  subSectionControls: (props, subSection) => (subSection === 'Columns' ? <ColumnControl {...props} /> : null)
};

const UiBlock = ({ id, components, value, paginator, maxRows, visible }: UiComponentProps<DataTableProps>) => (
  <>
    <div className='block-table'>
      <UiBlockHeader visible={visible} additionalInfo={paginator ? `Rows per Page: ${maxRows}` : ''} />

      {components.length > 0 && (
        <div className='block-table__columns'>
          {components.map((column, index) => {
            const columnComponent: DataTableColumnComponent = { ...column, type: 'DataTableColumn' };
            return <ComponentBlock key={column.cid} component={columnComponent} preId={components[index - 1]?.cid} />;
          })}
        </div>
      )}
      {components.length === 0 && <EmptyDataTableColumn id={id} initValue={value} />}
    </div>
    {paginator && (
      <Flex direction='column' alignItems='center'>
        <Flex className='block-paginator' direction='row' alignItems='center' gap={2}>
          <div className='arrow'>«</div>
          <div className='arrow'>‹</div>
          <div className='page-item-active'>1</div>
          <div className='page-item'>2</div>
          <div className='page-item'>3</div>
          <div className='arrow'>›</div>
          <div className='arrow'>»</div>
        </Flex>
      </Flex>
    )}
  </>
);

const EmptyDataTableColumn = ({ id, initValue }: { id: string; initValue: string }) => {
  const { context, setData } = useAppContext();
  const dataClass = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;

  if (initValue.length === 0) {
    return <Message variant='warning' message='Value of DataTable is empty. Define value within Properties of DataTable' />;
  }

  const createColumns = () => {
    const tree = findAttributesOfType(dataClass, initValue);
    const isLeafNode = tree[0].children.length === 0;
    const mappableBrowserNode = isLeafNode ? tree : tree[0].children;
    setData(data => {
      const creates = mappableBrowserNode
        .map(attribute => {
          const component = componentByName('DataTableColumn');
          if (component === undefined) {
            return undefined;
          }
          return {
            componentName: component.name,
            label: isLeafNode && attribute.data ? attribute.data.attribute : attribute.value,
            value: isLeafNode ? '' : attribute.value
          };
        })
        .filter(create => create !== undefined);
      return createInitTableColumns(id, data, creates);
    });
  };

  return (
    <Button icon={IvyIcons.DatabaseLink} variant='outline' onClick={createColumns}>
      Create columns from value
    </Button>
  );
};
