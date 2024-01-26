import type { KeysOfUnion } from '../utils/type-helper';
import type { Component, Form } from './form';

export type ComponentType = Component['type'];

export type ComponentConfigKeys = KeysOfUnion<Component['config']>;

export type PrimitiveValue = string | boolean | number;

export type ComponentData = Omit<Component, 'config'> & {
  config: Record<string, PrimitiveValue>;
};

export type FormData = Omit<Form, 'components' | '$schema'> & {
  components: ComponentData[];
};
