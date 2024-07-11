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
import { modifyData } from '../data/data';
import { ItemDragOverlay } from '../components/editor/ItemDragOverlay';
import type { ComponentData } from '@axonivy/form-editor-protocol';

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

const findNewComponent = (oldComponents: ComponentData[], newComponents: ComponentData[]) => {
  const oldIds = new Set(oldComponents.map(component => component.id));
  return newComponents.find(component => !oldIds.has(component.id));
};

export const DndContext = ({ children }: { children: ReactNode }) => {
  const { setData, setSelectedElement } = useData();
  const [activeId, setActiveId] = useState<string | undefined>();

  const handleDragEnd = (event: DragEndEvent) => {
    const targetId = event.over?.id;
    if (targetId && activeId) {
      setData(oldData => {
        const newData = modifyData(oldData, { type: 'dnd', data: { activeId, targetId } });
        const newComponent = findNewComponent(oldData.components, newData.components);
        if (newComponent) {
          setSelectedElement(newComponent.id);
          setActiveId(newComponent.id);
        } else {
          setSelectedElement(activeId);
        }
        return newData;
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(`${event.active.id}`);
    setSelectedElement(`${event.active.id}`);
  };

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 15 } });
  const sensors = useSensors(mouseSensor);

  return (
    <DndKitContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors} collisionDetection={ownCollisionDetection}>
      {children}
      <DragOverlay dropAnimation={null}>
        <ItemDragOverlay activeId={activeId} />
      </DragOverlay>
    </DndKitContext>
  );
};
