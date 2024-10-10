import { BasicField, Button, Dialog, DialogContent, DialogTrigger, Flex, Textarea, type MessageData } from '@axonivy/ui-components';
import { useState } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';
import { Browser } from './browser/Browser';

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  message?: MessageData;
};

export const TextareaField = ({ label, value, onChange, message }: TextareaFieldProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message}>
        <Flex direction='row'>
          <Textarea value={value} onChange={e => onChange(e.target.value)} autoResize={true} />
          <DialogTrigger asChild style={{ marginLeft: '-25px', marginTop: '8px' }}>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </Flex>
      </BasicField>
      <DialogContent style={{ height: '80vh' }}>
        <Browser activeBrowsers={['CMS']} close={() => setOpen(false)} value={value} onChange={onChange} />
      </DialogContent>
    </Dialog>
  );
};
