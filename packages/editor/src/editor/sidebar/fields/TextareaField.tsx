import {
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  InputBadgeArea,
  splitNewLine,
  Textarea,
  type MessageData
} from '@axonivy/ui-components';
import { useMemo, useRef, useState } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';
import { Browser } from '../../browser/Browser';
import { AddCmsQuickFixPopover } from '../../browser/cms/AddCmsQuickFix';
import useTextSelection from '../../browser/cms/useTextSelection';
import { useOnFocus } from '../../../context/useOnFocus';
import { badgeProps } from '../../../utils/badge-properties';

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  message?: MessageData;
};

export const TextareaField = ({ label, value, onChange, message }: TextareaFieldProps) => {
  const [open, setOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isFocusWithin, focusWithinProps } = useOnFocus(value, onChange);
  const cmsQuickFixPopoverRef = useRef<HTMLDivElement>(null);
  const { handleTextSelection, showQuickFix, getSelectedText, selection } = useTextSelection(textAreaRef);
  const height = useMemo(() => splitNewLine(value).length * 14, [value]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message} className='badge-field' {...focusWithinProps} tabIndex={0}>
        {isFocusWithin || cmsQuickFixPopoverRef.current ? (
          <Flex direction='row'>
            <Textarea
              value={value}
              onChange={e => onChange(e.target.value)}
              autoResize={true}
              ref={textAreaRef}
              onSelect={() => handleTextSelection()}
            />
            <Flex
              direction='row'
              style={{
                marginLeft: showQuickFix() && selection ? '-49px' : '-25px',
                marginTop: '8px'
              }}
              gap={1}
            >
              {showQuickFix() && selection && (
                <AddCmsQuickFixPopover
                  value={getSelectedText()}
                  selection={selection}
                  inputRef={textAreaRef}
                  onChange={onChange}
                  contentRef={cmsQuickFixPopoverRef}
                />
              )}
              <DialogTrigger asChild>
                <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
              </DialogTrigger>
            </Flex>
          </Flex>
        ) : (
          <InputBadgeArea value={value ?? ''} badgeProps={badgeProps} style={{ height: height }} />
        )}
      </BasicField>
      <DialogContent style={{ height: '80vh' }}>
        <Browser activeBrowsers={['CMS']} close={() => setOpen(false)} value={value} onChange={onChange} />
      </DialogContent>
    </Dialog>
  );
};
