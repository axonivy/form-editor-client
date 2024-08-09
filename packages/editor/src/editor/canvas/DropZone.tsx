import { useDndContext, useDroppable } from '@dnd-kit/core';
import './DropZone.css';
import type { ComponentProps } from 'react';
import { isDropZoneDisabled } from './drag-data';
import { cn } from '@axonivy/ui-components';

export type DropZoneProps = ComponentProps<'div'> & {
  id: string;
  preId?: string;
  dragHint?: boolean;
};

export const DropZone = ({ id, preId, className, children }: DropZoneProps) => {
  const dnd = useDndContext();
  const { isOver, setNodeRef } = useDroppable({ id, disabled: isDropZoneDisabled(id, dnd.active, preId) });
  return (
    <div ref={setNodeRef} className={cn('drop-zone', isOver && 'is-drop-target', className)}>
      <div className='drop-zone-block' />
      {children}
    </div>
  );
};
