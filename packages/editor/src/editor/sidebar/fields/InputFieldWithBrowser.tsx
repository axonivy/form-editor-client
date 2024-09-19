import { BasicField, BrowsersView, Button, Dialog, DialogContent, DialogTrigger, Input, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState } from 'react';
import { useAttributeBrowser } from './browser/useAttributeBrowser';
import type { InputFieldProps } from './InputField';
import type { Browser, TextBrowserFieldOptions } from '../../../types/config';
import { useLogicBrowser } from './browser/useLogicBrowser';
import { focusBracketContent } from '../../../utils/focus';

export const InputFieldWithBrowser = ({
  label,
  value,
  onChange,
  browsers,
  onBlur,
  message,
  options
}: InputFieldProps & { browsers: Browser[]; options?: TextBrowserFieldOptions }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const attrBrowser = useAttributeBrowser(options?.onlyAttributes, options?.onlyTypesOf);
  const logicBrowser = useLogicBrowser();

  const activeBrowsers = [...(browsers.includes('ATTRIBUTE') ? [attrBrowser] : []), ...(browsers.includes('LOGIC') ? [logicBrowser] : [])];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message}>
        <InputGroup>
          <Input ref={inputRef} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} placeholder={options?.placeholder} />
          <DialogTrigger asChild>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </InputGroup>
      </BasicField>
      <DialogContent style={{ height: '80vh' }} onCloseAutoFocus={e => focusBracketContent(e, value, inputRef.current)}>
        <BrowsersView
          browsers={activeBrowsers}
          apply={(browserName, result) => {
            if (result) {
              onChange(options?.onlyAttributes ? `${result.value}` : `#{${result.value}}`);
            }
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
