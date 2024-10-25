import type { Prettify, Text, TextType } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Text.css';
import { baseComponentFields, defaultBaseComponent, defaultVisibleComponent, visibleComponentField } from '../base';
import IconSvg from './Text.svg?react';
import { IvyIcons } from '@axonivy/ui-icons';
import { IvyIcon } from '@axonivy/ui-components';
import { UiBlockHeader } from '../../UiBlockHeader';

type TextProps = Prettify<Text>;

const typeOptions: FieldOption<TextType>[] = [
  { label: 'Text', value: 'RAW' },
  { label: 'Markdown', value: 'MARKDOWN' }
] as const;

export const defaultTextProps: TextProps = {
  icon: '',
  content: 'This is a text',
  type: 'RAW',
  iconStyle: 'INLINE',
  ...defaultVisibleComponent,
  ...defaultBaseComponent
} as const;

export const TextComponent: ComponentConfig<TextProps> = {
  name: 'Text',
  category: 'Elements',
  subcategory: 'Text',
  icon: <IconSvg />,
  description: 'Text output',
  defaultProps: defaultTextProps,
  render: props => <UiBlock {...props} />,
  create: ({ value }) => ({ ...defaultTextProps, content: value }),
  outlineInfo: component => component.content,
  fields: {
    ...baseComponentFields,
    content: { subsection: 'General', label: 'Content', type: 'textarea' },
    type: { subsection: 'General', label: 'Type', type: 'select', options: typeOptions },
    icon: { subsection: 'Icon', label: 'Icon', type: 'hidden' },
    iconStyle: { subsection: 'Icon', label: 'Icon style', type: 'hidden' },
    ...visibleComponentField
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ content, icon, iconStyle, visible }: UiComponentProps<TextProps>) => {
  if (icon && iconStyle == 'BLOCK') {
    return (
      <div className='text-icon-wrapper'>
        <IvyIcon icon={IvyIcons.InfoCircle} />
        <p className='block-text'>{content}</p>
      </div>
    );
  }
  return (
    <>
      <UiBlockHeader visible={visible} />
      <p className='block-text'>
        {icon && <IvyIcon icon={IvyIcons.InfoCircle} />}
        {content}
      </p>
    </>
  );
};
