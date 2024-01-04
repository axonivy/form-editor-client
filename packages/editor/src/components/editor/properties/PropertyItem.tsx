/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import type { Field } from '../../components/component';
import { useData } from '../../data/useData';
import './PropertyItem.css';
import { InputField } from './fields/InputField';
import { CheckboxField } from './fields/CheckboxField';
import { TextareaField } from './fields/TextareaField';
import { SelectField } from './fields/SelectField';

type PropertyItemProps = {
  fieldName: string;
  field: Field;
};

export const PropertyItem = ({ fieldName, field }: PropertyItemProps) => {
  const { element, setElement } = useData();
  const [value, setValue] = useState<any>();
  const onChange = (newValue: any) => {
    setValue(newValue);
    if (element) {
      element.props[fieldName] = newValue;
      setElement(element);
    }
  };
  useEffect(() => {
    setValue(element ? element.props[fieldName] : '');
  }, [element, fieldName]);
  const inputFor = (field: Field) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return <InputField field={field} value={value ?? ''} onChange={onChange} />;
      case 'checkbox':
        return <CheckboxField field={field} value={value ?? false} onChange={onChange} />;
      case 'textarea':
        return <TextareaField value={value ?? ''} onChange={onChange} />;
      case 'select':
        return <SelectField field={field} value={value} onChange={onChange} />;
      default:
        return <p>unknown field type</p>;
    }
  };
  return (
    <div className='property-item'>
      <label>
        <span>{field.label ? field.label : fieldName}</span>
        {inputFor(field)}
      </label>
    </div>
  );
};
