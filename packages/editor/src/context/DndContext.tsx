import {
  MouseSensor,
  useSensor,
  useSensors,
  DndContext as DndKitContext,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin,
  DragOverlay
} from '@dnd-kit/core';
import { useState, type ReactNode } from 'react';
import { useData } from './useData';
import { modifyData } from '../data/data';
import { ItemDragOverlay } from '../components/editor/ItemDragOverlay';

export const DndContext = ({ children }: { children: ReactNode }) => {
  const { setData } = useData();
  const [activeId, setActiveId] = useState<string | undefined>();
  const handleDragEnd = (event: DragEndEvent) => {
    const target = event.over?.id;
    if (target && activeId) {
      setData(oldData => modifyData(oldData, activeId, target));
    }
    setActiveId(undefined);
  };
  const handleDragStart = (event: DragStartEvent) => setActiveId(`${event.active.id}`);
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 15 } });
  const sensors = useSensors(mouseSensor);
  return (
    <DndKitContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors} collisionDetection={pointerWithin}>
      {children}
      <DragOverlay dropAnimation={null}>
        <ItemDragOverlay activeId={activeId} />
      </DragOverlay>
    </DndKitContext>
  );
};
