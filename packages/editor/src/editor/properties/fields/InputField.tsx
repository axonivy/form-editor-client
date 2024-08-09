import { Fieldset, Input } from '@axonivy/ui-components';

export type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export const InputField = ({ label, value, onChange, onBlur }: InputFieldProps) => {
  return (
    <Fieldset label={label}>
      <Input value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} />
    </Fieldset>
  );
};
