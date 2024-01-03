/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputComponent } from './Input';
import { TextComponent } from './Text';
import { LinkComponent } from './Link';
import { FlexComponent } from './Flex';
import { groupBy } from '../utils/array';

export type UiComponentProps<Props> = Props & { id: string };

type DefaultComponentProps = {
  [key: string]: any;
  editMode?: boolean;
};

type UiComponent<Props extends DefaultComponentProps = DefaultComponentProps> = (props: UiComponentProps<Props>) => JSX.Element;

export type BaseField = {
  label?: string;
};
export type TextField = BaseField & {
  type: 'text' | 'number' | 'textarea' | 'checkbox';
};
export type SelectField = BaseField & {
  type: 'select' | 'radio';
  options: {
    label: string;
    value: string | number | boolean;
  }[];
};
export type ArrayField<
  Props extends {
    [key: string]: any;
  } = {
    [key: string]: any;
  }
> = BaseField & {
  type: 'array';
  arrayFields: {
    [SubPropName in keyof Props[0]]: Field<Props[0][SubPropName]>;
  };
  defaultItemProps?: Props[0];
  getItemSummary?: (item: Props[0], index?: number) => string;
};

export type Field<
  Props extends {
    [key: string]: any;
  } = {
    [key: string]: any;
  }
> = TextField | SelectField | ArrayField<Props>;

type Fields<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  [PropName in keyof Omit<Required<ComponentProps>, 'children' | 'editMode'>]: Field<ComponentProps[PropName]>;
};

export type ComponentConfig<ComponentProps extends DefaultComponentProps = DefaultComponentProps, DefaultProps = ComponentProps> = {
  name: string;
  category: 'Basic' | 'Layout';
  icon: string;
  description: string;
  render: UiComponent<ComponentProps>;
  defaultProps?: DefaultProps;
  fields?: Fields<ComponentProps>;
};

export type Config<
  Props extends {
    [key: string]: any;
  } = {
    [key: string]: any;
  }
> = {
  components: {
    [ComponentName in keyof Props]: Omit<ComponentConfig<Props[ComponentName], Props[ComponentName]>, 'type'>;
  };
};

export const config: Config = {
  components: {
    Input: InputComponent,
    Text: TextComponent,
    Link: LinkComponent,
    Flex: FlexComponent
  }
};

// export const components = [InputComponent, TextComponent, LinkComponent, FlexComponent];

export const componentsGroupByCategroy = () => {
  return groupBy(Object.values(config.components), item => item.category);
};

export const componentByName = (name: string) => {
  return config.components[name]; //components.find(component => component.name === name);
};
