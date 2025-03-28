import type { Config, ItemCategory } from '../types/config';
import { groupBy } from '../utils/array';
import { useButtonComponent } from './blocks/button/Button';
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

export const useComponents = () => {
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
      Button: useButtonComponent().ButtonComponent,
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

  const componentByElement = (element: ComponentData, data: Array<ComponentData>) => {
    const component = componentByName(element.type);
    if (component === undefined && isTable(getParentComponent(data, element.cid))) {
      return componentByName('DataTableColumn');
    }
    return component;
  };

  const componentByName = (name: AutoCompleteWithString<ComponentType>) => {
    return config.components[name];
  };

  const componentsByCategory = (category: ItemCategory) => {
    // Provisional: Filter out undefined components before checking category
    const filteredComponents = Object.values(config.components)
      .filter(component => component !== undefined)
      .filter(component => component.category === category);

    return groupBy(Object.values(filteredComponents), item => item.subcategory);
  };

  const allComponentsByCategory = () => {
    // Provisional: Filter out undefined components before checking category
    return groupBy(
      Object.values(config.components)
        .filter(component => component !== undefined)
        .filter(component => component.category !== 'Hidden'),
      item => item.category
    );
  };

  const componentForType = (type: AutoCompleteWithString<ComponentType>) => {
    if (type.startsWith('List<') && type.endsWith('>')) {
      return { component: config.components.DataTable };
    }

    switch (type) {
      case 'String':
        return { component: config.components.Input };
      case 'Number':
      case 'Byte':
      case 'Short':
      case 'Integer':
      case 'Long':
      case 'Float':
      case 'Double':
      case 'BigDecimal':
        return { component: config.components.Input, defaultProps: { type: 'NUMBER' } };
      case 'Boolean':
        return { component: config.components.Checkbox };
      case 'Date':
      case 'DateTime':
      case 'java.util.Date':
        return { component: config.components.DatePicker };
      default:
        return undefined;
    }
  };

  return {
    componentByElement,
    componentByName,
    componentsByCategory,
    allComponentsByCategory,
    componentForType
  };
};
