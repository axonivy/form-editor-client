import { Flex, Label, Textarea } from '@axonivy/ui-components';
import type { PrimitiveValue } from '../../../../types/config';

type TextareaFieldProps = {
  label: string;
  value?: PrimitiveValue;
  onChange: (value: string) => void;
};

export const TextareaField = ({ label, value, onChange }: TextareaFieldProps) => (
  <Flex direction='column' gap={1}>
    <Label htmlFor='textarea'>{label}</Label>
    <Textarea id='textarea' value={(value ?? '') as string} onChange={e => onChange(e.target.value)} autoResize={true} />
  </Flex>
);
