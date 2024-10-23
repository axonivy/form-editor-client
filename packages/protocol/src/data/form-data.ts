import type { KeysOfUnion } from '../utils/type-helper';
import type { Component, DataTable, DataTableColumn, Fieldset, Form, FormContext, FormEditorData, FormSaveDataArgs, Layout } from './form';

export type ComponentType = Component['type'] | 'DataTableColumn';

export type ComponentConfigKeys = KeysOfUnion<Component['config']>;

export type PrimitiveValue = string | boolean | number | any[] | Record<string, string>;

export type ConfigData = Record<string, PrimitiveValue | Array<ComponentData>>;

export interface DataTableColumnComponent extends DataTableColumn {
  type: 'DataTableColumn';
}

export type ComponentData =
  | (Omit<Component, 'config'> & {
      config: ConfigData;
    })
  | DataTableColumnComponent;

export type TableConfig = ComponentData & { config: Omit<DataTable, 'components'> & { components: Array<DataTableColumnComponent> } };

export type LayoutConfig = ComponentData & { config: Omit<Layout, 'components'> & { components: Array<ComponentData> } };

export type FieldsetConfig = ComponentData & { config: Omit<Fieldset, 'components'> & { components: Array<ComponentData> } };

export type FormData = Omit<Form, 'components' | '$schema'> & {
  components: Array<ComponentData>;
};

export const isStructure = (component?: Component | ComponentData): component is LayoutConfig | FieldsetConfig => {
  return (
    component !== undefined &&
    (component.type === 'Layout' || component.type === 'Fieldset' || component.type == 'Panel') &&
    'components' in component.config
  );
};

export const isTable = (component?: Component | ComponentData): component is TableConfig => {
  return component !== undefined && component.type === 'DataTable' && 'components' in component.config;
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
