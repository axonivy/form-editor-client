import { BasicField, Button, Dialog, DialogContent, DialogTrigger, Input, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import type { InputFieldProps } from '../InputField';
import type { TextBrowserFieldOptions } from '../../../../types/config';
import { ConditionBuilder } from './ConditionBuilder';
import { ConditionBuilderProvider } from './ConditionBuilderContext';

export const InputFieldWithConditionBuilder = ({
  label,
  value,
  onChange,
  onBlur,
  message,
  options
}: InputFieldProps & { options?: TextBrowserFieldOptions }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message}>
        <InputGroup>
          <Input value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} placeholder={options?.placeholder} />
          <DialogTrigger asChild title='Open Condition-Builder'>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </InputGroup>
      </BasicField>
      <DialogContent style={{ height: '80vh', maxWidth: '600px' }}>
        <ConditionBuilderProvider>
          <ConditionBuilder onChange={onChange} apply={() => setOpen(false)} />
        </ConditionBuilderProvider>
      </DialogContent>
    </Dialog>
  );
};
