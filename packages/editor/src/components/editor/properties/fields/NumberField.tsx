import type { Field, PrimitiveValue } from '../../../../types/config';

type InputFieldProps = {
  field: Field;
  value?: PrimitiveValue;
  onChange: (value: string | number) => void;
};

export const NumberField = ({ field, value, onChange }: InputFieldProps) => {
  return <input type={field.type} value={(value ?? 0) as number} onChange={e => onChange(Number(e.target.value))} />;
};
