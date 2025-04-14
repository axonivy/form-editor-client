import { BasicField, BasicInput, Button, Dialog, DialogContent, DialogTrigger, InputBadge, InputGroup } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef, useState } from 'react';
import type { InputFieldProps } from './InputField';
import type { TextFieldOptions } from '../../../types/config';
import { focusBracketContent } from '../../../utils/focus';
import { Browser, type FormBrowser } from '../../browser/Browser';
import { AddCmsQuickFixPopover } from '../../browser/cms/AddCmsQuickFix';
import useTextSelection from '../../browser/cms/useTextSelection';
import { badgeProps } from '../../../utils/badge-properties';
import { useOnFocus } from '../../../context/useOnFocus';
import { useTranslation } from 'react-i18next';

export const InputFieldWithBrowser = ({
  label,
  value,
  onChange,
  browsers,
  onBlur,
  message,
  options
}: InputFieldProps & { browsers: Array<FormBrowser>; options?: TextFieldOptions }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { isFocusWithin, focusWithinProps } = useOnFocus(value, onChange);
  const { handleTextSelection, showQuickFix, getSelectedText, selection } = useTextSelection(inputRef);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message} {...focusWithinProps} className='badge-field' tabIndex={0}>
        {isFocusWithin || showQuickFix() ? (
          <InputGroup>
            <BasicInput
              ref={inputRef}
              value={value}
              onChange={e => onChange(e.target.value)}
              onSelect={() => handleTextSelection()}
              onBlur={onBlur}
              placeholder={options?.placeholder}
              disabled={options?.disabled}
            />
            {showQuickFix() && browsers.some(b => b.type === 'CMS') && (
              <AddCmsQuickFixPopover
                value={getSelectedText()}
                selection={selection}
                inputRef={inputRef}
                onChange={change => {
                  onChange(change);
                  handleTextSelection();
                }}
              />
            )}
            <DialogTrigger asChild>
              <Button icon={IvyIcons.ListSearch} aria-label={t('label.browser')} />
            </DialogTrigger>
          </InputGroup>
        ) : (
          <InputBadge value={value ?? ''} badgeProps={badgeProps} style={{ height: 15 }} />
        )}
      </BasicField>
      <DialogContent
        style={{ height: '80vh' }}
        onCloseAutoFocus={browsers.find(b => b.type === 'LOGIC') ? e => focusBracketContent(e, value, inputRef.current) : undefined}
      >
        <Browser activeBrowsers={browsers} close={() => setOpen(false)} value={value} onChange={onChange} selection={selection} />
      </DialogContent>
    </Dialog>
  );
};
