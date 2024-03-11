import type { ComponentType, PrimitiveValue } from '@axonivy/form-editor-protocol';

export type UiComponentProps<Props extends DefaultComponentProps = DefaultComponentProps> = Props & { id: string };

export type DefaultComponentProps = { [key: string]: PrimitiveValue | unknown[] };

type UiComponent<Props extends DefaultComponentProps = DefaultComponentProps> = (props: UiComponentProps<Props>) => JSX.Element;

export type FieldOptionValues<TOptions extends Readonly<FieldOption[]>> = TOptions[number]['value'];

export type FieldOption<TValue = PrimitiveValue> = {
  label: string;
  value: TValue;
};

export type BaseField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  label?: string;
  hide?: (component: ComponentProps) => boolean;
  section?: 'Layout';
};
export type TextField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'text' | 'number' | 'textarea' | 'checkbox';
};
export type SelectField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'select' | 'radio';
  options: readonly FieldOption[];
};
export type HiddenField = BaseField & {
  type: 'hidden';
};

export type Field<ComponentProps extends DefaultComponentProps = DefaultComponentProps> =
  | TextField<ComponentProps>
  | SelectField<ComponentProps>
  | HiddenField;

export const isNotHiddenField = (field: Field): field is Exclude<Field, HiddenField> => {
  return field.type !== 'hidden';
};

export type Fields<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  [PropName in keyof Omit<Required<ComponentProps>, 'children'>]: Field<ComponentProps>;
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
