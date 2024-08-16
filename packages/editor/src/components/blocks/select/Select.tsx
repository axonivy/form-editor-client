import type { Prettify, Select } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './Select.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Select.svg?react';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

type SelectProps = Prettify<Select>;

export const defaultInputProps: Select = {
  label: 'Label',
  value: '',
  staticItems: [],
  dynamicItemsList: '',
  dynamicItemsLabel: '',
  dynamicItemsValue: '',
  ...defaultBaseComponent
} as const;

export const SelectComponent: ComponentConfig<SelectProps> = {
  name: 'Select',
  category: 'Elements',
  subcategory: 'Interactions',
  icon: <IconSvg />,
  description: 'A simple input with a label',
  defaultProps: defaultInputProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
  fields: {
    label: { subsection: 'General', label: 'Label', type: 'text' },
    value: { subsection: 'General', label: 'Value', type: 'textBrowser' },
    staticItems: { subsection: 'Static Options', label: '', type: 'selectTable' },
    dynamicItemsList: {
      subsection: 'Dynamic Options',
      label: 'List of Objects',
      type: 'textBrowser',
      options: { onlyListTypes: true, placeholder: 'e.g. #{data.dynamicList}' }
    },
    dynamicItemsLabel: {
      subsection: 'Dynamic Options',
      label: 'Object Label',
      type: 'textBrowser',
      options: { onlyAttributes: true, placeholder: 'Enter attribute (or leave blank to select entire object)' },
      hide: data => data.dynamicItemsList.length == 0
    },
    dynamicItemsValue: {
      subsection: 'Dynamic Options',
      label: 'Object Value',
      type: 'textBrowser',
      options: { onlyAttributes: true, placeholder: 'Enter attribute (or leave blank to select entire object)' },
      hide: data => data.dynamicItemsList.length == 0
    },
    ...baseComponentFields
  }
};

const UiBlock = ({ label, value }: UiComponentProps<SelectProps>) => (
  <div className='block-input'>
    <span className='block-input__label'>{label}</span>
    <div className='block-input__input'>
      <span>{value}</span>
      <IvyIcon icon={IvyIcons.Chevron} rotate={90} />
    </div>
  </div>
);
