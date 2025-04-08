import type { Fieldset, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import IconSvg from './Fieldset.svg?react';
import { useBase } from '../base';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import './Fieldset.css';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { Flex } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type FieldsetProps = Prettify<Fieldset>;

export const useFieldsetComponent = () => {
  const { defaultBaseComponent, baseComponentFields, defaultVisibleComponent, visibleComponentField } = useBase();
  const { t } = useTranslation();

  const FieldsetComponent: ComponentConfig<FieldsetProps> = useMemo(() => {
    const defaultFieldsetProps: FieldsetProps = {
      components: [],
      legend: t('property.title'),
      collapsible: false,
      collapsed: false,
      ...defaultVisibleComponent,
      ...defaultBaseComponent
    };

    const FieldsetComponent: ComponentConfig<FieldsetProps> = {
      name: 'Fieldset',
      displayName: t('components.fieldset.name'),
      category: 'Structures',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.fieldset.description'),
      defaultProps: defaultFieldsetProps,
      quickActions: DEFAULT_QUICK_ACTIONS,
      render: props => <UiBlock {...props} />,
      create: ({ defaultProps }) => ({ ...defaultFieldsetProps, ...defaultProps }),
      outlineInfo: component => component.legend,
      fields: {
        ...baseComponentFields,
        components: { subsection: 'General', type: 'hidden' },
        legend: {
          subsection: 'General',
          label: t('property.title'),
          type: 'textBrowser',
          browsers: [
            { type: 'ATTRIBUTE', options: { overrideSelection: true } },
            { type: 'CMS', options: { overrideSelection: true } }
          ]
        },
        collapsible: { subsection: 'Behaviour', label: t('property.collapsible'), type: 'checkbox' },
        collapsed: {
          subsection: 'Behaviour',
          label: t('property.collapsedDefault'),
          type: 'checkbox',
          hide: data => !data.collapsible
        },
        ...visibleComponentField
      }
    };

    return FieldsetComponent;
  }, [baseComponentFields, defaultBaseComponent, defaultVisibleComponent, t, visibleComponentField]);

  return {
    FieldsetComponent
  };
};

const UiBlock = ({ id, components, legend, collapsible, collapsed, visible }: UiComponentProps<FieldsetProps>) => (
  <>
    <UiBlockHeader visible={visible} />
    <fieldset className={`${collapsible ? (collapsed ? 'collapsible default-collapsed' : 'collapsible') : ''}`}>
      <legend>
        <Flex direction='row' alignItems='center' gap={1}>
          {collapsible ? (collapsed ? '+' : '-') : ''}
          <UiBadge value={legend} />
        </Flex>
      </legend>
      {components.map((component, index) => (
        <ComponentBlock key={component.cid} component={component} preId={components[index - 1]?.cid} />
      ))}
      <EmptyLayoutBlock id={id} components={components} type='fieldset' />
    </fieldset>
  </>
);
