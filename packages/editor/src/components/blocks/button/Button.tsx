import type { Button, ButtonVariant, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, FieldOption, UiComponentProps } from '../../../types/config';
import './Button.css';
import { IvyIcons } from '@axonivy/ui-icons/lib';
import { baseComponentFields, defaultBaseComponent } from '../base';

type ButtonProps = Prettify<Button>;

const variantOptions: FieldOption<ButtonVariant>[] = [
  { label: 'Primary', value: 'PRIMARY' },
  { label: 'Secondary', value: 'SECONDARY' },
  { label: 'Danger', value: 'DANGER' }
] as const;

export const defaultButtonProps: Button = {
  name: 'Proceed',
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
  icon: 'M22 9c0-.6-.5-1-1.3-1H3.4C2.5 8 2 8.4 2 9v6c0 .6.5 1 1.3 1h17.4c.8 0 1.3-.4 1.3-1V9zm-1 6H3V9h18v6z M4 11.5h16v1H4z',
  description: 'A button for fire actions',
  defaultProps: defaultButtonProps,
  render: props => <ButtonBlock {...props} />,
  fields: {
    name: { subsection: 'General', label: 'Name', type: 'text' },
    action: { subsection: 'General', label: 'Action', type: 'text' },
    variant: { subsection: 'General', label: 'Variant', type: 'select', options: variantOptions },
    icon: { subsection: 'General', label: 'Icon', type: 'select', options: iconOptions },
    ...baseComponentFields
  }
};

const ButtonBlock = ({ name, icon, variant }: UiComponentProps<ButtonProps>) => (
  <button className='block-button' data-variant={variant.toLocaleLowerCase()}>
    {icon && <i className={icon} />}
    <span>{name}</span>
  </button>
);
