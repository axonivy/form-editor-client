import { BasicField, Button, Dialog, DialogContent, DialogTrigger, Input, InputBadge, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import type { InputFieldProps } from '../InputField';
import type { TextBrowserFieldOptions } from '../../../../types/config';
import { ConditionBuilder } from './ConditionBuilder';
import { ConditionBuilderProvider } from './ConditionBuilderContext';
import { useOnFocus } from '../../../../context/useOnFocus';
import { badgeProps } from '../../../../utils/badge-properties';

export const InputFieldWithConditionBuilder = ({
  label,
  value,
  onChange,
  onBlur,
  message,
  options
}: InputFieldProps & { options?: TextBrowserFieldOptions }) => {
  const [open, setOpen] = useState(false);
  const { isFocusWithin, focusWithinProps } = useOnFocus(value, onChange);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message} className='badge-field' tabIndex={0} {...focusWithinProps}>
        {isFocusWithin ? (
          <InputGroup>
            <Input value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} placeholder={options?.placeholder} />
            <DialogTrigger asChild title='Open Condition-Builder'>
              <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
            </DialogTrigger>
          </InputGroup>
        ) : (
          <InputBadge style={{ height: 15 }} value={value ?? ''} badgeProps={badgeProps} />
        )}
      </BasicField>
      <DialogContent style={{ height: '80vh', maxWidth: '600px' }}>
        <ConditionBuilderProvider>
          <ConditionBuilder onChange={onChange} apply={() => setOpen(false)} />
        </ConditionBuilderProvider>
      </DialogContent>
    </Dialog>
  );
};
