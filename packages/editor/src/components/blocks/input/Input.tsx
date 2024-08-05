import type { Input, InputType, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, FieldOption, UiComponentProps } from '../../../types/config';
import './Input.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Input.svg?react';

type InputProps = Prettify<Input>;

const typeOptions: FieldOption<InputType>[] = [
  { label: 'Text', value: 'TEXT' },
  { label: 'Email', value: 'EMAIL' },
  { label: 'Password', value: 'PASSWORD' },
  { label: 'Number', value: 'NUMBER' }
] as const;

export const defaultInputProps: Input = {
  label: 'Label',
  value: '',
  required: false,
  type: 'TEXT',
  ...defaultBaseComponent
} as const;

export const InputComponent: ComponentConfig<InputProps> = {
  name: 'Input',
  category: 'Elements',
  subcategory: 'Input',
  icon: <IconSvg />,
  description: 'A simple input with a label',
  defaultProps: defaultInputProps,
  render: props => <UiInput {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
  fields: {
    label: { subsection: 'General', label: 'Label', type: 'text' },
    required: { subsection: 'General', label: 'Required', type: 'checkbox' },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser' },
    type: { subsection: 'General', label: 'Type', type: 'select', options: typeOptions },
    ...baseComponentFields
  }
};

const UiInput = ({ label, required, value }: UiComponentProps<InputProps>) => (
  <div className='block-input'>
    <span className='block-input__label'>
      {label}
      {required && ' *'}
    </span>
    <span className='block-input__input'>{value}</span>
  </div>
);
