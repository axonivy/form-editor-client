import { Fieldset, Textarea } from '@axonivy/ui-components';

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextareaField = ({ label, value, onChange }: TextareaFieldProps) => (
  <Fieldset label={label}>
    <Textarea value={value} onChange={e => onChange(e.target.value)} autoResize={true} />
  </Fieldset>
);
