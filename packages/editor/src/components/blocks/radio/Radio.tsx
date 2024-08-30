import type { Prettify, Radio, OrientationType } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, FieldOption, UiComponentProps } from '../../../types/config';
import './Radio.css';
import { baseComponentFields, defaultBaseComponent, selectItemsComponentFields } from '../base';
import IconSvg from './Radio.svg?react';
import { Field, Label, Message, RadioGroup, RadioGroupItem } from '@axonivy/ui-components';

type RadioProps = Prettify<Radio>;

const orientationOptions: FieldOption<OrientationType>[] = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' }
] as const;

export const defaultInputProps: Radio = {
  label: 'Label',
  orientation: 'horizontal',
  value: '',
  staticItems: [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' }
  ],
  dynamicItemsList: '',
  dynamicItemsLabel: '',
  dynamicItemsValue: '',
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
    ...selectItemsComponentFields,
    orientation: { subsection: 'General', label: 'Orientation', type: 'select', options: orientationOptions },
    ...baseComponentFields
  }
};

const UiBlock = ({ label, staticItems, dynamicItemsList, orientation }: UiComponentProps<RadioProps>) => (
  <div className='block-radio'>
    <span className='block-radio-label'>{label}</span>
    <RadioGroup
      defaultValue={staticItems.length > 0 ? staticItems[0].value : dynamicItemsList !== '' ? dynamicItemsList : 'No Options defined'}
      orientation={orientation}
    >
      {staticItems.map(item => (
        <Field key={item.value} direction='row' alignItems='center' gap={2}>
          <RadioGroupItem value={item.value} />
          <Label>{item.label}</Label>
        </Field>
      ))}
      {dynamicItemsList !== '' && (
        <Field direction='row' alignItems='center' gap={2}>
          <RadioGroupItem value={dynamicItemsList} />
          <Label>{dynamicItemsList}</Label>
        </Field>
      )}
    </RadioGroup>
    {staticItems.length === 0 && dynamicItemsList === '' && <Message variant='warning' message='No Options defined' />}
  </div>
);
