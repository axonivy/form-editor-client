import type { SelectField as Field, PrimitiveValue } from '../../../../types/config';

type SelectFieldProps = {
  field: Field;
  value?: PrimitiveValue;
  onChange: (value: string) => void;
};

export const SelectField = ({ field, value, onChange }: SelectFieldProps) => (
  <select value={(value ?? '') as string} onChange={e => onChange(e.target.value)}>
    {field.options.map(option => (
      <option key={`${option.value}`} value={option.value as string | number}>
        {option.label}
      </option>
    ))}
  </select>
);
