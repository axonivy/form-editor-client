import { PanelMessage, cn, Flex } from '@axonivy/ui-components';
import { DataClassDialog } from './data-class/DataClassDialog';
import { DropZone } from './DropZone';

type EmptyBlockProps = {
  id: string;
  preId: string;
  forLayout?: boolean;
  dragHint?: { display: boolean; mode: 'row' | 'column'; message: string };
};

export const EmtpyBlock = ({ id, preId, forLayout, dragHint }: EmptyBlockProps) => (
  <DropZone id={id} preId={preId}>
    {dragHint?.display ? (
      <>
        <PanelMessage message={dragHint.message} mode={dragHint.mode} className={cn('drag-hint', dragHint.mode)} />
        {!forLayout && (
          <Flex justifyContent='center'>
            <DataClassDialog />
          </Flex>
        )}
      </>
    ) : (
      <div className={cn('empty-block', forLayout && 'for-layout')} />
    )}
  </DropZone>
);
