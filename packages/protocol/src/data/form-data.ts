import type { KeysOfUnion } from '../utils/type-helper';
import type { Component, DataTableColumn, Fieldset, Form, FormContext, Layout } from './form';

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

export const isTable = (component?: Component | ComponentData): component is LayoutConfig => {
  return component !== undefined && component.type === 'DataTable' && 'components' in component.config;
};

const isLayout = (component?: Component | ComponentData): component is LayoutConfig => {
  return isStructure(component) && component.type === 'Layout';
};

export const isFreeLayout = (component?: Component | ComponentData): component is LayoutConfig => {
  return isLayout(component) && component.config.gridVariant === 'FREE';
};

export type FormEditorProps = { context: FormContext; directSave?: boolean };

export type FormEditorData = {
  context: FormContext;
  defaults: any;
  readonly: boolean;
  data: FormData;
};

export type FormSaveDataArgs = {
  context: FormContext;
  data: FormData;
  directSave?: boolean;
};

export interface FormActionArgs {
  actionId: 'openDataClass' | 'openProcess';
  payload: string;
  context: FormContext;
}
