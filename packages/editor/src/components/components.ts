import type { Config, itemCategory } from '../types/config';
import { groupBy } from '../utils/array';
import { ButtonComponent } from './blocks/button/Button';
import { LayoutComponent } from './blocks/layout/Layout';
import { InputComponent } from './blocks/input/Input';
import { LinkComponent } from './blocks/link/Link';
import { TextComponent } from './blocks/text/Text';
import { CheckboxComponent } from './blocks/checkbox/Checkbox';
import { SelectComponent } from './blocks/select/Select';

export const config: Config = {
  components: {
    Input: InputComponent,
    Text: TextComponent,
    Link: LinkComponent,
    Layout: LayoutComponent,
    Button: ButtonComponent,
    Checkbox: CheckboxComponent,
    Select: SelectComponent
  }
};

export const componentByName = (name: string) => {
  return config.components[name];
};

export const componentsByCategory = (category: itemCategory) => {
  const filteredComponents = Object.values(config.components).filter(component => component.category === category);
  return groupBy(Object.values(filteredComponents), item => item.subcategory);
};

export const allComponentsByCategory = () => {
  return groupBy(Object.values(config.components), item => item.category);
};

export const componentForType = (type: 'String' | 'Number' | 'Boolean' | 'Date' | 'DateTime' | 'Time' | 'File' | string) => {
  switch (type) {
    case 'String':
      return { component: config.components.Input };
    case 'Number':
      return { component: config.components.Input, defaultProps: { type: 'NUMBER' } };
    case 'Boolean':
      return { component: config.components.Checkbox };
    case 'Date':
    case 'DateTime':
    case 'Time':
    case 'File':
    default:
      return undefined;
  }
};
