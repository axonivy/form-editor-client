import type { Input, InputType, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Input.css';
import { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent } from '../base';
import IconSvg from './Input.svg?react';
import { UiBlockHeader } from '../../UiBlockHeader';

type InputProps = Prettify<Input>;

const typeOptions: FieldOption<InputType>[] = [
  { label: 'Text', value: 'TEXT' },
  { label: 'Email', value: 'EMAIL' },
  { label: 'Password', value: 'PASSWORD' },
  { label: 'Number', value: 'NUMBER' }
] as const;

export const defaultInputProps: Input = {
  label: 'Input',
  value: '',
  type: 'TEXT',
  ...defaultBehaviourComponent,
  ...defaultBaseComponent
} as const;

export const InputComponent: ComponentConfig<InputProps> = {
  name: 'Input',
  category: 'Elements',
  subcategory: 'Input',
  icon: <IconSvg />,
  description: 'A input with a label',
  defaultProps: defaultInputProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
  outlineInfo: component => component.label,
  fields: {
    label: { subsection: 'General', label: 'Label', type: 'textBrowser', browsers: ['CMS'] },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', browsers: ['ATTRIBUTE'] },
    type: { subsection: 'General', label: 'Type', type: 'select', options: typeOptions },
    ...behaviourComponentFields,
    ...baseComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ label, required, visible, value, disabled, updateOnChange }: UiComponentProps<InputProps>) => (
  <div className='block-input'>
    <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
    <span className={`block-input__input ${disabled === 'true' ? 'disabled' : ''}`}>{value}</span>
  </div>
);
