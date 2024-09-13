import type { Prettify, Text, TextIconStyle, TextType } from '@axonivy/form-editor-protocol';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import './Text.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Text.svg?react';
import { IvyIcons } from '@axonivy/ui-icons';
import { IvyIcon } from '@axonivy/ui-components';

type TextProps = Prettify<Text>;

const typeOptions: FieldOption<TextType>[] = [
  { label: 'Text', value: 'RAW' },
  { label: 'Markdown', value: 'MARKDOWN' }
] as const;

const iconOptions: FieldOption<TextIconStyle>[] = [
  { label: 'Inline', value: 'INLINE' },
  { label: 'Block', value: 'BLOCK' }
];

export const defaultTextProps: TextProps = {
  icon: '',
  content: 'This is a text',
  type: 'RAW',
  iconStyle: 'INLINE',
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
    content: { subsection: 'General', label: 'Content', type: 'textarea' },
    type: { subsection: 'General', label: 'Type', type: 'select', options: typeOptions },
    icon: { subsection: 'Icon', label: 'Icon', type: 'text' },
    iconStyle: { subsection: 'Icon', label: 'Icon style', type: 'select', options: iconOptions },
    ...baseComponentFields
  },
  quickActions: DEFAULT_QUICK_ACTIONS
};

const UiBlock = ({ content, icon, iconStyle }: UiComponentProps<TextProps>) => {
  if (icon && iconStyle == 'BLOCK') {
    return (
      <div className='text-icon-wrapper'>
        <IvyIcon icon={IvyIcons.InfoCircle} />
        <p className='block-text'>{content}</p>
      </div>
    );
  }
  return (
    <p className='block-text'>
      {icon && <IvyIcon icon={IvyIcons.InfoCircle} />}
      {content}
    </p>
  );
};
