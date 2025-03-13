import type { KeysOfUnion } from '../utils/type-helper';
import type {
  ActionColumnComponent,
  Component,
  DataTable,
  DataTableColumn,
  Fieldset,
  Form,
  FormContext,
  FormEditorData,
  FormSaveDataArgs,
  Layout,
  TableComponent
} from './form';

export type ComponentType = Component['type'] | 'DataTableColumn';

export type ComponentConfigKeys = KeysOfUnion<Component['config']>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrimitiveValue = string | boolean | number | any[] | Record<string, string>;

export type ConfigData = Record<string, PrimitiveValue | Array<ComponentData>>;

export type ComponentData =
  | (Omit<Component, 'config'> & {
      config: ConfigData;
    })
  | TableComponent
  | ActionColumnComponent;

export type TableConfig = ComponentData & { config: Omit<DataTable, 'components'> & { components: Array<TableComponent> } };

export type ColumnConfig = ComponentData & { config: Omit<DataTableColumn, 'components'> & { components: Array<ActionColumnComponent> } };

export type LayoutConfig = ComponentData & { config: Omit<Layout, 'components'> & { components: Array<ComponentData> } };

export type FieldsetConfig = ComponentData & { config: Omit<Fieldset, 'components'> & { components: Array<ComponentData> } };

export type FormData = Omit<Form, 'components' | '$schema'> & {
  components: Array<ComponentData>;
};

export const isStructure = (component?: Component | ComponentData): component is LayoutConfig | FieldsetConfig => {
  return (
    component !== undefined &&
    (component.type === 'Layout' || component.type === 'Fieldset' || component.type == 'Panel' || component.type == 'Dialog') &&
    'components' in component.config
  );
};

export const isTable = (component?: Component | ComponentData): component is TableConfig => {
  return component !== undefined && component.type === 'DataTable' && 'components' in component.config;
};

export const isColumn = (component?: Component | ComponentData): component is ColumnConfig => {
  return component !== undefined && component.type === 'DataTableColumn' && 'components' in component.config;
};

const isLayout = (component?: Component | ComponentData): component is LayoutConfig => {
  return isStructure(component) && component.type === 'Layout';
};

export const isFreeLayout = (component?: Component | ComponentData): component is LayoutConfig => {
  return isLayout(component) && component.config.gridVariant === 'FREE';
};

export type FormEditorProps = { context: FormContext; directSave?: boolean };

export type FormEditor = Omit<FormEditorData, 'data'> & {
  data: FormData;
};

export type FormSaveData = Omit<FormSaveDataArgs, 'data'> & {
  data: FormData;
  directSave?: boolean;
};
