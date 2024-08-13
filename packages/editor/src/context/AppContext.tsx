import { EMPTY_FORM, type FormContext, type FormData } from '@axonivy/form-editor-protocol';
import { createContext, useContext, type SetStateAction, type Dispatch, useState, useEffect } from 'react';
import type { UpdateConsumer } from '../types/lambda';
import { useReadonly } from '@axonivy/ui-components';
import type { useHistoryData } from '../data/useHistoryData';

type UI = {
  properties: boolean;
  dataStructure: boolean;
  helpPaddings: boolean;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
};

const DEFAULT_UI: UI = { properties: true, dataStructure: false, helpPaddings: true, deviceMode: 'desktop' };

export const useUiState = () => {
  const readonly = useReadonly();
  const [ui, setUi] = useState(DEFAULT_UI);
  useEffect(() => {
    if (readonly) {
      setUi(old => ({ ...old, helpPaddings: false, components: false }));
    }
  }, [readonly]);
  return { ui, setUi };
};

export type AppContext = {
  data: FormData;
  setData: UpdateConsumer<FormData>;
  selectedElement?: string;
  setSelectedElement: Dispatch<SetStateAction<string | undefined>>;
  ui: UI;
  setUi: Dispatch<SetStateAction<UI>>;
  context: FormContext;
  history: ReturnType<typeof useHistoryData>;
};

export const appContext = createContext<AppContext>({
  data: EMPTY_FORM,
  setData: data => data,
  setSelectedElement: () => {},
  ui: DEFAULT_UI,
  setUi: () => {},
  context: { app: '', pmv: '', file: '' },
  history: { pushHistory: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false }
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  return useContext(appContext);
};