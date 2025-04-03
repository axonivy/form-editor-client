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
  const { baseComponentFields, defaultBaseComponent, CategoryLookup, SubCategoryLookup, SubsectionLookup } = useBase();
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
      category: CategoryLookup['Hidden'],
      subcategory: SubCategoryLookup['General'],
      icon: <IconSvg />,
      description: 'A button for fire actions',
      defaultProps: defaultCompositeProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, defaultProps }) => ({ ...defaultCompositeProps, name: label, ...defaultProps }),
      outlineInfo: component => component.name,
      fields: {
        ...baseComponentFields,
        name: { subsection: SubsectionLookup['General'], label: 'Composite', type: 'text', options: { disabled: true } },
        startMethod: { subsection: SubsectionLookup['General'], label: 'Start Method', type: 'generic', render: renderStartMethodSelect },
        parameters: { subsection: SubsectionLookup['Parameters'], type: 'generic', render: renderParameters }
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    } as const;
    return CompositeComponent;
  }, [CategoryLookup, SubCategoryLookup, SubsectionLookup, baseComponentFields, defaultBaseComponent, t]);

  const UiBlock = ({ name }: UiComponentProps<CompositeProps>) => (
    <div className='block-composite'>
      <span>{name}</span>
    </div>
  );

  return {
    isComposite,
    CompositeComponent
  };
};
