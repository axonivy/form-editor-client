import { Checkbox, Flex, Label } from '@axonivy/ui-components';

type CheckboxFieldProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export const CheckboxField = ({ label, value, onChange }: CheckboxFieldProps) => (
  <Flex alignItems='center' gap={1}>
    <Checkbox id='checkbox' checked={value} onCheckedChange={e => onChange(Boolean(e))} />
    <Label htmlFor='checkbox'>{label}</Label>
  </Flex>
);
