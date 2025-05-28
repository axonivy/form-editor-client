import type { Prettify, Radio, OrientationType } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Radio.css';
import { useBase } from '../base';
import IconSvg from './Radio.svg?react';
import { Flex, Message } from '@axonivy/ui-components';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type RadioProps = Prettify<Radio>;

export const useRadioComponent = () => {
  const { baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent, selectItemsComponentFields } =
    useBase();
  const { t } = useTranslation();

  const RadioComponent = useMemo(() => {
    const orientationOptions: FieldOption<OrientationType>[] = [
      { label: t('property.horizontal'), value: 'horizontal' },
      { label: t('property.vertical'), value: 'vertical' }
    ] as const;

    const defaultInputProps: Radio = {
      label: t('components.radio.name'),
      orientation: 'horizontal',
      value: '',
      staticItems: [
        { label: t('property.option1'), value: 'Option 1' },
        { label: t('property.option2'), value: 'Option 2' }
      ],
      dynamicItemsList: '',
      dynamicItemsLabel: '#{item}',
      dynamicItemsValue: '#{item}',
      ...defaultBehaviourComponent,
      ...defaultBaseComponent
    } as const;

    const RadioComponent: ComponentConfig<RadioProps> = {
      name: 'Radio',
      displayName: t('components.radio.name'),
      category: 'Elements',
      subcategory: 'Selection',
      icon: <IconSvg />,
      description: t('components.radio.description'),
      defaultProps: defaultInputProps,
      render: props => <UiBlock {...props} />,
      create: ({ label, value, ...defaultProps }) => ({ ...defaultInputProps, label, value, ...defaultProps }),
      outlineInfo: component => component.label,
      fields: {
        ...baseComponentFields,
        ...selectItemsComponentFields,
        orientation: {
          subsection: 'General',
          label: t('components.radio.property.orientation'),
          type: 'select',
          options: orientationOptions
        },
        ...behaviourComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return RadioComponent;
  }, [baseComponentFields, behaviourComponentFields, defaultBaseComponent, defaultBehaviourComponent, selectItemsComponentFields, t]);

  return {
    RadioComponent
  };
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
}: UiComponentProps<RadioProps>) => {
  const { t } = useTranslation();
  return (
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
      {staticItems.length === 0 && dynamicItemsList === '' && <Message variant='warning' message={t('message.noOptionsDefined')} />}
    </div>
  );
};

const RadioItem = ({ label }: { label: string }) => (
  <Flex direction='row' alignItems='center' gap={2} className='block-radio__item'>
    <div className='block-radio__item-indicator' />
    <UiBadge value={label} />
  </Flex>
);
