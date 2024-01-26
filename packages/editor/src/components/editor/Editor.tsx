import { Canvas } from './canvas/Canvas';
import { Palette } from './palette/Palette';
import { Properties } from './properties/Properties';
import './Editor.css';
import { useMemo, useState } from 'react';
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors, pointerWithin } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { AppProvider, DEFAULT_SIDEBARS } from '../../data/useData';
import { modifyData } from '../../data/data';
import { componentsGroupByCategroy, config } from '../components';
import { ItemDragOverlay } from './ItemDragOverlay';
import { Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@axonivy/ui-components';
import { FormToolbar } from './Toolbar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useClient } from '../../context/useClient';
import type { Unary } from '../../types/lambda';
import type { FormData } from '@axonivy/form-editor-protocol';
import { DataStructure } from './data-structure/DataStructure';

export const Editor = () => {
  const [sideBars, setSideBars] = useState(DEFAULT_SIDEBARS);

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(() => {
    return {
      data: () => ['data'],
      saveData: () => ['saveData']
    };
  }, []);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(),
    queryFn: () => client.data(),
    structuralSharing: false
  });

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(),
    mutationFn: (updateData: Unary<FormData>) => {
      const saveData = queryClient.setQueryData<FormData>(queryKeys.data(), prevData => {
        if (prevData) {
          return updateData(prevData);
        }
        return undefined;
      });
      if (saveData) {
        return client.saveData(saveData);
      }
      return Promise.resolve();
    }
  });

  const [selectedElement, setSelectedElement] = useState('');
  const [activeId, setActiveId] = useState<string | undefined>();
  const handleDragEnd = (event: DragEndEvent) => {
    const target = event.over?.id;
    if (target && activeId) {
      mutation.mutate(oldData => modifyData(oldData, activeId, target));
    }
    setActiveId(undefined);
  };
  const handleDragStart = (event: DragStartEvent) => setActiveId(`${event.active.id}`);
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 15 } });
  const sensors = useSensors(mouseSensor);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{'An error has occurred: ' + error}</p>;
  }

  return (
    <AppProvider value={{ data, setData: mutation.mutate, selectedElement, setSelectedElement, sideBars, setSideBars }}>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors} collisionDetection={pointerWithin}>
        <ResizablePanelGroup direction='horizontal'>
          {sideBars.components && (
            <>
              <ResizablePanel defaultSize={25} minSize={10} className='panel'>
                <Palette items={componentsGroupByCategroy()} />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}
          <ResizablePanel defaultSize={50} minSize={30} className='panel'>
            <Flex direction='column' style={{ height: '100%' }}>
              <FormToolbar />
              {sideBars.dataStructure ? <DataStructure /> : <Canvas config={config} />}
            </Flex>
          </ResizablePanel>
          {sideBars.properties && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={25} minSize={10} className='panel'>
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
