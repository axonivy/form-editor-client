import { Flex, Input, Label } from '@axonivy/ui-components';
import type { PrimitiveValue } from '../../../../types/config';

type InputFieldProps = {
  label: string;
  value?: PrimitiveValue;
  onChange: (value: string | number) => void;
};

export const InputField = ({ label, value, onChange }: InputFieldProps) => {
  return (
    <Flex direction='column' gap={1}>
      <Label htmlFor='input'>{label}</Label>
      <Input id='input' value={(value ?? '') as string} onChange={e => onChange(e.target.value)} />
    </Flex>
  );
};
