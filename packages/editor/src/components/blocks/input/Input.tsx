import type { ComponentConfig, FieldOptionValues, UiComponentProps } from '../../../types/config';
import './Input.css';

const labelPosOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Left', value: 'left' }
] as const;

const typeOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Number', value: 'number' },
  { label: 'Text', value: 'text' }
] as const;

type InputProps = {
  label: string;
  labelPos: FieldOptionValues<typeof labelPosOptions>;
  value: string;
  required: boolean;
  type: FieldOptionValues<typeof typeOptions>;
};

export const defaultInputProps = {
  label: 'My label',
  labelPos: 'top',
  value: 'data.value',
  required: false,
  type: 'text'
} as const satisfies InputProps;

export const InputComponent: ComponentConfig<InputProps> = {
  name: 'Input',
  category: 'Basic',
  icon: 'M22 9c0-.6-.5-1-1.3-1H3.4C2.5 8 2 8.4 2 9v6c0 .6.5 1 1.3 1h17.4c.8 0 1.3-.4 1.3-1V9zm-1 6H3V9h18v6z M4 10h1v4H4z',
  description: 'A simple input with a label',
  defaultProps: defaultInputProps,
  render: props => <Input {...props} />,
  fields: {
    label: { type: 'text' },
    labelPos: { label: 'Label Position', type: 'select', options: labelPosOptions },
    required: { type: 'checkbox' },
    value: { type: 'text' },
    type: { type: 'select', options: typeOptions }
  }
};

const Input = ({ label, labelPos, required, value }: UiComponentProps<InputProps>) => (
  <label className='block-input' data-label-pos={labelPos}>
    <span>{label}</span>
    <input onChange={() => {}} value={value} required={required} />
  </label>
);
