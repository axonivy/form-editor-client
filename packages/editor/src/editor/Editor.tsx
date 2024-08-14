import { Properties } from './properties/Properties';
import './Editor.css';
import { useEffect, useMemo, useState } from 'react';
import { AppProvider, useUiState } from '../context/AppContext';
import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, Spinner } from '@axonivy/ui-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useClient } from '../context/ClientContext';
import type { Unary } from '../types/types';
import type { FormData, FormEditorData, FormEditorProps } from '@axonivy/form-editor-protocol';
import { DndContext } from '../context/DndContext';
import { genQueryKey } from '../query/query-client';
import { IvyIcons } from '@axonivy/ui-icons';
import { useHistoryData } from '../data/useHistoryData';
import { MasterPart } from './MasterPart';

export const Editor = (props: FormEditorProps) => {
  const [context, setContext] = useState(props.context);
  const [directSave, setDirectSave] = useState(props.directSave);
  useEffect(() => {
    setContext(props.context);
    setDirectSave(props.directSave);
  }, [props]);
  const { ui, setUi } = useUiState();
  const [selectedElement, setSelectedElement] = useState<string>();
  const [initialData, setInitalData] = useState<FormData | undefined>(undefined);
  const history = useHistoryData();

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(() => {
    return {
      data: () => genQueryKey('data', context),
      saveData: () => genQueryKey('saveData', context)
    };
  }, [context]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  useEffect(() => {
    if (data?.data !== undefined && initialData === undefined) {
      setInitalData(data.data);
      history.pushHistory(data.data);
    }
  }, [data?.data, history, initialData]);

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
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }
  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={`An error has occurred: ${error.message}`} />;
  }
  if (data.data.components === undefined) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message='Form not found' />;
  }

  return (
    <AppProvider value={{ data: data.data, setData: mutation.mutate, selectedElement, setSelectedElement, ui, setUi, context, history }}>
      <DndContext>
        <ResizablePanelGroup direction='horizontal' autoSaveId='form-editor-resize'>
          <MasterPart />
          {ui.properties && (
            <>
              <ResizableHandle />
              <ResizablePanel id='properties' order={3} defaultSize={25} minSize={10} className='panel'>
                <Properties />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </DndContext>
    </AppProvider>
  );
};
