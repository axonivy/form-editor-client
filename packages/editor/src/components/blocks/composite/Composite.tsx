import type { Component, ComponentData, Composite, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Composite.css';
import { useBase } from '../base';
import IconSvg from './Composite.svg?react';
import { renderStartMethodSelect } from './fields/StartMethodSelect';
import { renderParameters } from './fields/Parameters';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type CompositeProps = Prettify<Composite>;

export const useCompositeComponent = () => {
  const isComposite = (component?: Component | ComponentData): component is ComponentData & { config: Composite } => {
    return component !== undefined && component.type === 'Composite' && 'name' in component.config && 'startMethod' in component.config;
  };
  const { baseComponentFields, defaultBaseComponent } = useBase();
  const { t } = useTranslation();

  const CompositeComponent: ComponentConfig<CompositeProps> = useMemo(() => {
    const defaultCompositeProps: Composite = {
      name: '',
      startMethod: '',
      parameters: {},
      ...defaultBaseComponent
    } as const;

    const CompositeComponent: ComponentConfig<CompositeProps> = {
      name: 'Composite',
      displayName: t('composite.name'),
      category: 'Hidden',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('composite.description'),
      defaultProps: defaultCompositeProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, defaultProps }) => ({ ...defaultCompositeProps, name: label, ...defaultProps }),
      outlineInfo: component => component.name,
      fields: {
        ...baseComponentFields,
        name: { subsection: 'General', label: t('composite.name'), type: 'text', options: { disabled: true } },
        startMethod: { subsection: 'General', label: t('property.startMethod'), type: 'generic', render: renderStartMethodSelect },
        parameters: { subsection: 'Parameters', type: 'generic', render: renderParameters }
      },
  quickActions: [...DEFAULT_QUICK_ACTIONS, 'OPENCOMPONENT']
    } as const;

    return CompositeComponent;
  }, [baseComponentFields, defaultBaseComponent, t]);

  return {
    isComposite,
    CompositeComponent
  };
};

const UiBlock = ({ name }: UiComponentProps<CompositeProps>) => (
  <div className='block-composite'>
    <span>{name}</span>
  </div>
);
