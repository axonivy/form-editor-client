import { Checkbox, Field, Label } from '@axonivy/ui-components';

type CheckboxFieldProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export const CheckboxField = ({ label, value, onChange }: CheckboxFieldProps) => (
  <Field direction='row' alignItems='center' gap={1}>
    <Checkbox checked={value} onCheckedChange={e => onChange(Boolean(e))} />
    <Label>{label}</Label>
  </Field>
);
