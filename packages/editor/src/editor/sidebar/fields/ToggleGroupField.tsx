import { BasicField, Button, ToggleGroup, ToggleGroupItem, type MessageData } from '@axonivy/ui-components';
import type { FieldOption } from '../../../types/config';

type SelectFieldProps = {
  options: readonly FieldOption[];
  label?: string;
  value: string;
  onChange: (value: string) => void;
  message?: MessageData;
};

export const ToggleGroupField = ({ options, label, value, onChange, message }: SelectFieldProps) => (
  <BasicField label={label} message={message}>
    <ToggleGroup type='single' defaultValue={value} onValueChange={change => onChange(change)} gap={1} title={label}>
      {options.map(option => (
        <ToggleGroupItem key={option.value.toString()} value={option.value.toString()} asChild>
          <Button
            type='button'
            icon={option.icon?.icon}
            rotate={option.icon?.rotate}
            size='large'
            aria-label={option.label}
            title={option.label}
          />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  </BasicField>
);
