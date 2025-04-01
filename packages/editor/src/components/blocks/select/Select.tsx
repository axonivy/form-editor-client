import type { Prettify, Select } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Select.css';
import { useBase } from '../base';
import IconSvg from './Select.svg?react';
import { IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';

export const useSelectComponent = () => {
  const { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent, selectItemsComponentFields } =
    useBase();
  type SelectProps = Prettify<Select>;

  const defaultInputProps: Select = {
    label: 'Select',
    value: '',
    staticItems: [],
    dynamicItemsList: '',
    dynamicItemsLabel: '',
    dynamicItemsValue: '',
    ...defaultBehaviourComponent,
    ...defaultBaseComponent
  } as const;

  const SelectComponent: ComponentConfig<SelectProps> = {
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
      ...baseComponentFields,
      ...selectItemsComponentFields,
      ...behaviourComponentFields
    },
    quickActions: DEFAULT_QUICK_ACTIONS
  };

  const UiBlock = ({ label, value, visible, required, disabled, updateOnChange }: UiComponentProps<SelectProps>) => (
    <div className='block-input'>
      <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
      <div className='block-input__input'>
        <UiBadge value={value} />
        <IvyIcon icon={IvyIcons.Chevron} rotate={90} />
      </div>
    </div>
  );

  return {
    defaultInputProps,
    SelectComponent
  };
};
