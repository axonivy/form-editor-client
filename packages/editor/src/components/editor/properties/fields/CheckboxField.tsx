import { Checkbox, Flex, Label } from '@axonivy/ui-components';
import type { PrimitiveValue } from '../../../../types/config';

type CheckboxFieldProps = {
  label: string;
  value?: PrimitiveValue;
  onChange: (value: boolean) => void;
};

export const CheckboxField = ({ label, value, onChange }: CheckboxFieldProps) => (
  <Flex alignItems='center' gap={1}>
    <Checkbox id='checkbox' checked={(value ?? false) as boolean} onCheckedChange={e => onChange(Boolean(e))} />
    <Label htmlFor='checkbox'>{label}</Label>
  </Flex>
);
