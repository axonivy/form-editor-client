import type { Config, ItemCategory } from '../types/config';
import { groupBy } from '../utils/array';
import { ButtonComponent } from './blocks/button/Button';
import { LayoutComponent } from './blocks/layout/Layout';
import { InputComponent } from './blocks/input/Input';
import { LinkComponent } from './blocks/link/Link';
import { TextComponent } from './blocks/text/Text';
import { CheckboxComponent } from './blocks/checkbox/Checkbox';
import { SelectComponent } from './blocks/select/Select';
import type { ComponentType } from '@axonivy/form-editor-protocol';
import type { AutoCompleteWithString } from '../types/types';
import { ComboboxComponent } from './blocks/combobox/Combobox';
import { RadioComponent } from './blocks/radio/Radio';
import { DatePickerComponent } from './blocks/datepicker/DatePicker';
import { TextareaComponent } from './blocks/textarea/Textarea';
import { DataTableComponent } from './blocks/datatable/DataTable';
import { DataTableColumnComponent } from './blocks/datatablecolumn/DataTableColumn';

const config: Config = {
  components: {
    Input: InputComponent,
    Textarea: TextareaComponent,
    DatePicker: DatePickerComponent,
    Combobox: ComboboxComponent,
    Checkbox: CheckboxComponent,
    Radio: RadioComponent,
    Select: SelectComponent,
    Text: TextComponent,
    Button: ButtonComponent,
    Link: LinkComponent,
    Layout: LayoutComponent,
    DataTable: DataTableComponent,
    DataTableColumn: DataTableColumnComponent
  }
} as const;

export const componentByName = (name: AutoCompleteWithString<ComponentType>) => {
  return config.components[name];
};

export const componentsByCategory = (category: ItemCategory) => {
  const filteredComponents = Object.values(config.components).filter(component => component.category === category);
  return groupBy(Object.values(filteredComponents), item => item.subcategory);
};

export const allComponentsByCategory = () => {
  return groupBy(
    Object.values(config.components).filter(component => component.category !== 'Hidden'),
    item => item.category
  );
};

export const componentForType = (type: AutoCompleteWithString<ComponentType>) => {
  switch (type) {
    case 'String':
      return { component: config.components.Input };
    case 'Number':
      return { component: config.components.Input, defaultProps: { type: 'NUMBER' } };
    case 'Boolean':
      return { component: config.components.Checkbox };
    case 'Date':
      return { component: config.components.DatePicker };
    case 'DateTime':
      return { component: config.components.DatePicker };
    case 'java.util.Date':
      return { component: config.components.DatePicker };
    default:
      return undefined;
  }
};
