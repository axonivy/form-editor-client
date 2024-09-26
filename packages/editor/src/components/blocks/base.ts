import type { SelectItem } from '@axonivy/form-editor-protocol';
import type { FieldOption, Fields } from '../../types/config';

type BaseComponentProps = { lgSpan: string; mdSpan: string };
type SelectItemsProps = {
  label: string;
  value: string;
  staticItems: SelectItem[];
  dynamicItemsLabel: string;
  dynamicItemsList: string;
  dynamicItemsValue: string;
};
type VisibleItemProps = { visible: string };
type DisabledItemProps = VisibleItemProps & { disabled: string };
type BehaviourItemProps = DisabledItemProps & { required: string; requiredMessage: string };

export const defaultVisibleComponent: VisibleItemProps = {
  visible: ''
} as const;

export const defaultDisabledComponent: DisabledItemProps = {
  ...defaultVisibleComponent,
  disabled: ''
} as const;

export const defaultBehaviourComponent: BehaviourItemProps = {
  ...defaultDisabledComponent,
  required: '',
  requiredMessage: ''
} as const;

export const defaultBaseComponent: BaseComponentProps = {
  lgSpan: '6',
  mdSpan: '12'
} as const;

const spanOptions: FieldOption<string>[] = [
  { label: '1', value: '2' },
  { label: '2', value: '4' },
  { label: '3', value: '6' },
  { label: '4', value: '8' },
  { label: '5', value: '10' },
  { label: '6', value: '12' }
] as const;

export const baseComponentFields: Fields<BaseComponentProps> = {
  lgSpan: { section: 'Layout', subsection: 'General', type: 'select', label: 'Large Span', options: spanOptions },
  mdSpan: { section: 'Layout', subsection: 'General', type: 'select', label: 'Medium Span', options: spanOptions }
};

export const visibleComponentField: Fields<VisibleItemProps> = {
  visible: { subsection: 'Behaviour', label: 'Visible', type: 'textBrowser', browsers: ['ATTRIBUTE'] }
};

export const disabledComponentFields: Fields<DisabledItemProps> = {
  ...visibleComponentField,
  disabled: { subsection: 'Behaviour', label: 'Disable', type: 'textBrowser', browsers: ['ATTRIBUTE'] }
};

export const behaviourComponentFields: Fields<BehaviourItemProps> = {
  ...disabledComponentFields,
  required: { subsection: 'Behaviour', label: 'Required', type: 'textBrowser', browsers: ['ATTRIBUTE'] },
  requiredMessage: {
    subsection: 'Behaviour',
    label: 'Required Message',
    type: 'textBrowser',
    browsers: ['CMS'],
    hide: data => data.required.length === 0
  }
};

export const selectItemsComponentFields: Fields<SelectItemsProps> = {
  label: { subsection: 'General', label: 'Label', type: 'textBrowser', browsers: ['CMS'] },
  value: { subsection: 'General', label: 'Value', type: 'textBrowser', browsers: ['ATTRIBUTE'] },
  staticItems: { subsection: 'Static Options', label: 'Options', type: 'selectTable' },
  dynamicItemsList: {
    subsection: 'Dynamic Options',
    label: 'List of Objects',
    type: 'textBrowser',
    browsers: ['ATTRIBUTE'],
    options: { onlyTypesOf: 'List<', placeholder: 'e.g. #{data.dynamicList}' }
  },
  dynamicItemsLabel: {
    subsection: 'Dynamic Options',
    label: 'Object Label',
    type: 'textBrowser',
    browsers: ['ATTRIBUTE'],
    options: {
      onlyAttributes: 'DYNAMICLIST',
      placeholder: 'Enter attribute (or leave blank to select entire object)'
    },
    hide: data => data.dynamicItemsList.length == 0
  },
  dynamicItemsValue: {
    subsection: 'Dynamic Options',
    label: 'Object Value',
    type: 'textBrowser',
    browsers: ['ATTRIBUTE'],
    options: {
      onlyAttributes: 'DYNAMICLIST',
      placeholder: 'Enter attribute (or leave blank to select entire object)'
    },
    hide: data => data.dynamicItemsList.length == 0
  }
};
