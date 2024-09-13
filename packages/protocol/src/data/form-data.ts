import type { KeysOfUnion } from '../utils/type-helper';
import type { Component, DataTableColumn, Fieldset, Form, Layout } from './form';

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
  return component !== undefined && (component.type === 'Layout' || component.type === 'Fieldset') && 'components' in component.config;
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

export type FormContext = { app: string; pmv: string; file: string };

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

export interface VariableInfo {
  types: Record<string, Variable[]>;
  variables: Variable[];
}

export interface Variable {
  attribute: string;
  description: string;
  simpleType: string;
  type: string;
}

export interface LogicInfo {
  startMethods: LogicMethodInfo[];
  eventStarts: LogicEventInfo[];
}

export interface LogicMethodInfo {
  name: string;
  description: string;
  parameters: Parameter[];
  returnParameter: Parameter;
}

export interface LogicEventInfo {
  name: string;
  description: string;
}

export interface Parameter {
  name: string;
  type: string;
}

export interface CompositeInfo {
  id: string;
  startMethods: Array<MethodInfo>;
}

export interface MethodInfo {
  name: string;
  parameters: Array<ParameterInfo>;
  deprecated: boolean;
}

export interface ParameterInfo {
  name: string;
  type: string;
  description: string;
}
