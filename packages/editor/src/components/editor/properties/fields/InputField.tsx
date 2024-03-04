import { Fieldset, Input } from '@axonivy/ui-components';

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const InputField = ({ label, value, onChange }: InputFieldProps) => {
  return (
    <Fieldset label={label}>
      <Input value={value} onChange={e => onChange(e.target.value)} />
    </Fieldset>
  );
};
