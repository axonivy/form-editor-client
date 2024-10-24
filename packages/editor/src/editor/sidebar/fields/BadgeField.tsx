import { BasicField, InputBadge, type BasicFieldProps } from '@axonivy/ui-components';
import { useEffect, useRef, useState } from 'react';
import { badgeProps } from '../../../utils/badge-properties';

export type BadgeFieldProps = BasicFieldProps & {
  value: string;
};

export const BadgeField = ({ value, label, children, message, ...props }: BadgeFieldProps) => {
  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);
  return (
    <BasicField
      onClick={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      label={label}
      style={{ flex: '1' }}
      message={message}
      {...props}
    >
      <div ref={inputRef} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}>
        {focus ? children : <InputBadge value={value} badgeProps={badgeProps} />}
      </div>
    </BasicField>
  );
};
