import { Button, Dialog, DialogContent, DialogPortal, DialogTrigger, Fieldset, Input, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { Browser, BrowserType } from '../../browser/Browser';
import './Input.css';
import type { InputFieldProps } from '../../editor/properties/fields/InputField';

const supportedFields: { [value: string]: BrowserType[] } = {
  value: [BrowserType.Attribute]
};

export const InputWithBrowser = ({ label, value, onChange }: InputFieldProps) => {
  const [open, setOpen] = useState(false);
  //const triggerStyle: React.CSSProperties = browserTypes ? { visibility: 'visible' } : { visibility: 'collapse' }; // TODO: Decide on method to decide
  const triggerStyle: React.CSSProperties = Object.keys(supportedFields).includes(label)
    ? { visibility: 'visible' }
    : { visibility: 'collapse' };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Fieldset label={label}>
        <InputGroup>
          <Input value={value} onChange={e => onChange(e.target.value)} />
          <DialogTrigger asChild style={triggerStyle}>
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
            browserTypes={supportedFields[label]}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
