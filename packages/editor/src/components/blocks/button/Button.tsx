import type { Button, ButtonVariant, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Button.css';
import { useBase } from '../base';
import IconSvg from './Button.svg?react';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { renderIconField } from './fields/IconField';
import { renderTypeField } from './fields/TypeField';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type ButtonProps = Prettify<Button>;

const isButtonProps = (obj: unknown): obj is ButtonProps => {
  return typeof obj === 'object' && obj !== null && 'type' in obj && typeof (obj as ButtonProps).type === 'string';
};
export const hideButtonField = <T,>(obj: T): boolean => {
  if (isButtonProps(obj)) {
    if (obj.type === 'DELETE' || obj.type === 'EDIT') {
      return true;
    }
  }
  return false;
};

export const useButtonComponent = () => {
  const { baseComponentFields, defaultBaseComponent, defaultDisabledComponent, disabledComponentFields } = useBase();
  const { t } = useTranslation();

  const ButtonComponent: ComponentConfig<ButtonProps> = useMemo(() => {
    const variantOptions: FieldOption<ButtonVariant>[] = [
      { label: t('components.button.type.primary'), value: 'PRIMARY' },
      { label: t('components.button.type.secondary'), value: 'SECONDARY' },
      { label: t('components.button.type.danger'), value: 'DANGER' }
    ] as const;

    const defaultButtonProps: Button = {
      name: t('property.action'),
      action: '',
      variant: 'PRIMARY',
      type: 'BUTTON',
      icon: '',
      processOnlySelf: false,
      ...defaultDisabledComponent,
      ...defaultBaseComponent
    } as const;

    const component: ComponentConfig<ButtonProps> = {
      name: 'Button',
      displayName: t('components.button.name'),
      category: 'Actions',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.button.description'),
      defaultProps: defaultButtonProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, value, defaultProps }) => ({ ...defaultButtonProps, name: label, action: value, ...defaultProps }),
      outlineInfo: component => component.name,
      fields: {
        ...baseComponentFields,
        type: {
          subsection: 'General',
          label: t('property.type'),
          type: 'generic',
          render: renderTypeField
        },
        name: {
          subsection: 'General',
          label: t('property.name'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        action: {
          subsection: 'General',
          label: t('property.action'),
          type: 'textBrowser',
          browsers: [{ type: 'LOGIC' }, { type: 'ATTRIBUTE', options: { withoutEl: true, overrideSelection: true } }],
          hide: data => hideButtonField(data)
        },
        variant: {
          subsection: 'General',
          label: t('property.variant'),
          type: 'select',
          options: variantOptions
        },
        icon: {
          subsection: 'General',
          label: t('property.icon'),
          type: 'generic',
          render: renderIconField
        },
        processOnlySelf: { subsection: 'Behaviour', type: 'hidden' },
        ...disabledComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return component;
  }, [baseComponentFields, defaultBaseComponent, defaultDisabledComponent, disabledComponentFields, t]);

  return {
    ButtonComponent
  };
};

const UiBlock = ({ name, icon, variant, visible, disabled }: UiComponentProps<ButtonProps>) => (
  <>
    <UiBlockHeader visible={visible} disabled={disabled} />
    <div className='block-button' data-variant={variant.toLocaleLowerCase()}>
      {icon && <i className={icon} />}
      {(name.length > 0 || icon.length === 0) && <UiBadge value={name} />}
    </div>
  </>
);
