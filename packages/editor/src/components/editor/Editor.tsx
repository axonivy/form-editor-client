import { Canvas } from './canvas/Canvas';
import { Properties } from './properties/Properties';
import './Editor.css';
import { useEffect, useMemo, useState } from 'react';
import { AppProvider, useUiState } from '../../context/useData';
import { config } from '../components';
import { Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@axonivy/ui-components';
import { FormToolbar } from './FormToolbar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useClient } from '../../context/useClient';
import type { Unary } from '../../types/lambda';
import type { FormData, FormEditorData, FormEditorProps } from '@axonivy/form-editor-protocol';
import { DataStructure } from './data-structure/DataStructure';
import { DndContext } from '../../context/DndContext';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './canvas/ErrorFallback';

export const Editor = (props: FormEditorProps) => {
  const [context, setContext] = useState(props.context);
  const [directSave, setDirectSave] = useState(props.directSave);
  useEffect(() => {
    setContext(props.context);
    setDirectSave(props.directSave);
  }, [props]);
  const { ui, setUi } = useUiState();
  const [selectedElement, setSelectedElement] = useState<string>();

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(() => {
    return {
      data: () => ['form-editor', 'data', context],
      saveData: () => ['saveData']
    };
  }, [context]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(),
    mutationFn: (updateData: Unary<FormData>) => {
      const saveData = queryClient.setQueryData<FormEditorData>(queryKeys.data(), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        return client.saveData({ context, data: saveData.data, directSave });
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
    <AppProvider value={{ data: data.data, setData: mutation.mutate, selectedElement, setSelectedElement, ui, setUi }}>
      <DndContext>
        <ResizablePanelGroup direction='horizontal' autoSaveId='form-editor-resize'>
          <ResizablePanel
            id='canvas'
            order={2}
            defaultSize={50}
            minSize={30}
            className='panel'
            onClick={e => {
              if (e.target !== e.currentTarget) {
                setSelectedElement(undefined);
              }
            }}
          >
            <Flex direction='column' className='canvas-panel'>
              <FormToolbar />
              <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[ui.dataStructure]}>
                {ui.dataStructure ? <DataStructure /> : <Canvas config={config} />}
              </ErrorBoundary>
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
