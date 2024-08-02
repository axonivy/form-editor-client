import type { Config, itemCategory } from '../types/config';
import { groupBy } from '../utils/array';
import { ButtonComponent } from './blocks/button/Button';
import { LayoutComponent } from './blocks/layout/Layout';
import { InputComponent } from './blocks/input/Input';
import { LinkComponent } from './blocks/link/Link';
import { TextComponent } from './blocks/text/Text';

export const config: Config = {
  components: {
    Input: InputComponent,
    Text: TextComponent,
    Link: LinkComponent,
    Layout: LayoutComponent,
    Button: ButtonComponent
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
