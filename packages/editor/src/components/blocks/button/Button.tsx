import type { Button, ButtonVariant, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, FieldOption, UiComponentProps } from '../../../types/config';
import './Button.css';

type ButtonProps = Prettify<Button>;

const variantOptions: FieldOption<ButtonVariant>[] = [
  { label: 'Primary', value: 'PRIMARY' },
  { label: 'Secondary', value: 'SECONDARY' },
  { label: 'Danger', value: 'DANGER' }
] as const;

export const defaultButtonProps: Button = {
  name: 'Proceed',
  action: 'logic.proceed',
  variant: 'PRIMARY',
  icon: ''
} as const;

export const ButtonComponent: ComponentConfig<ButtonProps> = {
  name: 'Button',
  category: 'Action',
  icon: 'M22 9c0-.6-.5-1-1.3-1H3.4C2.5 8 2 8.4 2 9v6c0 .6.5 1 1.3 1h17.4c.8 0 1.3-.4 1.3-1V9zm-1 6H3V9h18v6z M4 11.5h16v1H4z',
  description: 'A button for fire actions',
  defaultProps: defaultButtonProps,
  render: props => <ButtonBlock {...props} />,
  fields: {
    name: { label: 'Name', type: 'text' },
    action: { label: 'Action', type: 'text' },
    variant: { type: 'select', options: variantOptions },
    icon: { label: 'Icon', type: 'text' }
  }
};

const ButtonBlock = ({ name, icon, variant }: UiComponentProps<ButtonProps>) => (
  <button className='block-button' data-variant={variant.toLocaleLowerCase()}>
    {icon && <i className={icon} />}
    <span>{name}</span>
  </button>
);
