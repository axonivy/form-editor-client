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

export type CreateData = { label: string; value: string; defaultProps?: Record<string, unknown> };
export type CreateComponentData = { componentName: string } & CreateData;

export const isCreateComponentData = (data: unknown): data is CreateComponentData =>
  typeof data === 'object' && data !== null && 'componentName' in data;

type Subsection = 'General' | 'Styling' | 'Behaviour' | 'Static Options' | 'Dynamic Options';

export type BaseField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  subsection: Subsection;
  label?: string;
  hide?: (component: ComponentProps) => boolean;
  section?: 'Layout';
};

export type TextFieldOptions = {
  placeholder?: string;
};

export type TextBrowserFieldOptions = TextFieldOptions & {
  displayOnlyListTypes?: boolean;
};

export type TextField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'text' | 'number' | 'textarea' | 'checkbox';
  options?: TextFieldOptions;
};

export type TextBrowserField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'textBrowser';
  options?: TextBrowserFieldOptions;
};

export type TableField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'selectTable';
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
  | TextBrowserField<ComponentProps>
  | SelectField<ComponentProps>
  | TableField<ComponentProps>
  | HiddenField;

export type Fields<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  [PropName in keyof Omit<Required<ComponentProps>, 'children'>]: Field<ComponentProps>;
};

export type ItemCategory = 'Elements' | 'Structure' | 'Action';
export type ItemSubcategory = 'General' | 'Input' | 'Interactions' | 'Text';

export type ComponentConfig<ComponentProps extends DefaultComponentProps = DefaultComponentProps, DefaultProps = ComponentProps> = {
  name: ComponentType;
  category: ItemCategory;
  subcategory: ItemSubcategory;
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
