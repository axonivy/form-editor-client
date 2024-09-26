import type { Combobox, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Combobox.css';
import { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent } from '../base';
import IconSvg from './Combobox.svg?react';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBlockHeader } from '../../UiBlockHeader';

type ComboboxProps = Prettify<Combobox>;

export const defaultComboboxProps: Combobox = {
  label: 'Combobox',
  value: '',
  completeMethod: '',
  itemLabel: '',
  itemValue: '',
  withDropdown: false,
  ...defaultBehaviourComponent,
  ...defaultBaseComponent
} as const;

export const ComboboxComponent: ComponentConfig<ComboboxProps> = {
  name: 'Combobox',
  category: 'Elements',
  subcategory: 'Input',
  icon: <IconSvg />,
  description: 'A autocomplete combobox with label',
  defaultProps: defaultComboboxProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultComboboxProps, label, value, ...defaultProps }),
  outlineInfo: component => component.label,
  fields: {
    label: { subsection: 'General', label: 'Label', type: 'textBrowser', browsers: ['CMS'] },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser', browsers: ['ATTRIBUTE'] },
    completeMethod: { subsection: 'Options', label: 'Complete Method', type: 'textBrowser', browsers: ['LOGIC'] },
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
    ...behaviourComponentFields,
    ...baseComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ label, value, visible, required, disabled }: UiComponentProps<ComboboxProps>) => (
  <div className='block-input'>
    <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} />
    <div className='block-input__input'>
      <span>{value}</span>
      <IvyIcon icon={IvyIcons.Chevron} rotate={90} />
    </div>
  </div>
);
