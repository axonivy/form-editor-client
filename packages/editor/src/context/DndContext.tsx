import {
  DndContext as DndKitContext,
  useSensor,
  useSensors,
  MouseSensor,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin,
  type CollisionDetection,
  rectIntersection
} from '@dnd-kit/core';

import { useState, type ReactNode } from 'react';
import { useData } from './useData';
import { findComponentElement, modifyData } from '../data/data';
import { ItemDragOverlay } from '../editor/ItemDragOverlay';
import { isCreateData, type CreateData } from '../types/config';

const ownCollisionDetection: CollisionDetection = ({ droppableContainers, ...args }) => {
  const rectIntersectionCollisions = rectIntersection({
    ...args,
    droppableContainers: droppableContainers.filter(({ id }) => id === 'canvas')
  });
  const pointerWithinCollisions = pointerWithin({ ...args, droppableContainers: droppableContainers.filter(({ id }) => id !== 'canvas') });

  if (rectIntersectionCollisions.length > 0 && pointerWithinCollisions.length === 0) {
    return rectIntersectionCollisions;
  }

  return pointerWithin({ droppableContainers, ...args });
};

export const DndContext = ({ children }: { children: ReactNode }) => {
  const { data, setData, setSelectedElement } = useData();
  const [activeId, setActiveId] = useState<string | undefined>();
  const [createData, setCreateData] = useState<CreateData | undefined>();

  const handleDragEnd = (event: DragEndEvent) => {
    const targetId = event.over?.id as string | undefined;
    if (targetId && activeId) {
      setData(oldData => {
        const modifiedData = modifyData(oldData, {
          type: 'dnd',
          data: { activeId: createData?.componentName ?? activeId, targetId, create: createData }
        });
        const newData = modifiedData.newData;
        const newComponentId = modifiedData.newComponentId;
        setSelectedElement(newComponentId ?? activeId);
        setActiveId(undefined);
        return newData;
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = `${event.active.id}`;
    const createData = event.active.data.current;
    setActiveId(activeId);
    setCreateData(isCreateData(createData) ? createData : undefined);
    if (findComponentElement(data, activeId)) {
      setSelectedElement(activeId);
    }
  };

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 15 } });
  const sensors = useSensors(mouseSensor);

  return (
    <DndKitContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors} collisionDetection={ownCollisionDetection}>
      {children}
      <DragOverlay dropAnimation={null}>
        <ItemDragOverlay activeId={activeId} createData={createData} />
      </DragOverlay>
    </DndKitContext>
  );
};
