import type { SelectItem } from '@axonivy/form-editor-protocol';
import type { FieldOption, Fields, GenericFieldProps } from '../../types/config';
import { BasicField, Input } from '@axonivy/ui-components';
import { useAppContext } from '../../context/AppContext';
import { useValidation } from '../../context/useValidation';

type BaseComponentProps = { id: string; lgSpan: string; mdSpan: string };
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
type BehaviourItemProps = DisabledItemProps & { required: string; requiredMessage: string; updateOnChange: boolean };

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
  requiredMessage: '',
  updateOnChange: false
} as const;

export const defaultBaseComponent: BaseComponentProps = {
  id: '',
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
  id: { subsection: 'General', type: 'generic', label: 'Id', render: props => <IdInput {...props} /> },
  lgSpan: { section: 'Layout', subsection: 'General', type: 'select', label: 'Large Span', options: spanOptions },
  mdSpan: { section: 'Layout', subsection: 'General', type: 'select', label: 'Medium Span', options: spanOptions }
};

export const visibleComponentField: Fields<VisibleItemProps> = {
  visible: { subsection: 'Behaviour', label: 'Visible', type: 'textConditionBuilder' }
};

export const disabledComponentFields: Fields<DisabledItemProps> = {
  ...visibleComponentField,
  disabled: { subsection: 'Behaviour', label: 'Disable', type: 'textConditionBuilder' }
};

export const behaviourComponentFields: Fields<BehaviourItemProps> = {
  ...disabledComponentFields,
  required: { subsection: 'Behaviour', label: 'Required', type: 'textConditionBuilder' },
  requiredMessage: {
    subsection: 'Behaviour',
    label: 'Required Message',
    type: 'textBrowser',
    browsers: ['CMS'],
    hide: data => data.required.length === 0
  },
  updateOnChange: { subsection: 'Behaviour', label: 'Update Form on Change', type: 'checkbox' }
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

const IdInput = ({ label, onChange, value, validationPath }: GenericFieldProps) => {
  const { selectedElement } = useAppContext();
  const message = useValidation(validationPath);
  return (
    <BasicField label={label} message={message}>
      <Input value={value as string} onChange={e => onChange(e.target.value)} placeholder={selectedElement} />
    </BasicField>
  );
};
