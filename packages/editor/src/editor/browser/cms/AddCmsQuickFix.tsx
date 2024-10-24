import { useState, type RefObject } from 'react';
import { useMeta } from '../../../context/useMeta';
import { Button, Flex, Popover, PopoverArrow, PopoverContent, PopoverTrigger, toast } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../../context/AppContext';
import { useFunction } from '../../../context/useFunction';
import { useQueryClient } from '@tanstack/react-query';
import { genQueryKey } from '../../../query/query-client';
import type { InputTextAreaRef, Selection } from './useTextSelection';

export const AddCmsQuickFixPopover = ({
  value,
  onChange,
  selection,
  inputRef,
  reference
}: {
  value: string;
  onChange: (value: string) => void;
  selection: Selection;
  inputRef: InputTextAreaRef;
  reference: RefObject<HTMLDivElement>;
}) => {
  const [open, setOpen] = useState(false);

  const { context } = useAppContext();
  const queryClient = useQueryClient();
  const cmsQuickFixes = useMeta('meta/cms/cmsQuickActions', { context, text: value }, []).data;
  const executeCmsQuickFix = useFunction(
    'meta/cms/executeCmsQuickAction',
    {
      context,
      cmsQuickAction: { category: 'global', coContent: '', coName: '', parentUri: '' }
    },
    {
      onSuccess: data => {
        toast.info('Content Object was successfully created ' + data);
        queryClient.invalidateQueries({ queryKey: genQueryKey('meta/cms/cmsTree', { context, requiredProjects: false }) });
        queryClient.invalidateQueries({
          queryKey: genQueryKey('meta/cms/cmsQuickActions', { context, text: value })
        });
        if (inputRef.current && selection) {
          const currentValue = inputRef.current.value;
          const newValue = currentValue.slice(0, selection.start) + data + currentValue.slice(selection.end);
          onChange(newValue);
          setOpen(false);
        }
      },
      onError: error => {
        toast.error('Failed to create Content Object', { description: error.message });
      }
    }
  );

  const restoreSelection = (e: Event) => {
    e.preventDefault();
    if (inputRef.current && selection) {
      inputRef.current.setSelectionRange(selection.start, selection.end);
      inputRef.current.focus();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button icon={IvyIcons.Cms} aria-label='CMS-Quickfix' title='CMS-Quickfix' />
      </PopoverTrigger>
      <PopoverContent
        ref={reference}
        sideOffset={12}
        collisionPadding={5}
        onOpenAutoFocus={restoreSelection}
        onFocusOutside={e => e.preventDefault()}
      >
        <Flex direction='column' gap={2} alignItems='center'>
          {value.length > 0 &&
            cmsQuickFixes?.map((fix, index) => (
              <Button
                key={index}
                icon={IvyIcons.Cms}
                aria-label={`CMS-Quickfix-${fix.category}`}
                title={`Create content object: '${fix.parentUri}${fix.coName}' value: ${fix.coContent}`}
                onClick={() => {
                  executeCmsQuickFix.mutate({
                    context,
                    cmsQuickAction: fix
                  });
                }}
                style={{ width: '100%', justifyContent: 'start' }}
              >
                {`Create ${fix.category} CMS-Object: '${fix.coName}'`}
              </Button>
            ))}
        </Flex>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
};
