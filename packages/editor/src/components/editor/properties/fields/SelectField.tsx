import { Flex, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@axonivy/ui-components';
import type { SelectField as Field, PrimitiveValue } from '../../../../types/config';

type SelectFieldProps = {
  field: Field;
  label: string;
  value?: PrimitiveValue;
  onChange: (value: string) => void;
};

export const SelectField = ({ field, label, value, onChange }: SelectFieldProps) => (
  <Flex direction='column' gap={1}>
    <Label htmlFor='select'>{label}</Label>
    <Select value={(value ?? '') as string} onValueChange={change => onChange(change)}>
      <SelectTrigger id='select'>
        <SelectValue placeholder='Select a option' />
      </SelectTrigger>
      <SelectContent>
        {field.options.map(option => (
          <SelectItem key={`${option.value}`} value={option.value as string}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </Flex>
);
