import { Flex, Label, Input } from '@axonivy/ui-components';
import type { PrimitiveValue } from '../../../../types/config';

type InputFieldProps = {
  label: string;
  value?: PrimitiveValue;
  onChange: (value: string | number) => void;
};

export const NumberField = ({ label, value, onChange }: InputFieldProps) => {
  return (
    <Flex direction='column' gap={1}>
      <Label htmlFor='number'>{label}</Label>
      <Input id='number' type='number' value={(value ?? 0) as number} onChange={e => onChange(Number(e.target.value))} />
    </Flex>
  );
};
