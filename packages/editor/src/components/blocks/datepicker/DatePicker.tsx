import type { DatePicker, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './DatePicker.css';
import { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent } from '../base';
import IconSvg from './DatePicker.svg?react';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';

type DatePickerProps = Prettify<DatePicker>;

export const defaultDatePickerProps: DatePicker = {
  label: 'Date Picker',
  value: '',
  datePattern: 'dd.MM.yyyy',
  timePattern: 'HH:mm',
  showTime: false,
  ...defaultBehaviourComponent,
  ...defaultBaseComponent
} as const;

export const DatePickerComponent: ComponentConfig<DatePickerProps> = {
  name: 'DatePicker',
  category: 'Elements',
  subcategory: 'Input',
  icon: <IconSvg />,
  description: 'A datepicker with label for date or datetime',
  defaultProps: defaultDatePickerProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultDatePickerProps, label, value, ...defaultProps }),
  outlineInfo: component => component.label,
  fields: {
    ...baseComponentFields,
    label: {
      subsection: 'General',
      label: 'Label',
      type: 'textBrowser',
      browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
    },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', browsers: [{ type: 'ATTRIBUTE', options: { typeHint: 'Date' } }] },
    datePattern: { subsection: 'General', label: 'Date Pattern', type: 'text', options: { placeholder: 'e.g. dd.MM.yyyy' } },
    showTime: { subsection: 'General', label: 'Show Time', type: 'checkbox' },
    timePattern: {
      subsection: 'General',
      label: 'Time Pattern',
      type: 'text',
      options: { placeholder: 'e.g. HH:mm' },
      hide: data => !data.showTime
    },
    ...behaviourComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({
  label,
  value,
  datePattern,
  timePattern,
  showTime,
  visible,
  required,
  disabled,
  updateOnChange
}: UiComponentProps<DatePickerProps>) => (
  <div className='block-input'>
    <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
    <span className='block-input__input'>
      {value === '' ? showTime ? datePattern + ' ' + timePattern : datePattern : <UiBadge value={value} />}
      <svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g clipPath='url(#clip0_35_14)'>
          <path
            d='M2.83331 4.95835C2.83331 4.58263 2.98257 4.2223 3.24825 3.95662C3.51392 3.69094 3.87426 3.54169 4.24998 3.54169H12.75C13.1257 3.54169 13.486 3.69094 13.7517 3.95662C14.0174 4.2223 14.1666 4.58263 14.1666 4.95835V13.4584C14.1666 13.8341 14.0174 14.1944 13.7517 14.4601C13.486 14.7258 13.1257 14.875 12.75 14.875H4.24998C3.87426 14.875 3.51392 14.7258 3.24825 14.4601C2.98257 14.1944 2.83331 13.8341 2.83331 13.4584V4.95835Z'
            stroke='#A3A3A3'
            strokeWidth='0.888776'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path d='M11.3333 2.125V4.95833' stroke='#A3A3A3' strokeWidth='0.888776' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M5.66669 2.125V4.95833' stroke='#A3A3A3' strokeWidth='0.888776' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M2.83331 7.79169H14.1666' stroke='#A3A3A3' strokeWidth='0.888776' strokeLinecap='round' strokeLinejoin='round' />
          <path
            d='M5.66669 10.625H7.08335V12.0417H5.66669V10.625Z'
            fill='#A3A3A3'
            stroke='#A3A3A3'
            strokeWidth='0.888776'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_35_14'>
            <rect width='17' height='17' fill='white' />
          </clipPath>
        </defs>
      </svg>
    </span>
  </div>
);
