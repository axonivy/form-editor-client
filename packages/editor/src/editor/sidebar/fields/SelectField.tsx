import { BasicField, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@axonivy/ui-components';
import type { FieldOption } from '../../../types/config';

type SelectFieldProps = {
  options: readonly FieldOption[];
  label?: string;
  value: string;
  onChange: (value: string) => void;
  width?: string;
};

export const SelectField = ({ options, label, value, onChange, width }: SelectFieldProps) => (
  <BasicField label={label}>
    <Select value={value} onValueChange={change => onChange(change)}>
      <SelectTrigger style={{ whiteSpace: 'nowrap' }}>
        <SelectValue placeholder='Select an option' />
      </SelectTrigger>
      <SelectContent style={{ width: width }}>
        {options.map(option => (
          <SelectItem key={`${option.value}`} value={option.value as string}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </BasicField>
);
