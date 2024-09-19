import './DataTableColumn.css';
import type { DataTableColumnConfig, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import { baseComponentFields } from '../base';
import { Flex, IvyIcon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

type DataTableColumnProps = Prettify<DataTableColumnConfig>;

export const defaultDataTableColumnProps: DataTableColumnConfig = {
  header: 'header',
  value: 'value',
  sortable: false,
  filterable: false
} as const;

export const DataTableColumnComponent: ComponentConfig<DataTableColumnProps> = {
  name: 'DataTableColumn',
  category: 'Hidden',
  subcategory: 'Input',
  icon: '',
  description: 'A Column for the DataTable',
  defaultProps: defaultDataTableColumnProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value }) => ({ ...defaultDataTableColumnProps, header: label, value }),
  outlineInfo: component => component.header,
  fields: {
    header: { subsection: 'General', label: 'Header', type: 'text' },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', browsers: ['ATTRIBUTE'], options: { onlyAttributes: 'COLUMN' } },
    sortable: { subsection: 'General', label: 'Enable Sorting', type: 'checkbox' },
    filterable: { subsection: 'General', label: 'Enable Filtering', type: 'checkbox' },
    ...baseComponentFields
  },
  quickActions: ['DELETE', 'DUPLICATE']
};

const UiBlock = ({ header, value, sortable, filterable }: UiComponentProps<DataTableColumnProps>) => (
  <Table className='placeholder-table'>
    <TableHeader>
      <TableRow>
        <TableHead style={{ fontWeight: 'bold' }}>
          <Flex justifyContent='space-between' direction='column' gap={2}>
            <Flex direction='row' alignItems='center' gap={2}>
              {header}
              {sortable && <IvyIcon icon={IvyIcons.Selector} />}
            </Flex>
            {filterable ? (
              <span className='block-search__input'>Filter By {header}</span>
            ) : (
              <span className='block-search__placeholder'>placeholder</span>
            )}
          </Flex>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>{value.length === 0 ? 'Use entire Object' : value}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
