import type { Field } from '../../../components/component';

type InputFieldProps = {
  field: Field;
  value: string | number;
  onChange: (value: string | number) => void;
};

export const InputField = ({ field, value, onChange }: InputFieldProps) => {
  const onInternalChange = (value: string) => (field.type === 'number' ? onChange(Number(value)) : onChange(value));
  return <input type={field.type} value={value} onChange={e => onInternalChange(e.target.value)} />;
};
