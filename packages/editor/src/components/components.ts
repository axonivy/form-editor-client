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

const config: Config = {
  components: {
    Input: InputComponent,
    Text: TextComponent,
    Link: LinkComponent,
    Layout: LayoutComponent,
    Button: ButtonComponent,
    Checkbox: CheckboxComponent,
    Select: SelectComponent
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
  return groupBy(Object.values(config.components), item => item.category);
};

export const componentForType = (type: AutoCompleteWithString<ComponentType>) => {
  switch (type) {
    case 'String':
      return { component: config.components.Input };
    case 'Number':
      return { component: config.components.Input, defaultProps: { type: 'NUMBER' } };
    case 'Boolean':
      return { component: config.components.Checkbox };
    default:
      return undefined;
  }
};
