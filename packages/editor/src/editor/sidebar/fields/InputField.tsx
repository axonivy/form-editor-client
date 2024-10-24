import { BasicField, Input, InputBadge, type MessageData } from '@axonivy/ui-components';
import type { TextFieldOptions } from '../../../types/config';
import { useOnFocus } from '../../../context/useOnFocus';
import { badgeProps } from '../../../utils/badge-properties';

export type InputFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  message?: MessageData;
};

export const InputField = ({ label, value, onChange, onBlur, message, options }: InputFieldProps & { options?: TextFieldOptions }) => {
  const { isFocusWithin, focusWithinProps } = useOnFocus(value, onChange);
  return (
    <BasicField label={label} message={message} {...focusWithinProps} className='badge-field' tabIndex={0}>
      {isFocusWithin ? (
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={options?.placeholder}
          disabled={options?.disabled}
        />
      ) : (
        <InputBadge value={value ?? ''} badgeProps={badgeProps} style={{ height: 15 }} />
      )}
    </BasicField>
  );
};
