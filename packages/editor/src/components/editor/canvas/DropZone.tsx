import { useDndContext, useDroppable } from '@dnd-kit/core';
import './DropZone.css';
import type { ReactNode } from 'react';

type DropZoneProps = {
  id: string;
  visible?: boolean;
  children?: ReactNode;
};

export const DropZone = ({ id, visible, children }: DropZoneProps) => {
  const dnd = useDndContext();
  const { isOver, setNodeRef } = useDroppable({ id: `DropZone-${id}`, disabled: dnd.active?.id === id });
  return (
    <div ref={setNodeRef} className={`drop-zone${isOver ? ' is-drop-target' : ''}`}>
      <div className={`drop-zone-block${visible ? ' visible' : ''}`} />
      {children}
    </div>
  );
};
