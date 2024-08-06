import type { Checkbox, Prettify } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, UiComponentProps } from '../../../types/config';
import './Checkbox.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Checkbox.svg?react';
import { BasicCheckbox } from '@axonivy/ui-components';

type CheckboxProps = Prettify<Checkbox>;

export const defaultCheckboxProps: Checkbox = {
  label: 'Label',
  selected: 'false',
  ...defaultBaseComponent
} as const;

export const CheckboxComponent: ComponentConfig<CheckboxProps> = {
  name: 'Checkbox',
  category: 'Elements',
  subcategory: 'Interactions',
  icon: <IconSvg />,
  description: 'A selectable boolean checkbox',
  defaultProps: defaultCheckboxProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultCheckboxProps, label, selected: value, ...defaultProps }),
  fields: {
    label: { subsection: 'General', label: 'Label', type: 'text' },
    selected: { subsection: 'General', label: 'Selected', type: 'textBrowser' },
    ...baseComponentFields
  }
};

const UiBlock = ({ label }: UiComponentProps<CheckboxProps>) => (
  <div className='block-checkbox'>
    <BasicCheckbox label={label} checked={true} />
  </div>
);
