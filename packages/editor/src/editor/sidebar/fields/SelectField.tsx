import {
  BasicField,
  Flex,
  IvyIcon,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type MessageData
} from '@axonivy/ui-components';
import type { FieldOption } from '../../../types/config';

type SelectFieldProps = {
  options: readonly FieldOption[];
  label?: string;
  value: string;
  onChange: (value: string) => void;
  width?: string;
  message?: MessageData;
};

export const SelectField = ({ options, label, value, onChange, width, message }: SelectFieldProps) => (
  <BasicField label={label} message={message}>
    <Select value={value} onValueChange={change => onChange(change)}>
      <SelectTrigger style={{ whiteSpace: 'nowrap' }}>
        <SelectValue placeholder='Select an option' />
      </SelectTrigger>
      <SelectContent style={{ width: width }}>
        {options.map(option => (
          <SelectItem key={option.value.toString()} value={option.value as string}>
            <Flex direction='row' gap={2} alignItems='center'>
              {option.icon && <IvyIcon icon={option.icon.icon} rotate={option.icon.rotate} spin={option.icon.spin} />}
              {option.label}
            </Flex>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </BasicField>
);
