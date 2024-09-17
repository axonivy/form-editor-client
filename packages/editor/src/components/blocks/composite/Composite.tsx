import type { Component, ComponentData, Composite, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Composite.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Composite.svg?react';
import { renderStartMethodSelect } from './fields/StartMethodSelect';
import { renderParameters } from './fields/Parameters';

type CompositeProps = Prettify<Composite>;

export const isComposite = (component?: Component | ComponentData): component is ComponentData & { config: Composite } => {
  return component !== undefined && component.type === 'Composite' && 'name' in component.config && 'startMethod' in component.config;
};

export const defaultCompositeProps: Composite = {
  name: '',
  startMethod: '',
  parameters: {},
  ...defaultBaseComponent
} as const;

export const CompositeComponent: ComponentConfig<CompositeProps> = {
  name: 'Composite',
  category: 'Hidden',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'A button for fire actions',
  defaultProps: defaultCompositeProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, defaultProps }) => ({ ...defaultCompositeProps, name: label, ...defaultProps }),
  outlineInfo: component => component.name,
  fields: {
    name: { subsection: 'General', label: 'Name', type: 'text' },
    startMethod: { subsection: 'General', label: 'Start Method', type: 'generic', render: renderStartMethodSelect },
    parameters: { section: 'Parameters', subsection: 'General', label: 'Parameters', type: 'generic', render: renderParameters },
    ...baseComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
} as const;

const UiBlock = ({ name }: UiComponentProps<CompositeProps>) => (
  <div className='block-composite'>
    <span>{name}</span>
  </div>
);
