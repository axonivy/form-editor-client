import type { DataTable, Prettify, TableComponent } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './DataTable.css';
import { baseComponentFields, defaultBaseComponent, defaultVisibleComponent, visibleComponentField } from '../base';
import IconSvg from './DataTable.svg?react';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { useAppContext } from '../../../context/AppContext';
import { Button, cn, Flex, Message } from '@axonivy/ui-components';
import { useMeta } from '../../../context/useMeta';
import { componentByName } from '../../components';
import { createInitTableColumns, findComponentDeep, modifyData } from '../../../data/data';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBlockHeader } from '../../UiBlockHeader';
import { findAttributesOfType } from '../../../editor/browser/data-class/variable-tree-data';
import { ColumnControl } from './controls/ColumnControl';
import { ColumnsField } from './fields/ColumnsField';
import { renderEditableDataTableField } from './fields/EditableDataTableField';
import { renderListOfObjectsField } from './fields/ListOfObjectsField';

type DataTableProps = Prettify<DataTable>;

export const defaultDataTableProps: DataTable = {
  components: [],
  value: '',
  rowType: '',
  isEditable: false,
  addButton: false,
  editDialogId: '',
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
      type: 'generic',
      render: renderListOfObjectsField
    },
    rowType: { subsection: 'General', label: 'Row Type', type: 'hidden' },
    isEditable: { subsection: 'General', label: 'Editable', type: 'generic', render: renderEditableDataTableField },
    addButton: { subsection: 'General', label: 'Add Button', type: 'checkbox', hide: data => !data.isEditable },
    editDialogId: { subsection: 'General', label: 'Edit Dialog', type: 'hidden' },
    components: { subsection: 'Columns', label: 'Object-Bound Columns', type: 'generic', render: () => <ColumnsField /> },
    paginator: { subsection: 'Paginator', label: 'Enable Paginator', type: 'checkbox' },
    maxRows: { subsection: 'Paginator', label: 'Rows per Page', type: 'number', hide: data => !data.paginator },
    ...visibleComponentField
  },
  quickActions: ['DELETE', 'DUPLICATE', 'CREATECOLUMN', 'CREATEACTIONCOLUMN'],
  subSectionControls: (props, subSection) => (subSection === 'Columns' ? <ColumnControl {...props} /> : null),
  onDelete: (component, setData) => {
    if (component.editDialogId.length > 0) {
      setData(oldData => modifyData(oldData, { type: 'remove', data: { id: component.editDialogId } }).newData);
    }
  }
};

const UiBlock = ({ id, components, value, paginator, maxRows, visible, editDialogId }: UiComponentProps<DataTableProps>) => {
  const { data, setSelectedElement, selectedElement, ui } = useAppContext();
  const dialog = findComponentDeep(data.components, editDialogId);

  return (
    <Flex direction='column' gap={2} className='block-table'>
      <Flex direction='column' gap={4}>
        <UiBlockHeader visible={visible} additionalInfo={paginator ? `Rows per Page: ${maxRows}` : ''} />

        {components.length > 0 && (
          <Flex direction='row' gap={1} className='block-table__columns'>
            {components.map((column, index) => {
              const columnComponent: TableComponent = { ...column };
              return <ComponentBlock key={column.cid} component={columnComponent} preId={components[index - 1]?.cid} />;
            })}
          </Flex>
        )}
        {components.length === 0 && <EmptyDataTableColumn id={id} initValue={value} />}
      </Flex>
      {paginator && (
        <Flex direction='column' alignItems='center'>
          <Flex className='block-table__paginator' direction='row' alignItems='center' gap={2}>
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
      {dialog && ui.helpPaddings && (
        <div
          className={cn('draggable', 'block-table__dialog', selectedElement === editDialogId && 'selected')}
          style={{ boxShadow: 'var(--editor-shadow)' }}
          onClick={e => {
            e.stopPropagation();
            setSelectedElement(editDialogId);
          }}
        >
          {componentByName('Dialog').render({ ...dialog.data[dialog.index].config, id: editDialogId })}
        </div>
      )}
    </Flex>
  );
};

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
