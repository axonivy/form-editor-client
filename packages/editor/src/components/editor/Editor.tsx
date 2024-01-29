import { Canvas } from './canvas/Canvas';
import { Palette } from './palette/Palette';
import { Properties } from './properties/Properties';
import './Editor.css';
import { useMemo, useState } from 'react';
import { AppProvider, DEFAULT_UI } from '../../context/useData';
import { componentsGroupByCategroy, config } from '../components';
import { Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@axonivy/ui-components';
import { FormToolbar } from './FormToolbar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useClient } from '../../context/useClient';
import type { Unary } from '../../types/lambda';
import type { FormData } from '@axonivy/form-editor-protocol';
import { DataStructure } from './data-structure/DataStructure';
import { DndContext } from '../../context/DndContext';

export const Editor = () => {
  const [ui, setUi] = useState(DEFAULT_UI);
  const [selectedElement, setSelectedElement] = useState('');

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

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{'An error has occurred: ' + error}</p>;
  }

  return (
    <AppProvider value={{ data, setData: mutation.mutate, selectedElement, setSelectedElement, ui, setUi }}>
      <DndContext>
        <ResizablePanelGroup direction='horizontal' autoSaveId='form-editor-resize'>
          {ui.components && (
            <>
              <ResizablePanel id='components' order={1} defaultSize={25} minSize={10} className='panel'>
                <Palette items={componentsGroupByCategroy()} />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}
          <ResizablePanel id='canvas' order={2} defaultSize={50} minSize={30} className='panel'>
            <Flex direction='column' style={{ height: '100%' }}>
              <FormToolbar />
              {ui.dataStructure ? <DataStructure /> : <Canvas config={config} />}
            </Flex>
          </ResizablePanel>
          {ui.properties && (
            <>
              <ResizableHandle />
              <ResizablePanel id='properties' order={3} defaultSize={25} minSize={10} className='panel'>
                <Properties config={config} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </DndContext>
    </AppProvider>
  );
};
