import { Input, BasicField } from '@axonivy/ui-components';

type InputFieldProps = {
  label: string;
  value: number;
  onChange: (value: string | number) => void;
};

export const NumberField = ({ label, value, onChange }: InputFieldProps) => (
  <BasicField label={label}>
    <Input type='number' value={value} onChange={e => onChange(Number(e.target.value))} />
  </BasicField>
);
