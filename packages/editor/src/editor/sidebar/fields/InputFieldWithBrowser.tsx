import { BrowsersView, Button, Dialog, DialogContent, DialogTrigger, Fieldset, Input, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useAttributeBrowser } from './browser/useAttributeBrowser';
import type { InputFieldProps } from './InputField';
import type { Browser, TextBrowserFieldOptions } from '../../../types/config';
import { useLogicBrowser } from './browser/useLogicBrowser';

export const InputFieldWithBrowser = ({
  label,
  value,
  onChange,
  browsers,
  onBlur,
  options
}: InputFieldProps & { browsers: Browser[]; options?: TextBrowserFieldOptions }) => {
  const [open, setOpen] = useState(false);
  const attrBrowser = useAttributeBrowser(options?.onlyAttributes, options?.onlyTypesOf);
  const logicBrowser = useLogicBrowser();

  const activeBrowsers = [...(browsers.includes('ATTRIBUTE') ? [attrBrowser] : []), ...(browsers.includes('LOGIC') ? [logicBrowser] : [])];

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
