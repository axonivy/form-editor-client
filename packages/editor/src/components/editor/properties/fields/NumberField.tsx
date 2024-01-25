import { Flex, Label, Input } from '@axonivy/ui-components';

type InputFieldProps = {
  label: string;
  value: number;
  onChange: (value: string | number) => void;
};

export const NumberField = ({ label, value, onChange }: InputFieldProps) => {
  return (
    <Flex direction='column' gap={1}>
      <Label htmlFor='number'>{label}</Label>
      <Input id='number' type='number' value={value} onChange={e => onChange(Number(e.target.value))} />
    </Flex>
  );
};
