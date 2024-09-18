import { BasicField, Input } from '@axonivy/ui-components';
import type { TextFieldOptions } from '../../../types/config';

export type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export const InputField = ({ label, value, onChange, onBlur, options }: InputFieldProps & { options?: TextFieldOptions }) => (
  <BasicField label={label}>
    <Input value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} placeholder={options?.placeholder} />
  </BasicField>
);
