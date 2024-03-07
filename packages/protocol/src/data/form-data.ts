import type { KeysOfUnion } from '../utils/type-helper';
import type { Component, Form, Layout } from './form';

export type ComponentType = Component['type'];

export type ComponentConfigKeys = KeysOfUnion<Component['config']>;

export type PrimitiveValue = string | boolean | number;

export type ConfigData = Record<string, PrimitiveValue | Array<ComponentData>>;

export type ComponentData = Omit<Component, 'config'> & {
  config: ConfigData;
};

type LayoutConfig = ComponentData & { config: Omit<Layout, 'components'> & { components: Array<ComponentData> } };

export type FormData = Omit<Form, 'components' | '$schema'> & {
  components: Array<ComponentData>;
};

export const isLayout = (component?: Component | ComponentData): component is LayoutConfig => {
  return component !== undefined && component.type === 'Layout' && 'components' in component.config;
};

export const isFreeLayout = (component?: Component | ComponentData): component is LayoutConfig => {
  return isLayout(component) && component.config.gridVariant === 'FREE';
};
