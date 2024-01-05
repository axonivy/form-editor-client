import type { ComponentConfig, FieldOptionValues, UiComponentProps } from '../../../types/config';
import './Button.css';

const variantOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Success', value: 'success' },
  { label: 'Danger', value: 'danger' },
  { label: 'Warning', value: 'warning' }
] as const;

type ButtonProps = {
  label: string;
  action: string;
  variant: FieldOptionValues<typeof variantOptions>;
};

export const defaultButtonProps = {
  label: 'Proceed',
  action: 'logic.proceed',
  variant: 'primary'
} as const satisfies ButtonProps;

export const ButtonComponent: ComponentConfig<ButtonProps> = {
  name: 'Button',
  category: 'Action',
  icon: 'M22 9c0-.6-.5-1-1.3-1H3.4C2.5 8 2 8.4 2 9v6c0 .6.5 1 1.3 1h17.4c.8 0 1.3-.4 1.3-1V9zm-1 6H3V9h18v6z M4 11.5h16v1H4z',
  description: 'A button for fire actions',
  defaultProps: defaultButtonProps,
  render: props => <Button {...props} />,
  fields: {
    label: { type: 'text' },
    action: { type: 'text' },
    variant: {
      type: 'select',
      options: variantOptions
    }
  }
};

const Button = ({ label, variant }: UiComponentProps<ButtonProps>) => (
  <button className='block-button' data-variant={variant}>
    <span>{label}</span>
  </button>
);
