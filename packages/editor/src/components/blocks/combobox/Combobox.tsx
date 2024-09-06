import type { Combobox, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
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
  itemLabel: '',
  itemValue: '',
  withDropdown: false,
  ...defaultBaseComponent
} as const;

export const ComboboxComponent: ComponentConfig<ComboboxProps> = {
  name: 'Combobox',
  category: 'Elements',
  subcategory: 'Input',
  icon: <IconSvg />,
  description: 'A autocomplete combobox with label',
  defaultProps: defaultInputProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
  outlineInfo: component => component.label,
  fields: {
    label: { subsection: 'General', label: 'Label', type: 'text' },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser' },
    completeMethod: { subsection: 'Options', label: 'Complete Method', type: 'text' },
    itemLabel: {
      subsection: 'Options',
      label: 'Item Label',
      type: 'text',
      hide: data => data.completeMethod.length === 0
    },
    itemValue: {
      subsection: 'Options',
      label: 'Item Value',
      type: 'text',
      hide: data => data.completeMethod.length === 0
    },
    withDropdown: { subsection: 'Options', label: 'Add Dropdown-Button to Combobox', type: 'checkbox' },
    ...baseComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
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
