import { useMemo, useState } from 'react';
import { useFocusWithin } from 'react-aria';

export const useOnFocus = (initialValue: string, onChange: (change: string) => void) => {
  const [isFocusWithin, setFocusWithin] = useState(false);
  const focusValue = useMemo(() => initialValue, [initialValue]);
  const { focusWithinProps } = useFocusWithin({ onFocusWithinChange: setFocusWithin, onBlurWithin: () => onChange(focusValue) });
  return { isFocusWithin, focusWithinProps };
};
