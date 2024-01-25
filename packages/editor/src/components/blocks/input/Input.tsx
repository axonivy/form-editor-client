import type { Input, InputType, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, FieldOption, UiComponentProps } from '../../../types/config';
import './Input.css';

type InputProps = Prettify<Input>;

const typeOptions: FieldOption<InputType>[] = [
  { label: 'Email', value: 'EMAIL' },
  { label: 'Password', value: 'PASSWORD' },
  { label: 'Text', value: 'TEXT' }
] as const;

export const defaultInputProps: Input = {
  label: 'My label',
  value: 'data.value',
  required: false,
  type: 'TEXT'
} as const;

export const InputComponent: ComponentConfig<InputProps> = {
  name: 'Input',
  category: 'Basic',
  icon: 'M22 9c0-.6-.5-1-1.3-1H3.4C2.5 8 2 8.4 2 9v6c0 .6.5 1 1.3 1h17.4c.8 0 1.3-.4 1.3-1V9zm-1 6H3V9h18v6z M4 10h1v4H4z',
  description: 'A simple input with a label',
  defaultProps: defaultInputProps,
  render: props => <UiInput {...props} />,
  fields: {
    label: { type: 'text' },
    required: { type: 'checkbox' },
    value: { type: 'text' },
    type: { type: 'select', options: typeOptions }
  }
};

const UiInput = ({ label, required, value }: UiComponentProps<InputProps>) => (
  <label className='block-input'>
    <span>{label}</span>
    <input onChange={() => {}} value={value} required={required} />
  </label>
);
