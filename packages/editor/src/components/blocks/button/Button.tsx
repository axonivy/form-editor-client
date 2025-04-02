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
  const {
    baseComponentFields,
    defaultBaseComponent,
    defaultDisabledComponent,
    disabledComponentFields,
    CategoryLookup,
    SubCategoryLookup,
    SubsectionLookup
  } = useBase();
  const { t } = useTranslation();

  const variantOptions: FieldOption<ButtonVariant>[] = useMemo(
    () =>
      [
        { label: t('button.type.primary'), value: 'PRIMARY' },
        { label: t('button.type.secondary'), value: 'SECONDARY' },
        { label: t('button.type.danger'), value: 'DANGER' }
      ] as const,
    [t]
  );

  const ButtonComponent: ComponentConfig<ButtonProps> = useMemo(() => {
    const defaultButtonProps: Button = {
      name: 'Action',
      action: '',
      variant: 'PRIMARY',
      type: 'BUTTON',
      icon: '',
      processOnlySelf: false,
      ...defaultDisabledComponent,
      ...defaultBaseComponent
    } as const;
    return {
      name: 'Button',
      displayName: t('button.name'),
      category: CategoryLookup['Elements'],
      subcategory: SubCategoryLookup['General'],
      icon: <IconSvg />,
      description: t('button.description'),
      defaultProps: defaultButtonProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, value, defaultProps }) => ({ ...defaultButtonProps, name: label, action: value, ...defaultProps }),
      outlineInfo: component => component.name,
      fields: {
        ...baseComponentFields,
        type: {
          subsection: SubsectionLookup['General'],
          label: t('label.type'),
          type: 'generic',
          render: renderTypeField
        },
        name: {
          subsection: SubsectionLookup['General'],
          label: t('label.name'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        action: {
          subsection: SubsectionLookup['General'],
          label: t('label.action'),
          type: 'textBrowser',
          browsers: [{ type: 'LOGIC' }, { type: 'ATTRIBUTE', options: { withoutEl: true, overrideSelection: true } }],
          hide: data => hideButtonField(data)
        },
        variant: {
          subsection: SubsectionLookup['General'],
          label: t('label.variant'),
          type: 'select',
          options: variantOptions
        },
        icon: {
          subsection: SubsectionLookup['General'],
          label: t('label.icon'),
          type: 'generic',
          render: renderIconField
        },
        processOnlySelf: { subsection: SubsectionLookup['Behaviour'], type: 'hidden' },
        ...disabledComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };
  }, [
    CategoryLookup,
    SubCategoryLookup,
    SubsectionLookup,
    baseComponentFields,
    defaultBaseComponent,
    defaultDisabledComponent,
    disabledComponentFields,
    t,
    variantOptions
  ]);

  const UiBlock = ({ name, icon, variant, visible, disabled }: UiComponentProps<ButtonProps>) => (
    <>
      <UiBlockHeader visible={visible} disabled={disabled} />
      <div className='block-button' data-variant={variant.toLocaleLowerCase()}>
        {icon && <i className={icon} />}
        {(name.length > 0 || icon.length === 0) && <UiBadge value={name} />}
      </div>
    </>
  );

  return {
    ButtonComponent
  };
};
