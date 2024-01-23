import { Canvas } from './canvas/Canvas';
import { Palette } from './palette/Palette';
import { Properties } from './properties/Properties';
import './Editor.css';
import { useState } from 'react';
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors, pointerWithin } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { AppProvider, DEFAULT_SIDEBARS } from '../../data/useData';
import { modifyData, type UiEditorData } from '../../data/data';
import { componentsGroupByCategroy, config } from '../components';
import { ItemDragOverlay } from './ItemDragOverlay';
import { Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@axonivy/ui-components';
import { FormToolbar } from './Toolbar';

export const Editor = () => {
  const [sideBars, setSideBars] = useState(DEFAULT_SIDEBARS);
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
    <AppProvider value={{ data, setData, selectedElement, setSelectedElement, sideBars, setSideBars }}>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors} collisionDetection={pointerWithin}>
        <ResizablePanelGroup direction='horizontal'>
          {sideBars.components && (
            <>
              <ResizablePanel defaultSize={25} minSize={10} className='sidebar'>
                <Palette items={componentsGroupByCategroy()} />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}
          <ResizablePanel defaultSize={50} minSize={30}>
            <Flex direction='column'>
              <FormToolbar />
              <div className='canvas-block'>
                <Canvas config={config} />
              </div>
            </Flex>
          </ResizablePanel>
          {sideBars.properties && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={25} minSize={10} className='sidebar'>
                <Properties config={config} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
        <DragOverlay dropAnimation={null}>
          <ItemDragOverlay activeId={activeId} />
        </DragOverlay>
      </DndContext>
    </AppProvider>
  );
};
