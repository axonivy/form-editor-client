import type { Button, ButtonVariant, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Button.css';
import { baseComponentFields, defaultBaseComponent, defaultDisabledComponent, disabledComponentFields } from '../base';
import IconSvg from './Button.svg?react';
import { UiBlockHeader } from '../../UiBlockHeader';

type ButtonProps = Prettify<Button>;

const variantOptions: FieldOption<ButtonVariant>[] = [
  { label: 'Primary', value: 'PRIMARY' },
  { label: 'Secondary', value: 'SECONDARY' },
  { label: 'Danger', value: 'DANGER' }
] as const;

export const defaultButtonProps: Button = {
  name: 'Action',
  action: '',
  variant: 'PRIMARY',
  icon: '',
  processOnlySelf: false,
  ...defaultDisabledComponent,
  ...defaultBaseComponent
} as const;

export const ButtonComponent: ComponentConfig<ButtonProps> = {
  name: 'Button',
  category: 'Action',
  subcategory: 'General',
  icon: <IconSvg />,
  description: 'A button for fire actions',
  defaultProps: defaultButtonProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, defaultProps }) => ({ ...defaultButtonProps, name: label, action: value, ...defaultProps }),
  outlineInfo: component => component.name,
  fields: {
    ...baseComponentFields,
    name: { subsection: 'General', label: 'Name', type: 'textBrowser', browsers: ['CMS'] },
    action: { subsection: 'General', label: 'Action', type: 'textBrowser', browsers: ['LOGIC'] },
    variant: { subsection: 'General', label: 'Variant', type: 'select', options: variantOptions },
    icon: { subsection: 'General', label: 'Icon', type: 'hidden' },
    processOnlySelf: { subsection: 'Behaviour', type: 'hidden' },
    ...disabledComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ name, icon, variant, visible, disabled }: UiComponentProps<ButtonProps>) => (
  <>
    <UiBlockHeader visible={visible} disabled={disabled} />
    <button className='block-button' data-variant={variant.toLocaleLowerCase()}>
      {icon && <i className={icon} />}
      <span>{name}</span>
    </button>
  </>
);
