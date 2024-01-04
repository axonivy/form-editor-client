import type { Field, PrimitiveValue } from '../../../../types/config';

type InputFieldProps = {
  field: Field;
  value?: PrimitiveValue;
  onChange: (value: string | number) => void;
};

export const InputField = ({ field, value, onChange }: InputFieldProps) => {
  return <input type={field.type} value={(value ?? '') as string} onChange={e => onChange(e.target.value)} />;
};
