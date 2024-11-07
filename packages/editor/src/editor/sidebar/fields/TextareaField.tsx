import { BasicField, Button, Dialog, DialogContent, DialogTrigger, Flex, Textarea, type MessageData } from '@axonivy/ui-components';
import { useRef, useState } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';
import { Browser } from '../../browser/Browser';
import { AddCmsQuickFixPopover } from '../../browser/cms/AddCmsQuickFix';
import useTextSelection from '../../browser/cms/useTextSelection';

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  message?: MessageData;
};

export const TextareaField = ({ label, value, onChange, message }: TextareaFieldProps) => {
  const [open, setOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { handleTextSelection, showQuickFix, getSelectedText, selection } = useTextSelection(textAreaRef);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message}>
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
              <AddCmsQuickFixPopover value={getSelectedText()} selection={selection} inputRef={textAreaRef} onChange={onChange} />
            )}
            <DialogTrigger asChild>
              <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
            </DialogTrigger>
          </Flex>
        </Flex>
      </BasicField>
      <DialogContent style={{ height: '80vh' }}>
        <Browser activeBrowsers={['CMS']} close={() => setOpen(false)} value={value} onChange={onChange} />
      </DialogContent>
    </Dialog>
  );
};
