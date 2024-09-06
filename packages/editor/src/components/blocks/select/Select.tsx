import type { Prettify, Select } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Select.css';
import { baseComponentFields, defaultBaseComponent, selectItemsComponentFields } from '../base';
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
  subcategory: 'Selection',
  icon: <IconSvg />,
  description: 'A dropdown menu with label for selecting a single option',
  defaultProps: defaultInputProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
  outlineInfo: component => component.label,
  fields: {
    ...selectItemsComponentFields,
    ...baseComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
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
