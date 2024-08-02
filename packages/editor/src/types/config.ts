import type { ComponentType, PrimitiveValue } from '@axonivy/form-editor-protocol';
import type { ReactNode } from 'react';

export type UiComponentProps<Props extends DefaultComponentProps = DefaultComponentProps> = Props & { id: string };

export type DefaultComponentProps = { [key: string]: PrimitiveValue | unknown[] };

type UiComponent<Props extends DefaultComponentProps = DefaultComponentProps> = (props: UiComponentProps<Props>) => JSX.Element;

export type FieldOptionValues<TOptions extends Readonly<FieldOption[]>> = TOptions[number]['value'];

export type FieldOption<TValue = PrimitiveValue> = {
  label: string;
  value: TValue;
};

export type CreateData = { componentName: string; label: string; value: string; defaultProps?: Record<string, unknown> };

export const isCreateData = (data: unknown): data is CreateData => typeof data === 'object' && data !== null && 'componentName' in data;

type Subsection = 'General' | 'Styling' | 'Behaviour';

export type BaseField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  subsection: Subsection;
  label?: string;
  hide?: (component: ComponentProps) => boolean;
  section?: 'Layout';
};
export type TextField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'text' | 'number' | 'textarea' | 'checkbox' | 'textBrowser';
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

export type itemCategory = 'Elements' | 'Structure' | 'Action';
export type itemSubcategory = 'General' | 'Input' | 'Interactions' | 'Text';

export type ComponentConfig<ComponentProps extends DefaultComponentProps = DefaultComponentProps, DefaultProps = ComponentProps> = {
  name: ComponentType;
  category: itemCategory;
  subcategory: itemSubcategory;
  icon: ReactNode;
  description: string;
  render: UiComponent<ComponentProps>;
  create: (data: CreateData) => DefaultProps;
  defaultProps: DefaultProps;
  fields: Fields<ComponentProps>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Config<Props extends { [key: string]: any } = { [key: string]: any }> = {
  components: {
    [ComponentName in keyof Props]: Omit<ComponentConfig<Props[ComponentName], Props[ComponentName]>, 'type'>;
  };
};
