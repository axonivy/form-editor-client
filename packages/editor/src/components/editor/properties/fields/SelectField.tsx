import { Flex, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@axonivy/ui-components';
import type { FieldOption } from '../../../../types/config';

type SelectFieldProps = {
  options: readonly FieldOption[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const SelectField = ({ options, label, value, onChange }: SelectFieldProps) => (
  <Flex direction='column' gap={1}>
    <Label htmlFor='select'>{label}</Label>
    <Select value={value} onValueChange={change => onChange(change)}>
      <SelectTrigger id='select'>
        <SelectValue placeholder='Select a option' />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={`${option.value}`} value={option.value as string}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </Flex>
);
