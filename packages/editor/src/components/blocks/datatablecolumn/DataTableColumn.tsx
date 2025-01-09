import './DataTableColumn.css';
import type { DataTableColumnConfig, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import { baseComponentFields, defaultVisibleComponent, visibleComponentField } from '../base';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBlockHeaderVisiblePart } from '../../UiBlockHeader';

type DataTableColumnProps = Prettify<DataTableColumnConfig>;

export const defaultDataTableColumnProps: DataTableColumnConfig = {
  header: 'header',
  value: 'value',
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
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', browsers: ['ATTRIBUTE'], options: { onlyAttributes: 'COLUMN' } },
    sortable: { subsection: 'General', label: 'Enable Sorting', type: 'checkbox' },
    filterable: { subsection: 'General', label: 'Enable Filtering', type: 'checkbox' },
    ...visibleComponentField
  },
  quickActions: ['DELETE', 'DUPLICATE']
};

const UiBlock = ({ header, value, sortable, filterable, visible }: UiComponentProps<DataTableColumnProps>) => (
  <div className='block-column'>
    <div className='block-column__head'>
      <Flex justifyContent='space-between' direction='column' gap={2}>
        <Flex direction='row' alignItems='center' gap={2} justifyContent='space-between'>
          <Flex alignItems='center' gap={2}>
            {header}
            {sortable && <IvyIcon icon={IvyIcons.Selector} />}
          </Flex>
          <UiBlockHeaderVisiblePart visible={visible} />
        </Flex>
        <span className='block-column__filter' data-active={filterable}>
          Filter By {header}
        </span>
      </Flex>
    </div>
    <div className='block-column__body'>
      <span>{value.length === 0 ? 'Use entire Object' : value}</span>
    </div>
  </div>
);
