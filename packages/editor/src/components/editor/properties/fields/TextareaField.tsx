import { Flex, Label, Textarea } from '@axonivy/ui-components';

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextareaField = ({ label, value, onChange }: TextareaFieldProps) => (
  <Flex direction='column' gap={1}>
    <Label htmlFor='textarea'>{label}</Label>
    <Textarea id='textarea' value={value} onChange={e => onChange(e.target.value)} autoResize={true} />
  </Flex>
);
