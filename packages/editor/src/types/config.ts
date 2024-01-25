import type { ComponentType, PrimitiveValue } from '@axonivy/form-editor-protocol';

export type UiComponentProps<Props extends DefaultComponentProps = DefaultComponentProps> = Props & { id: string };

export type DefaultComponentProps = { [key: string]: PrimitiveValue | unknown[] };

type UiComponent<Props extends DefaultComponentProps = DefaultComponentProps> = (props: UiComponentProps<Props>) => JSX.Element;

export type FieldOptionValues<TOptions extends Readonly<FieldOption[]>> = TOptions[number]['value'];

export type FieldOption<TValue = PrimitiveValue> = {
  label: string;
  value: TValue;
};

export type BaseField = {
  label?: string;
};
export type TextField = BaseField & {
  type: 'text' | 'number' | 'textarea' | 'checkbox';
};
export type SelectField = BaseField & {
  type: 'select' | 'radio';
  options: readonly FieldOption[];
};
export type HiddenField = {
  type: 'hidden';
};

export type Field = TextField | SelectField | HiddenField;

type Fields<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  [PropName in keyof Omit<Required<ComponentProps>, 'children'>]: Field;
};

export type ComponentConfig<ComponentProps extends DefaultComponentProps = DefaultComponentProps, DefaultProps = ComponentProps> = {
  name: ComponentType;
  category: 'Basic' | 'Layout' | 'Action';
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
