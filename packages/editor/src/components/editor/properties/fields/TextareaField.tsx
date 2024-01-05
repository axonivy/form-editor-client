import type { PrimitiveValue } from '../../../../types/config';

type TextareaFieldProps = {
  value?: PrimitiveValue;
  onChange: (value: string) => void;
};

export const TextareaField = ({ value, onChange }: TextareaFieldProps) => (
  <textarea value={(value ?? '') as string} onChange={e => onChange(e.target.value)} />
);
