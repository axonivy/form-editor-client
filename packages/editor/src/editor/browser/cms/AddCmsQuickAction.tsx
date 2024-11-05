import { useState } from 'react';
import { useMeta } from '../../../context/useMeta';
import { Button, Flex, Popover, PopoverArrow, PopoverContent, PopoverTrigger, toast } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../../context/AppContext';
import { useFunction } from '../../../context/useFunction';
import { useQueryClient } from '@tanstack/react-query';
import { genQueryKey } from '../../../query/query-client';

export const AddCmsQuickActionPopover = ({
  value,
  onChange,
  savedSelection,
  inputRef
}: {
  value: string;
  onChange: (value: string) => void;
  savedSelection: { start: number; end: number };
  inputRef: React.RefObject<HTMLInputElement>;
}) => {
  const [open, setOpen] = useState(false);

  const { context } = useAppContext();
  const queryClient = useQueryClient();
  const cmsQuickActions = useMeta('meta/cms/cmsQuickActions', { context, text: value }, []).data;
  const executeCmsQuickAction = useFunction(
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
        if (inputRef.current && savedSelection) {
          const currentValue = inputRef.current.value;
          const newValue = currentValue.slice(0, savedSelection.start) + data + currentValue.slice(savedSelection.end);

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
    if (inputRef.current && savedSelection) {
      inputRef.current.setSelectionRange(savedSelection.start, savedSelection.end);
      inputRef.current.focus();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button icon={IvyIcons.Cms} aria-label='CMS-Quickaction' title='CMS-Quickaction' />
      </PopoverTrigger>
      <PopoverContent sideOffset={12} collisionPadding={5} onOpenAutoFocus={restoreSelection} onFocusOutside={e => e.preventDefault()}>
        <Flex direction='column' gap={2} alignItems='center'>
          {value.length > 0 &&
            cmsQuickActions?.map((action, index) => (
              <Button
                key={index}
                icon={IvyIcons.Cms}
                aria-label={`CMS-Quickaction-${action.category}`}
                title={`Create content object: '${action.parentUri}${action.coName}' value: ${action.coContent}`}
                onClick={() => {
                  executeCmsQuickAction.mutate({
                    context,
                    cmsQuickAction: action
                  });
                }}
                style={{ width: '100%', justifyContent: 'start' }}
              >
                {`Create ${action.category} '${action.coName}'`}
              </Button>
            ))}
        </Flex>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
};
