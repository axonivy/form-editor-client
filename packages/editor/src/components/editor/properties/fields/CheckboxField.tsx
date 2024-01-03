import type { Field } from '../../../components/component';

type CheckboxFieldProps = {
  field: Field;
  value: boolean;
  onChange: (value: boolean) => void;
};

export const CheckboxField = ({ field, value, onChange }: CheckboxFieldProps) => (
  <input type={field.type} checked={value} onChange={e => onChange(e.target.checked)} />
);
