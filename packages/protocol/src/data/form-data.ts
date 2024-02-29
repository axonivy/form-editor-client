import type { KeysOfUnion } from '../utils/type-helper';
import type { Component, Form } from './form';

export type ComponentType = Component['type'];

export type ComponentConfigKeys = KeysOfUnion<Component['config']>;

export type PrimitiveValue = string | boolean | number;

export type ComponentData = Omit<Component, 'config'> & {
  config: Record<string, PrimitiveValue | Array<ComponentData>>;
};

type LayoutConfig = ComponentData & { config: { components: Array<ComponentData> } };

export type FormData = Omit<Form, 'components' | '$schema'> & {
  components: Array<ComponentData>;
};

export const isLayout = (component: Component | ComponentData): component is LayoutConfig => {
  return component.type === 'Layout' && 'components' in component.config;
};
