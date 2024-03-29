import type { Prettify, Text, TextType } from '@axonivy/form-editor-protocol';
import type { ComponentConfig, FieldOption, UiComponentProps } from '../../../types/config';
import './Text.css';
import { baseComponentFields, defaultBaseComponent } from '../base';

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
  category: 'Basic',
  icon: 'M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z',
  description: 'Text output',
  defaultProps: defaultTextProps,
  render: props => <TextBlock {...props} />,
  fields: {
    content: { type: 'textarea' },
    type: { type: 'select', options: typeOptions },
    ...baseComponentFields
  }
};

const TextBlock = ({ content }: UiComponentProps<TextProps>) => <p className='block-text'>{content}</p>;
