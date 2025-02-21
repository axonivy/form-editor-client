import './DataTableColumn.css';
import type { ActionColumnComponent, DataTableColumn, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import { baseComponentFields, defaultVisibleComponent, visibleComponentField } from '../base';
import { Flex, IvyIcon, PanelMessage } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBlockHeaderVisiblePart } from '../../UiBlockHeader';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { COLUMN_DROPZONE_ID_PREFIX } from '../../../data/data';
import { DropZone } from '../../../editor/canvas/DropZone';
import { ActionButtonsField } from './ActionButtonsField';
import { ContentControls } from './controls/ContentControls';

type DataTableColumnProps = Prettify<DataTableColumn>;

export const defaultDataTableColumnProps: DataTableColumn = {
  header: 'header',
  value: 'value',
  components: [],
  asActionColumn: false,
  actionColumnAsMenu: true,
  sortable: false,
  filterable: false,
  ...defaultVisibleComponent
} as const;

export const DataTableColumnComponent: ComponentConfig<DataTableColumnProps> = {
  name: 'DataTableColumn',
  category: 'Hidden',
  subcategory: 'Input',
  icon: '',
  description: 'A Column for the DataTable',
  defaultProps: defaultDataTableColumnProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, defaultProps }) => ({ ...defaultDataTableColumnProps, header: label, value, ...defaultProps }),
  outlineInfo: component => component.header,
  fields: {
    ...baseComponentFields,
    header: { subsection: 'General', label: 'Header', type: 'textBrowser', browsers: ['CMS'] },
    actionColumnAsMenu: { subsection: 'Content', label: 'Actions as Menu', type: 'checkbox', hide: data => !data.asActionColumn },
    asActionColumn: { subsection: 'General', label: 'Column as Action Column', type: 'checkbox' },
    components: {
      subsection: 'Content',
      label: 'Actions',
      type: 'generic',
      render: () => <ActionButtonsField />,
      hide: data => !data.asActionColumn
    },
    value: {
      subsection: 'Content',
      label: 'Value',
      type: 'textBrowser',
      browsers: ['ATTRIBUTE'],
      options: { onlyAttributes: 'COLUMN' },
      hide: data => data.asActionColumn
    },
    sortable: { subsection: 'General', label: 'Enable Sorting', type: 'checkbox', hide: data => data.asActionColumn },
    filterable: { subsection: 'General', label: 'Enable Filtering', type: 'checkbox', hide: data => data.asActionColumn },

    ...visibleComponentField
  },
  quickActions: ['DELETE', 'DUPLICATE', 'CREATEACTIONCOLUMNBUTTON'],
  subSectionControls: (props, subSection) => (subSection === 'Content' ? <ContentControls {...props} /> : null)
};

const UiBlock = ({
  id,
  header,
  value,
  sortable,
  filterable,
  visible,
  components,
  asActionColumn
}: UiComponentProps<DataTableColumnProps>) => (
  <div className='block-column'>
    <div className='block-column__head'>
      <Flex justifyContent='space-between' direction='column' gap={2}>
        <Flex direction='row' alignItems='center' gap={2} justifyContent='space-between'>
          <Flex alignItems='center' gap={2}>
            {header}
            {sortable && !asActionColumn && <IvyIcon icon={IvyIcons.Selector} />}
          </Flex>
          <UiBlockHeaderVisiblePart visible={visible} />
        </Flex>
        <span className='block-column__filter' data-active={filterable && !asActionColumn}>
          Filter By {header}
        </span>
      </Flex>
    </div>
    <div className='block-column__body'>
      {asActionColumn ? (
        components.length > 0 ? (
          <Flex direction='column' gap={1} className='block-table__columns'>
            {components.map((button, index) => {
              const actionButton: ActionColumnComponent = { ...button };
              return (
                <ComponentBlock
                  key={`${COLUMN_DROPZONE_ID_PREFIX}${actionButton.cid}`}
                  component={{ ...actionButton, cid: `${actionButton.cid}` }}
                  preId={components[index - 1]?.cid}
                />
              );
            })}
          </Flex>
        ) : (
          <EmptyActionColumnBlock components={components} id={id} type='Action Column' />
        )
      ) : (
        <span>{value?.length === 0 ? 'Use entire Object' : value}</span>
      )}
    </div>
  </div>
);

export const EmptyActionColumnBlock = ({
  id,
  components,
  type
}: {
  id: string;
  components: Array<ActionColumnComponent>;
  type: string;
}) => (
  <DropZone id={`${COLUMN_DROPZONE_ID_PREFIX}${id}`} preId={components[components.length - 1]?.cid}>
    {components.length === 0 ? (
      <PanelMessage message={`Drag first button inside the ${type}`} mode='row' className='drag-hint row' />
    ) : (
      <div className='empty-block for-layout' />
    )}
  </DropZone>
);
