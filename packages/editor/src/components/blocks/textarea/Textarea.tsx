import type { Textarea, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Textarea.css';
import { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent } from '../base';
import IconSvg from './Textarea.svg?react';
import { UiBlockHeader } from '../../UiBlockHeader';

type TextareaProps = Prettify<Textarea>;

export const defaultInputProps: Textarea = {
  label: 'Textarea',
  value: '',
  rows: '5',
  autoResize: true,
  ...defaultBehaviourComponent,
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
    ...baseComponentFields,
    label: { subsection: 'General', label: 'Label', type: 'textBrowser', browsers: ['CMS'] },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', browsers: ['ATTRIBUTE'] },
    rows: { subsection: 'General', label: 'Visible Rows', type: 'number' },
    autoResize: { subsection: 'General', label: 'Auto Resize', type: 'checkbox' },
    ...behaviourComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ label, value, rows, autoResize, visible, required, disabled, updateOnChange }: UiComponentProps<TextareaProps>) => {
  return (
    <div className='block-textarea'>
      <UiBlockHeader
        visible={visible}
        label={label}
        required={required}
        disabled={disabled}
        additionalInfo={rows + ' rows'}
        updateOnChange={updateOnChange}
      />
      <div className='block-textarea__input-wrapper'>
        <span className='block-textarea__input'>{value}</span>
        {!autoResize && <div className='resize-icon' />}
      </div>
    </div>
  );
};
