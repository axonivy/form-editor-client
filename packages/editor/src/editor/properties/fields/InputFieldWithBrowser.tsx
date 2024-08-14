import { BrowsersView, Button, Dialog, DialogContent, DialogTrigger, Fieldset, Input, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useAttributeBrowser } from './browser/useAttributeBrowser';
import type { InputFieldProps } from './InputField';
import type { TextBrowserFieldOptions } from '../../../types/config';

export const InputFieldWithBrowser = ({
  label,
  value,
  onChange,
  onBlur,
  options
}: InputFieldProps & { options?: TextBrowserFieldOptions }) => {
  const [open, setOpen] = useState(false);
  const attrBrowser = useAttributeBrowser(!!options?.displayOnlyListTypes);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Fieldset label={label}>
        <InputGroup>
          <Input value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} placeholder={options?.placeholder} />
          <DialogTrigger asChild>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </InputGroup>
      </Fieldset>
      <DialogContent style={{ height: '80vh' }}>
        <BrowsersView
          browsers={[attrBrowser]}
          apply={(browserName, result) => {
            if (result) {
              onChange(`#{${result.value}}`);
            }
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
