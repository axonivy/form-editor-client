import { EMPTY_FORM, type FormContext, type FormData, type ValidationResult } from '@axonivy/form-editor-protocol';
import { createContext, useContext, useState, useEffect, type SetStateAction, type Dispatch } from 'react';
import type { UpdateConsumer } from '../types/types';
import { useReadonly, type useHistoryData } from '@axonivy/ui-components';

export type UI = {
  properties: boolean;
  helpPaddings: boolean;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
};

const DEFAULT_UI: UI = { properties: true, helpPaddings: true, deviceMode: 'desktop' };

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
  setSelectedElement: (element?: string) => void;
  ui: UI;
  setUi: Dispatch<SetStateAction<UI>>;
  context: FormContext;
  history: ReturnType<typeof useHistoryData<FormData>>;
  validations: Array<ValidationResult>;
  helpUrl: string;
};

export const appContext = createContext<AppContext>({
  data: EMPTY_FORM,
  setData: data => data,
  setSelectedElement: () => {},
  ui: DEFAULT_UI,
  setUi: () => {},
  context: { app: '', pmv: '', file: '' },
  history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
  validations: [],
  helpUrl: ''
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  return useContext(appContext);
};
