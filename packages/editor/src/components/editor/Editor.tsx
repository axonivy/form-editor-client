import { Canvas } from './canvas/Canvas';
import { Palette } from './palette/Palette';
import { Properties } from './properties/Properties';
import './Editor.css';
import { useState } from 'react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { type ComponentConfig, componentByName, componentsGroupByCategroy, config } from '../components/component';
import { PaletteItemOverlay } from './palette/PaletteItem';
import { AppProvider } from '../data/useData';
import type { ContentData, UiEditorData } from '../data/data';
import { v4 as uuid } from 'uuid';

const targetIndex = (data: ContentData[], target: UniqueIdentifier) => {
  const id = `${target}`.replace('DropZone-', '');
  const targetIndex = data.findIndex(obj => obj.id === id);
  if (targetIndex === -1) {
    return data.length - 1;
  }
  return targetIndex;
};

const arraymove = <TArr extends object>(arr: TArr[], fromIndex: number, toIndex: number) => {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
};

const addNewComponent = (component: ComponentConfig, data: ContentData[], target: UniqueIdentifier) => {
  data.push({ id: `${component.name}-${uuid()}`, type: component.name, props: structuredClone(component.defaultProps) });
  arraymove(data, data.length - 1, targetIndex(data, target));
};

const moveComponent = (id: string, data: ContentData[], target: UniqueIdentifier) => {
  const element = data.find(obj => obj.id === id);
  if (element) {
    const fromIndex = data.indexOf(element);
    arraymove(data, fromIndex, targetIndex(data, target));
  }
};

export const Editor = () => {
  const [data, setData] = useState<UiEditorData>({
    root: {},
    content: []
  });
  const [selectedElement, setSelectedElement] = useState('');
  const [activeId, setActiveId] = useState<string | undefined>();
  const handleDragEnd = (event: DragEndEvent) => {
    const target = event.over?.id;
    if (target && activeId) {
      const newData = structuredClone(data);
      const component = componentByName(activeId);
      if (component) {
        addNewComponent(component, newData.content, target);
      } else {
        moveComponent(activeId, newData.content, target);
      }
      setData(newData);
    }
    setActiveId(undefined);
  };
  const handleDragStart = (event: DragStartEvent) => setActiveId(`${event.active.id}`);
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 15 } });
  const sensors = useSensors(mouseSensor);

  return (
    <AppProvider value={{ data, setData, setSelectedElement, selectedElement }}>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
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
        <DragOverlay dropAnimation={null}>{activeId ? <PaletteItemOverlay item={componentByName(activeId)} /> : null}</DragOverlay>
      </DndContext>
    </AppProvider>
  );
};
