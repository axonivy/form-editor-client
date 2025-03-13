import type { Button, ButtonType, ButtonVariant, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Button.css';
import { baseComponentFields, defaultBaseComponent, defaultDisabledComponent, disabledComponentFields } from '../base';
import IconSvg from './Button.svg?react';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { renderIconField } from './IconField';

type ButtonProps = Prettify<Button>;

const variantOptions: FieldOption<ButtonVariant>[] = [
  { label: 'Primary', value: 'PRIMARY' },
  { label: 'Secondary', value: 'SECONDARY' },
  { label: 'Danger', value: 'DANGER' }
] as const;

const typeOptions: FieldOption<ButtonType>[] = [
  { label: 'Edit', value: 'EDIT' },
  { label: 'Delete', value: 'DELETE' }
] as const;

export const defaultButtonProps: Button = {
  name: 'Action',
  action: '',
  variant: 'PRIMARY',
  type: 'BUTTON',
  icon: '',
  processOnlySelf: false,
  ...defaultDisabledComponent,
  ...defaultBaseComponent
} as const;

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
export const ButtonComponent: ComponentConfig<ButtonProps> = {
  name: 'Button',
  category: 'Actions',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'A button for fire actions',
  defaultProps: defaultButtonProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, defaultProps }) => ({ ...defaultButtonProps, name: label, action: value, ...defaultProps }),
  outlineInfo: component => component.name,
  fields: {
    ...baseComponentFields,
    type: {
      subsection: 'General',
      label: 'Type',
      type: 'select',
      options: typeOptions,
      hide: data => data.type !== 'EDIT' && data.type !== 'DELETE'
    },
    name: {
      subsection: 'General',
      label: 'Name',
      type: 'textBrowser',
      browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
    },
    action: {
      subsection: 'General',
      label: 'Action',
      type: 'textBrowser',
      browsers: [{ type: 'LOGIC' }, { type: 'ATTRIBUTE', options: { withoutEl: true, overrideSelection: true } }],
      hide: data => hideButtonField(data)
    },
    variant: {
      subsection: 'General',
      label: 'Variant',
      type: 'select',
      options: variantOptions
    },
    icon: {
      subsection: 'General',
      label: 'Icon',
      type: 'generic',
      render: renderIconField
    },
    processOnlySelf: { subsection: 'Behaviour', type: 'hidden' },
    ...disabledComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
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
