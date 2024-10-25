import { BasicField, Button, Dialog, DialogContent, DialogTrigger, Input, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState } from 'react';
import type { InputFieldProps } from './InputField';
import type { TextBrowserFieldOptions } from '../../../types/config';
import { focusBracketContent } from '../../../utils/focus';
import { Browser, type BrowserType } from '../../browser/Browser';
import { AddCmsQuickActionPopover } from '../../browser/cms/AddCmsQuickAction';

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
  const [savedSelection, setSavedSelection] = useState<{ start: number; end: number } | undefined>();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleTextSelection = () => {
    if (inputRef.current) {
      const selectionStart = inputRef.current.selectionStart ?? 0;
      const selectionEnd = inputRef.current.selectionEnd ?? 0;
      if (selectionStart !== selectionEnd) {
        setSavedSelection({ start: selectionStart, end: selectionEnd });
      } else {
        setSavedSelection(undefined);
      }
    }
  };

  const getSelectedText = () => {
    if (inputRef.current && savedSelection) {
      const text = inputRef.current.value.substring(savedSelection.start, savedSelection.end);
      return text;
    }
    return '';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message} style={{ flex: '1' }}>
        <InputGroup>
          <Input
            ref={inputRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onSelect={handleTextSelection}
            onBlur={onBlur}
            placeholder={options?.placeholder}
          />
          {browsers.some(b => b === 'CMS') && inputRef.current?.selectionStart !== inputRef.current?.selectionEnd && savedSelection && (
            <AddCmsQuickActionPopover value={getSelectedText()} savedSelection={savedSelection} inputRef={inputRef} onChange={onChange} />
          )}
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
