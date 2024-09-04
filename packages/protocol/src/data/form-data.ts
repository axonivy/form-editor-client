import type { KeysOfUnion } from '../utils/type-helper';
import type { Component, Form, Layout } from './form';

export type ComponentType = Component['type'];

export type ComponentConfigKeys = KeysOfUnion<Component['config']>;

export type PrimitiveValue = string | boolean | number | any[];

export type ConfigData = Record<string, PrimitiveValue | Array<ComponentData>>;

export type ComponentData = Omit<Component, 'config'> & {
  config: ConfigData;
};

export type LayoutConfig = ComponentData & { config: Omit<Layout, 'components'> & { components: Array<ComponentData> } };

export type FormData = Omit<Form, 'components' | '$schema'> & {
  components: Array<ComponentData>;
};

export const isLayout = (component?: Component | ComponentData): component is LayoutConfig => {
  return component !== undefined && component.type === 'Layout' && 'components' in component.config;
};

export const isTable = (component?: Component | ComponentData): component is LayoutConfig => {
  return component !== undefined && component.type === 'DataTable' && 'components' in component.config;
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
