import { Canvas } from './canvas/Canvas';
import { Palette } from './palette/Palette';
import { Properties } from './properties/Properties';
import './Editor.css';
import { useState } from 'react';
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors, pointerWithin } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { AppProvider } from '../../data/useData';
import { modifyData, type UiEditorData } from '../../data/data';
import { componentsGroupByCategroy, config } from '../components';
import { ItemDragOverlay } from './ItemDragOverlay';

export const Editor = () => {
  const [data, setData] = useState<UiEditorData>({ root: {}, content: [] });
  const [selectedElement, setSelectedElement] = useState('');
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
    <AppProvider value={{ data, setData, selectedElement, setSelectedElement }}>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors} collisionDetection={pointerWithin}>
        <div className='form-editor-root'>
          <div className='palette-sidebar'>
            <Palette items={componentsGroupByCategroy()} />
          </div>
          <div className='canvas-block'>
            <Canvas config={config} />
          </div>
          <div className='properties-sidebar'>
            <Properties config={config} />
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          <ItemDragOverlay activeId={activeId} />
        </DragOverlay>
      </DndContext>
    </AppProvider>
  );
};
