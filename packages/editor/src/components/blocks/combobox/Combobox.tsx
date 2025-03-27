import type { Combobox, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Combobox.css';
import { useBase } from '../base';
import IconSvg from './Combobox.svg?react';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type ComboboxProps = Prettify<Combobox>;

export const useComboboxComponent = () => {
  const { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent } = useBase();
  const { t } = useTranslation();

  const ComboboxComponent: ComponentConfig<ComboboxProps> = useMemo(() => {
    const defaultComboboxProps: Combobox = {
      label: t('combobox.name'),
      value: '',
      completeMethod: '',
      itemLabel: '',
      itemValue: '',
      withDropdown: false,
      ...defaultBehaviourComponent,
      ...defaultBaseComponent
    } as const;
    const component: ComponentConfig<ComboboxProps> = {
      name: 'Combobox',
      displayName: t('combobox.name'),
      category: 'Elements',
      subcategory: 'Input',
      icon: <IconSvg />,
      description: t('combobox.description'),
      defaultProps: defaultComboboxProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, value, ...defaultProps }) => ({ ...defaultComboboxProps, label, value, ...defaultProps }),
      outlineInfo: component => component.label,
      fields: {
        ...baseComponentFields,
        label: {
          subsection: 'General',
          label: t('property.label'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        value: {
          subsection: 'General',
          label: t('property.value'),
          type: 'textBrowser',
          browsers: [{ type: 'ATTRIBUTE' }]
        },
        completeMethod: {
          subsection: 'Options',
          label: t('property.completeMethod'),
          type: 'textBrowser',
          browsers: [{ type: 'LOGIC' }]
        },
        itemLabel: {
          subsection: 'Options',
          label: t('property.itemLabel'),
          type: 'text',
          hide: data => data.completeMethod.length === 0
        },
        itemValue: {
          subsection: 'Options',
          label: t('property.itemValue'),
          type: 'text',
          hide: data => data.completeMethod.length === 0
        },
        withDropdown: { subsection: 'Options', label: t('combobox.addDropdown'), type: 'checkbox' },
        ...behaviourComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };
    return component;
  }, [baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent, t]);

  return {
    ComboboxComponent
  };
};

const UiBlock = ({ label, value, visible, required, disabled, updateOnChange }: UiComponentProps<ComboboxProps>) => (
  <div className='block-input'>
    <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
    <div className='block-input__input'>
      <UiBadge value={value} />
      <IvyIcon icon={IvyIcons.Chevron} rotate={90} />
    </div>
  </div>
);
