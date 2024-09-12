import type { DataTableColumnConfig, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import { baseComponentFields } from '../base';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@axonivy/ui-components';

type DataTableColumnProps = Prettify<DataTableColumnConfig>;

export const defaultDataTableColumnProps: DataTableColumnConfig = {
  header: 'header',
  value: 'value'
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
    ...baseComponentFields
  },
  quickActions: ['DELETE', 'DUPLICATE']
};

const UiBlock = ({ header, value }: UiComponentProps<DataTableColumnProps>) => (
  <Table className='placeholder-table'>
    <TableHeader>
      <TableRow>
        <TableHead style={{ fontWeight: 'bold' }}>{header}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>{value.length === 0 ? 'Use entire Object' : value}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
