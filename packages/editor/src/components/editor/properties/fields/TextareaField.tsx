type TextareaFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export const TextareaField = ({ value, onChange }: TextareaFieldProps) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} />
);
