import type { Combobox, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './Combobox.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Combobox.svg?react';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

type ComboboxProps = Prettify<Combobox>;

export const defaultInputProps: Combobox = {
  label: 'Label',
  value: '',
  completeMethod: '',
  ...defaultBaseComponent
} as const;

export const ComboboxComponent: ComponentConfig<ComboboxProps> = {
  name: 'Combobox',
  category: 'Elements',
  subcategory: 'Interactions',
  icon: <IconSvg />,
  description: 'A simple autocomplete Combobox',
  defaultProps: defaultInputProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
  fields: {
    label: { subsection: 'General', label: 'Label', type: 'text' },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', options: { onlyListTypes: true } },
    completeMethod: { subsection: 'General', label: 'Complete Method', type: 'text' },
    ...baseComponentFields
  }
};

const UiBlock = ({ label, value }: UiComponentProps<ComboboxProps>) => (
  <div className='block-input'>
    <span className='block-input__label'>{label}</span>
    <div className='block-input__input'>
      <span>{value}</span>
      <IvyIcon icon={IvyIcons.Chevron} rotate={90} />
    </div>
  </div>
);
