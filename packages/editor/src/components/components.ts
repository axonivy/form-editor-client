import type { Config, ItemCategory } from '../types/config';
import { groupBy } from '../utils/array';
import { ButtonComponent } from './blocks/button/Button';
import { LayoutComponent } from './blocks/layout/Layout';
import { InputComponent } from './blocks/input/Input';
import { LinkComponent } from './blocks/link/Link';
import { TextComponent } from './blocks/text/Text';
import { CheckboxComponent } from './blocks/checkbox/Checkbox';
import { SelectComponent } from './blocks/select/Select';
import { isTable, type ComponentData, type ComponentType } from '@axonivy/form-editor-protocol';
import type { AutoCompleteWithString } from '../types/types';
import { ComboboxComponent } from './blocks/combobox/Combobox';
import { RadioComponent } from './blocks/radio/Radio';
import { DatePickerComponent } from './blocks/datepicker/DatePicker';
import { TextareaComponent } from './blocks/textarea/Textarea';
import { DataTableComponent } from './blocks/datatable/DataTable';
import { DataTableColumnComponent } from './blocks/datatablecolumn/DataTableColumn';
import { FieldsetComponent } from './blocks/fieldset/Fieldset';
import { PanelComponent } from './blocks/panel/Panel';
import { getParentComponent } from '../data/data';
import { CompositeComponent } from './blocks/composite/Composite';
import { DialogComponent } from './blocks/dialog/Dialog';

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
    DataTableColumn: DataTableColumnComponent,
    Fieldset: FieldsetComponent,
    Panel: PanelComponent,
    Dialog: DialogComponent,
    Composite: CompositeComponent
  }
} as const;

export const componentByElement = (element: ComponentData, data: Array<ComponentData>) => {
  const component = componentByName(element.type);
  if (component === undefined && isTable(getParentComponent(data, element.cid))) {
    return componentByName('DataTableColumn');
  }
  return component;
};

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
  if (type.startsWith('List<') && type.endsWith('>')) {
    return { component: config.components.DataTable };
  }

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
