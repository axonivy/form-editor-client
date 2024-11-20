import type { Checkbox, Prettify } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import './Checkbox.css';
import { baseComponentFields, defaultBaseComponent, defaultDisabledComponent, disabledComponentFields } from '../base';
import IconSvg from './Checkbox.svg?react';
import { Flex, IvyIcon } from '@axonivy/ui-components';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { IvyIcons } from '@axonivy/ui-icons';

type CheckboxProps = Prettify<Checkbox>;

export const defaultCheckboxProps: Checkbox = {
  label: 'Label',
  selected: 'true',
  ...defaultDisabledComponent,
  updateOnChange: false,
  ...defaultBaseComponent
} as const;

export const CheckboxComponent: ComponentConfig<CheckboxProps> = {
  name: 'Checkbox',
  category: 'Elements',
  subcategory: 'Selection',
  icon: <IconSvg />,
  description: 'A selectable boolean checkbox',
  defaultProps: defaultCheckboxProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultCheckboxProps, label, selected: value, ...defaultProps }),
  outlineInfo: component => component.label,
  fields: {
    ...baseComponentFields,
    label: { subsection: 'General', label: 'Label', type: 'textBrowser', browsers: ['CMS'] },
    selected: { subsection: 'General', label: 'Selected', type: 'textBrowser', browsers: ['ATTRIBUTE'] },
    ...disabledComponentFields,
    updateOnChange: { subsection: 'Behaviour', label: 'Update Form on Change', type: 'checkbox' }
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ label, selected, visible, disabled, updateOnChange }: UiComponentProps<CheckboxProps>) => (
  <>
    <UiBlockHeader visible={visible} disabled={disabled} updateOnChange={updateOnChange} />
    <Flex direction='row' gap={1} className='block-checkbox'>
      <div className={`checkbox-button ${selected.toLowerCase() !== 'false' && 'checkbox-checked'}`}>
        {selected.toLowerCase() !== 'false' && <IvyIcon icon={IvyIcons.Check} className='checkbox-icon' />}
      </div>
      <UiBadge value={label} />
    </Flex>
  </>
);
