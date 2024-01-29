import { useEffect, useState } from 'react';
import type { Field } from '../../../types/config';
import { useData } from '../../../context/useData';
import './PropertyItem.css';
import { InputField } from './fields/InputField';
import { CheckboxField } from './fields/CheckboxField';
import { TextareaField } from './fields/TextareaField';
import { SelectField } from './fields/SelectField';
import { NumberField } from './fields/NumberField';
import type { PrimitiveValue } from '@axonivy/form-editor-protocol';

type PropertyItemProps = {
  fieldName: string;
  field: Field;
};

const toString = (primitive?: PrimitiveValue) => `${primitive ?? ''}`;
const toNumber = (primitive?: PrimitiveValue) => Number(primitive ?? 0);
const toBoolean = (primitive?: PrimitiveValue) => Boolean(primitive ?? false);

export const PropertyItem = ({ fieldName, field }: PropertyItemProps) => {
  const { element, setElement } = useData();
  const [value, setValue] = useState<PrimitiveValue>();
  const onChange = (newValue: PrimitiveValue) => {
    setValue(newValue);
    if (element) {
      element.config[fieldName] = newValue;
      setElement(element);
    }
  };
  useEffect(() => {
    setValue(element ? element.config[fieldName] : '');
  }, [element, fieldName]);
  const inputFor = (field: Field, label: string) => {
    switch (field.type) {
      case 'text':
        return <InputField label={label} value={toString(value)} onChange={onChange} />;
      case 'number':
        return <NumberField label={label} value={toNumber(value)} onChange={onChange} />;
      case 'checkbox':
        return <CheckboxField label={label} value={toBoolean(value)} onChange={onChange} />;
      case 'textarea':
        return <TextareaField label={label} value={toString(value)} onChange={onChange} />;
      case 'select':
        return <SelectField options={field.options} label={label} value={toString(value)} onChange={onChange} />;
      default:
        return <p>unknown field type</p>;
    }
  };
  if (field.type === 'hidden') {
    return null;
  }
  return <div className='property-item'>{inputFor(field, field.label ? field.label : fieldName)}</div>;
};
