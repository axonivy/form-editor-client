import type { Textarea, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './Textarea.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Textarea.svg?react';

type TextareaProps = Prettify<Textarea>;

export const defaultInputProps: Textarea = {
  label: 'Label',
  value: '',
  rows: '5',
  autoResize: true,
  ...defaultBaseComponent
} as const;

export const TextareaComponent: ComponentConfig<TextareaProps> = {
  name: 'Textarea',
  category: 'Elements',
  subcategory: 'Input',
  icon: <IconSvg />,
  description: 'A customizable Textarea component',
  defaultProps: defaultInputProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
  outlineInfo: component => component.label,
  fields: {
    label: { subsection: 'General', label: 'Label', type: 'text' },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', options: { onlyTypesOf: 'Date' } },
    rows: { subsection: 'General', label: 'Visible Rows', type: 'number' },
    autoResize: { subsection: 'General', label: 'Auto Resize', type: 'checkbox' },
    ...baseComponentFields
  }
};

const UiBlock = ({ label, value, rows, autoResize }: UiComponentProps<TextareaProps>) => {
  return (
    <div className='block-textarea'>
      <div className='block-textarea__label'>
        <span>{label}</span>
        <span className='visible-rows-hint'>{rows} rows</span>
      </div>
      <div className='block-textarea__input-wrapper'>
        <span className='block-textarea__input'>{value}</span>
        {!autoResize && <div className='resize-icon' />}
      </div>
    </div>
  );
};
