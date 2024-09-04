import type { DataTableColumn, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import { baseComponentFields, defaultBaseComponent } from '../base';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@axonivy/ui-components';

type DataTableColumnProps = Prettify<DataTableColumn>;

export const defaultDataTableColumnProps: DataTableColumn = {
  header: 'header',
  value: 'value',
  ...defaultBaseComponent
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
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', options: { onlyAttributes: 'COLUMN' } },
    ...baseComponentFields
  }
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
        <TableCell>{value}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
);
