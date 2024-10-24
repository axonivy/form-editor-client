import { BasicField, Button, Dialog, DialogContent, DialogTrigger, Input, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState } from 'react';
import type { InputFieldProps } from './InputField';
import type { TextBrowserFieldOptions } from '../../../types/config';
import { focusBracketContent } from '../../../utils/focus';
import { Browser, type BrowserType } from '../../browser/Browser';

export const InputFieldWithBrowser = ({
  label,
  value,
  onChange,
  browsers,
  onBlur,
  message,
  options
}: InputFieldProps & { browsers: Array<BrowserType>; options?: TextBrowserFieldOptions }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message} style={{ flex: '1' }}>
        <InputGroup>
          <Input ref={inputRef} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} placeholder={options?.placeholder} />
          <DialogTrigger asChild>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </InputGroup>
      </BasicField>
      <DialogContent
        style={{ height: '80vh' }}
        onCloseAutoFocus={browsers.includes('LOGIC') ? e => focusBracketContent(e, value, inputRef.current) : undefined}
      >
        <Browser activeBrowsers={browsers} close={() => setOpen(false)} value={value} onChange={onChange} options={options} />
      </DialogContent>
    </Dialog>
  );
};
