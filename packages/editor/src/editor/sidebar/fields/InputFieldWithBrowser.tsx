import { BasicField, Button, Dialog, DialogContent, DialogTrigger, Input, InputBadge, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState } from 'react';
import type { InputFieldProps } from './InputField';
import type { TextBrowserFieldOptions } from '../../../types/config';
import { focusBracketContent } from '../../../utils/focus';
import { Browser, type BrowserType } from '../../browser/Browser';
import { AddCmsQuickFixPopover } from '../../browser/cms/AddCmsQuickFix';
import useTextSelection from '../../browser/cms/useTextSelection';
import { badgeProps } from '../../../utils/badge-properties';
import { useOnFocus } from '../../../context/useOnFocus';

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
  const cmsQuickRef = useRef<HTMLDivElement>(null);
  const { isFocusWithin, focusWithinProps } = useOnFocus(value, onChange);
  const { handleTextSelection, showQuickFix, getSelectedText, selection } = useTextSelection(inputRef);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message} style={{ flex: '1' }} {...focusWithinProps} className='badge-field' tabIndex={0}>
        {isFocusWithin || cmsQuickRef.current ? (
          <InputGroup>
            <Input
              ref={inputRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              onSelect={() => handleTextSelection()}
              onBlur={onBlur}
              placeholder={options?.placeholder}
            />
            {showQuickFix() && selection && browsers.some(b => b === 'CMS') && (
              <AddCmsQuickFixPopover
                reference={cmsQuickRef}
                value={getSelectedText()}
                selection={selection}
                inputRef={inputRef}
                onChange={onChange}
              />
            )}
            <DialogTrigger asChild>
              <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
            </DialogTrigger>
          </InputGroup>
        ) : (
          <InputBadge value={value ?? ''} badgeProps={badgeProps} style={{ height: 15 }} />
        )}
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
