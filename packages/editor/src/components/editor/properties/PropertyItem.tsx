import { useEffect, useState } from 'react';
import type { Field, PrimitiveValue } from '../../../types/config';
import { useData } from '../../../data/useData';
import './PropertyItem.css';
import { InputField } from './fields/InputField';
import { CheckboxField } from './fields/CheckboxField';
import { TextareaField } from './fields/TextareaField';
import { SelectField } from './fields/SelectField';
import { NumberField } from './fields/NumberField';

type PropertyItemProps = {
  fieldName: string;
  field: Field;
};

export const PropertyItem = ({ fieldName, field }: PropertyItemProps) => {
  const { element, setElement } = useData();
  const [value, setValue] = useState<PrimitiveValue>();
  const onChange = (newValue: PrimitiveValue) => {
    setValue(newValue);
    if (element) {
      element.props[fieldName] = newValue;
      setElement(element);
    }
  };
  useEffect(() => {
    setValue(element ? element.props[fieldName] : '');
  }, [element, fieldName]);
  const inputFor = (field: Field, label: string) => {
    switch (field.type) {
      case 'text':
        return <InputField label={label} value={value} onChange={onChange} />;
      case 'number':
        return <NumberField label={label} value={value} onChange={onChange} />;
      case 'checkbox':
        return <CheckboxField label={label} value={value} onChange={onChange} />;
      case 'textarea':
        return <TextareaField label={label} onChange={onChange} />;
      case 'select':
        return <SelectField field={field} label={label} value={value} onChange={onChange} />;
      default:
        return <p>unknown field type</p>;
    }
  };
  return <div className='property-item'>{inputFor(field, field.label ? field.label : fieldName)}</div>;
};
