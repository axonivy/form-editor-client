import { useDndContext, useDroppable } from '@dnd-kit/core';
import './DropZone.css';
import type { ReactNode } from 'react';
import { isDropZoneDisabled } from './drag-data';

type DropZoneProps = {
  id: string;
  preId?: string;
  children?: ReactNode;
};

export const DropZone = ({ id, preId, children }: DropZoneProps) => {
  const dnd = useDndContext();
  const { isOver, setNodeRef } = useDroppable({ id, disabled: isDropZoneDisabled(id, dnd.active, preId) });
  return (
    <div ref={setNodeRef} className={`drop-zone${isOver ? ' is-drop-target' : ''}`}>
      <div className='drop-zone-block' />
      {children}
    </div>
  );
};
