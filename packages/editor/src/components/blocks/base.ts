import type { FieldOption, Fields } from '../../types/config';

type BaseComponentProps = { lgSpan: string; mdSpan: string };

export const defaultBaseComponent: BaseComponentProps = {
  lgSpan: '6',
  mdSpan: '12'
};

const spanOptions: FieldOption<string>[] = [
  { label: '1', value: '2' },
  { label: '2', value: '4' },
  { label: '3', value: '6' },
  { label: '4', value: '8' },
  { label: '5', value: '10' },
  { label: '6', value: '12' }
] as const;

export const baseComponentFields: Fields<BaseComponentProps> = {
  lgSpan: { type: 'select', label: 'Large Span', options: spanOptions, section: 'Layout' },
  mdSpan: { type: 'select', label: 'Medium Span', options: spanOptions, section: 'Layout' }
};
