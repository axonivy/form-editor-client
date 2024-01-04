export type PrimitiveValue = string | boolean | number;

export type UiComponentProps<Props extends DefaultComponentProps = DefaultComponentProps> = Props & { id: string };

export type DefaultComponentProps = { [key: string]: PrimitiveValue };

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

export type Field = TextField | SelectField;

type Fields<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  [PropName in keyof Omit<Required<ComponentProps>, 'children'>]: Field;
};

export type ComponentConfig<ComponentProps extends DefaultComponentProps = DefaultComponentProps, DefaultProps = ComponentProps> = {
  name: string;
  category: 'Basic' | 'Layout';
  icon: string;
  description: string;
  render: UiComponent<ComponentProps>;
  defaultProps: DefaultProps;
  fields: Fields<ComponentProps>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Config<Props extends { [key: string]: any } = { [key: string]: any }> = {
  components: {
    [ComponentName in keyof Props]: Omit<ComponentConfig<Props[ComponentName], Props[ComponentName]>, 'type'>;
  };
};
