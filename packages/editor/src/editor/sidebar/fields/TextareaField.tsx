import { BasicField, BrowsersView, Button, Dialog, DialogContent, DialogTrigger, Flex, Textarea } from '@axonivy/ui-components';
import { useState } from 'react';
import { useCmsBrowser } from './browser/useCmsBrowser';
import { IvyIcons } from '@axonivy/ui-icons';

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextareaField = ({ label, value, onChange }: TextareaFieldProps) => {
  const [open, setOpen] = useState(false);
  const cmsBrowser = useCmsBrowser();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label}>
        <Flex direction='row'>
          <Textarea value={value} onChange={e => onChange(e.target.value)} autoResize={true} />
          <DialogTrigger asChild style={{ marginLeft: '-25px', marginTop: '8px' }}>
            <Button icon={IvyIcons.ListSearch} aria-label='Browser' />
          </DialogTrigger>
        </Flex>
      </BasicField>
      <DialogContent style={{ height: '80vh' }}>
        <BrowsersView
          browsers={[cmsBrowser]}
          apply={(browserName, result) => {
            if (result) {
              onChange(`${value}#{${result.value}}`);
            }
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
