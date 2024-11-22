import type { Input, InputType, Prettify, SymbolPosition } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Input.css';
import { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent } from '../base';
import IconSvg from './Input.svg?react';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';

type InputProps = Prettify<Input>;

const typeOptions: FieldOption<InputType>[] = [
  { label: 'Text', value: 'TEXT' },
  { label: 'Email', value: 'EMAIL' },
  { label: 'Password', value: 'PASSWORD' },
  { label: 'Number', value: 'NUMBER' }
] as const;

const positionOptions: FieldOption<SymbolPosition>[] = [
  { label: 'Suffix', value: 's' },
  { label: 'Prefix', value: 'p' }
] as const;

type NumberFormattingProps = { decimalPlaces: string; symbol: string; symbolPosition: SymbolPosition };

export const defaultNumberFormatting: NumberFormattingProps = {
  decimalPlaces: '',
  symbol: '',
  symbolPosition: 's'
} as const;

export const defaultInputProps: Input = {
  label: 'Input',
  value: '',
  type: 'TEXT',
  ...defaultNumberFormatting,
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
    ...baseComponentFields,
    label: { subsection: 'General', label: 'Label', type: 'textBrowser', browsers: ['CMS'] },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', browsers: ['ATTRIBUTE'] },
    type: { subsection: 'General', label: 'Type', type: 'select', options: typeOptions },
    decimalPlaces: { subsection: 'Formatting', label: 'Decimal Places', type: 'number', hide: data => data.type !== 'NUMBER' },
    symbol: { subsection: 'Formatting', label: 'Symbol', type: 'text', hide: data => data.type !== 'NUMBER' },
    symbolPosition: {
      subsection: 'Formatting',
      label: 'Symbol Position',
      type: 'select',
      options: positionOptions,
      hide: data => !(data.type === 'NUMBER' && data.symbol.length > 0)
    },
    ...behaviourComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ label, required, visible, value, disabled, updateOnChange, symbol, symbolPosition }: UiComponentProps<InputProps>) => (
  <div className='block-input'>
    <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
    <span className={`block-input__input ${disabled === 'true' ? 'disabled' : ''}`}>
      {symbolPosition === 'p' && symbol}
      <UiBadge value={value} />
      {symbolPosition === 's' && symbol}
    </span>
  </div>
);
