import { EMPTY_FORM, type ComponentData, type FormData } from '@axonivy/form-editor-protocol';
import { createContext, useContext, type SetStateAction, type Dispatch, useState, useEffect } from 'react';
import type { UpdateConsumer } from '../types/lambda';
import { findComponentElement } from '../data/data';
import { useReadonly } from '@axonivy/ui-components';

type UI = {
  properties: boolean;
  dataStructure: boolean;
  helpPaddings: boolean;
  responsiveMode: 'desktop' | 'tablet' | 'mobile';
};

const DEFAULT_UI: UI = { properties: true, dataStructure: false, helpPaddings: true, responsiveMode: 'desktop' };

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
};

export const appContext = createContext<AppContext>({
  data: EMPTY_FORM,
  setData: data => data,
  setSelectedElement: () => {},
  ui: DEFAULT_UI,
  setUi: () => {}
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  return useContext(appContext);
};

export const useData = () => {
  const { data, setData, selectedElement } = useAppContext();
  const foundElement = selectedElement !== undefined ? findComponentElement(data, selectedElement) : undefined;
  const setElement = (element: ComponentData) => {
    setData(oldData => {
      const findElement = findComponentElement(oldData, element.id);
      if (findElement) {
        findElement.element = element;
      }
      return oldData;
    });
  };
  return { data, setData, element: foundElement?.element, setElement, parent: foundElement?.parent };
};
