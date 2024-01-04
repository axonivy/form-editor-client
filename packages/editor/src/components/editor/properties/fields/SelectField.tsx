import type { SelectField as Field } from '../../../components/component';

type SelectFieldProps = {
  field: Field;
  value: string;
  onChange: (value: string) => void;
};

export const SelectField = ({ field, value, onChange }: SelectFieldProps) => (
  <select value={value ?? ''} onChange={e => onChange(e.target.value)}>
    {field.options.map(option => (
      <option key={`${option.value}`} value={option.value as string | number}>
        {option.label}
      </option>
    ))}
  </select>
);
