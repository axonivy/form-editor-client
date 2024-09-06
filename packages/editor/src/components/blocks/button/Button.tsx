import type { Button, ButtonVariant, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Button.css';
import { IvyIcons } from '@axonivy/ui-icons/lib';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Button.svg?react';

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
  ...defaultBaseComponent
} as const;

const iconOptions: FieldOption<`ivy ivy-${IvyIcons}`>[] = (Object.keys(IvyIcons) as (keyof typeof IvyIcons)[]).map(key => ({
  label: key,
  value: `ivy ivy-${IvyIcons[key]}`
}));

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
    name: { subsection: 'General', label: 'Name', type: 'text' },
    action: { subsection: 'General', label: 'Action', type: 'text' },
    variant: { subsection: 'General', label: 'Variant', type: 'select', options: variantOptions },
    icon: { subsection: 'General', label: 'Icon', type: 'select', options: iconOptions },
    ...baseComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ name, icon, variant }: UiComponentProps<ButtonProps>) => (
  <button className='block-button' data-variant={variant.toLocaleLowerCase()}>
    {icon && <i className={icon} />}
    <span>{name}</span>
  </button>
);
