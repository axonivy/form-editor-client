import { useState } from 'react';
import type { Field } from '../../types/config';
import { CheckboxField } from './fields/CheckboxField';
import { TextareaField } from './fields/TextareaField';
import { SelectField } from './fields/SelectField';
import { NumberField } from './fields/NumberField';
import type { PrimitiveValue, SelectItem } from '@axonivy/form-editor-protocol';
import { InputField } from './fields/InputField';
import { InputFieldWithBrowser } from './fields/InputFieldWithBrowser';
import { SelectTableField } from './fields/table-field/SelectTableField';

type PropertyItemProps = {
  value: PrimitiveValue;
  onChange: (change: PrimitiveValue) => void;
  field: Field;
};

const toString = (primitive?: PrimitiveValue) => `${primitive ?? ''}`;
const toNumber = (primitive?: PrimitiveValue) => Number(primitive ?? 0);
const toBoolean = (primitive?: PrimitiveValue) => Boolean(primitive ?? false);
const toSelectItems = (primitive?: PrimitiveValue): Array<SelectItem> => (Array.isArray(primitive) ? primitive : []);

export const PropertyItem = ({ value: initValue, onChange, field }: PropertyItemProps) => {
  const [value, setValue] = useState<PrimitiveValue>(initValue);
  const updateValue = (newValue: PrimitiveValue) => {
    setValue(newValue);
    onChange(newValue);
  };
  const inputFor = (field: Field) => {
    const label = field.label!;
    switch (field.type) {
      case 'text':
        return <InputField label={label} value={toString(value)} onChange={updateValue} options={field.options} />;
      case 'textBrowser':
        return <InputFieldWithBrowser label={label} value={toString(value)} onChange={updateValue} options={field.options} />;
      case 'selectTable':
        return <SelectTableField label={label} data={toSelectItems(value)} onChange={updateValue} />;
      case 'number':
        return <NumberField label={label} value={toNumber(value)} onChange={updateValue} />;
      case 'checkbox':
        return <CheckboxField label={label} value={toBoolean(value)} onChange={updateValue} />;
      case 'textarea':
        return <TextareaField label={label} value={toString(value)} onChange={updateValue} />;
      case 'select':
        return <SelectField label={label} value={toString(value)} onChange={updateValue} options={field.options} />;
      default:
        return <p>unknown field type</p>;
    }
  };
  if (field.type === 'hidden') {
    return null;
  }
  return <div className='property-item'>{inputFor(field)}</div>;
};
