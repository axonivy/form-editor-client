import type { Field, PrimitiveValue } from '../../../../types/config';

type CheckboxFieldProps = {
  field: Field;
  value?: PrimitiveValue;
  onChange: (value: boolean) => void;
};

export const CheckboxField = ({ field, value, onChange }: CheckboxFieldProps) => (
  <input type={field.type} checked={(value ?? false) as boolean} onChange={e => onChange(e.target.checked)} />
);
