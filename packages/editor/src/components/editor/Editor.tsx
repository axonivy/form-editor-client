import { Canvas } from './canvas/Canvas';
import { Palette } from './palette/middle-buttons/Palette';
import { Properties } from './properties/Properties';
import './Editor.css';
import { useState } from 'react';
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors, pointerWithin } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { AppProvider } from '../../data/useData';
import { modifyData, type UiEditorData } from '../../data/data';
import { componentsGroupByCategroy, config } from '../components';
import { ItemDragOverlay } from './ItemDragOverlay';
import { IvyIcons } from '@axonivy/editor-icons';
import { RightSection } from './palette/right-buttons/RightSection';

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
          <div className='palette-header'>
            <div className='palette-header-wrapper'>
              <div className='undo'>
                <i className={`ivy ivy-${IvyIcons.Undo}`} />
                <i className={`ivy ivy-${IvyIcons.Redo}`} />
              </div>
              <Palette items={componentsGroupByCategroy()} />
              <RightSection />
            </div>
            <div className='properties-sidebar'>
              <Properties config={config} />
            </div>
          </div>
          <div className='editor-area'>
            <div className='canvas-block'>
              <Canvas config={config} />
            </div>
          </div>
        </div>
        <DragOverlay dropAnimation={null}>
          <ItemDragOverlay activeId={activeId} />
        </DragOverlay>
      </DndContext>
    </AppProvider>
  );
};
