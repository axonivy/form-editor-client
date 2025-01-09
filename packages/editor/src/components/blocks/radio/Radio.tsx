import type { Prettify, Radio, OrientationType } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Radio.css';
import {
  baseComponentFields,
  behaviourComponentFields,
  defaultBaseComponent,
  defaultBehaviourComponent,
  selectItemsComponentFields
} from '../base';
import IconSvg from './Radio.svg?react';
import { Flex, Message } from '@axonivy/ui-components';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';

type RadioProps = Prettify<Radio>;

const orientationOptions: FieldOption<OrientationType>[] = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' }
] as const;

export const defaultInputProps: Radio = {
  label: 'Radio',
  orientation: 'horizontal',
  value: '',
  staticItems: [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' }
  ],
  dynamicItemsList: '',
  dynamicItemsLabel: '',
  dynamicItemsValue: '',
  ...defaultBehaviourComponent,
  ...defaultBaseComponent
} as const;

export const RadioComponent: ComponentConfig<RadioProps> = {
  name: 'Radio',
  category: 'Elements',
  subcategory: 'Selection',
  icon: <IconSvg />,
  description: 'A radio button group with label for selecting a single option',
  defaultProps: defaultInputProps,
  render: props => <UiBlock {...props} />,
  create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
  outlineInfo: component => component.label,
  fields: {
    ...baseComponentFields,
    ...selectItemsComponentFields,
    orientation: { subsection: 'General', label: 'Orientation', type: 'select', options: orientationOptions },
    ...behaviourComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({
  label,
  staticItems,
  dynamicItemsList,
  orientation,
  visible,
  required,
  disabled,
  updateOnChange
}: UiComponentProps<RadioProps>) => (
  <div className='block-radio'>
    <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
    <Flex
      gap={orientation === 'horizontal' ? 4 : 2}
      direction={orientation === 'horizontal' ? 'row' : 'column'}
      className='block-radio__items'
    >
      {staticItems.map(item => (
        <RadioItem key={item.value} label={item.label} />
      ))}
      {dynamicItemsList !== '' && <RadioItem label={dynamicItemsList} />}
    </Flex>
    {staticItems.length === 0 && dynamicItemsList === '' && <Message variant='warning' message='No Options defined' />}
  </div>
);

const RadioItem = ({ label }: { label: string }) => (
  <Flex direction='row' alignItems='center' gap={2} className='block-radio__item'>
    <div className='block-radio__item-indicator' />
    <UiBadge value={label} />
  </Flex>
);
