import { Button, Dialog, DialogContent, DialogPortal, DialogTrigger, Fieldset, Input, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { Browser, BrowserType } from '../../browser/Browser';
import './Input.css';
import type { InputFieldProps } from '../../editor/properties/fields/InputField';

const supportedFields = (() => {
  const fields: { [value: string]: BrowserType[] } = {
    value: [BrowserType.Attribute],
    content: [BrowserType.Attribute],
    name: [BrowserType.Attribute]
  };

  return {
    get: (key: string) => fields[key.toLowerCase()] ?? []
  };
})();

export const InputWithBrowser = ({ label, value, onChange }: InputFieldProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Fieldset label={label}>
        <InputGroup>
          <Input value={value} onChange={e => onChange(e.target.value)} />
          <DialogTrigger asChild>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </InputGroup>
      </Fieldset>
      <DialogPortal container={document.getElementById('properties')}>
        <DialogContent style={{ height: '80vh' }}>
          <Browser
            applyFn={value => {
              if (value) onChange(value);
              setOpen(false);
            }}
            browserTypes={supportedFields.get(label)}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
