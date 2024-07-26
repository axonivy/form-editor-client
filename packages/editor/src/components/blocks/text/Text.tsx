import type { Prettify, Text, TextType } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, FieldOption, UiComponentProps } from '../../../types/config';
import './Text.css';
import { baseComponentFields, defaultBaseComponent } from '../base';
import IconSvg from './Text.svg?react';

type TextProps = Prettify<Text>;

const typeOptions: FieldOption<TextType>[] = [
  { label: 'Text', value: 'RAW' },
  { label: 'Markdown', value: 'MARKDOWN' }
] as const;

export const defaultTextProps: TextProps = {
  content: 'This is a text',
  type: 'RAW',
  ...defaultBaseComponent
} as const;

export const TextComponent: ComponentConfig<TextProps> = {
  name: 'Text',
  category: 'Elements',
  subcategory: 'Text',
  icon: <IconSvg />,
  description: 'Text output',
  defaultProps: defaultTextProps,
  render: props => <TextBlock {...props} />,
  create: ({ value }) => ({ ...defaultTextProps, content: value }),
  fields: {
    content: { subsection: 'General', label: 'Content', type: 'textarea' },
    type: { subsection: 'General', label: 'Type', type: 'select', options: typeOptions },
    ...baseComponentFields
  }
};

const TextBlock = ({ content }: UiComponentProps<TextProps>) => <p className='block-text'>{content}</p>;
