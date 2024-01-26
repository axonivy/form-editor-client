import { Flex, Input, Label } from '@axonivy/ui-components';

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const InputField = ({ label, value, onChange }: InputFieldProps) => {
  return (
    <Flex direction='column' gap={1}>
      <Label htmlFor='input'>{label}</Label>
      <Input id='input' value={value} onChange={e => onChange(e.target.value)} />
    </Flex>
  );
};
