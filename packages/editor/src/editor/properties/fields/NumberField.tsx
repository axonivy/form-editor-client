import { Input, Fieldset } from '@axonivy/ui-components';

type InputFieldProps = {
  label: string;
  value: number;
  onChange: (value: string | number) => void;
};

export const NumberField = ({ label, value, onChange }: InputFieldProps) => (
  <Fieldset label={label}>
    <Input type='number' value={value} onChange={e => onChange(Number(e.target.value))} />
  </Fieldset>
);
