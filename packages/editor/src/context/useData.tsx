import { EMPTY_FORM, type ComponentData, type FormData } from '@axonivy/form-editor-protocol';
import { createContext, useContext, type SetStateAction, type Dispatch } from 'react';
import type { UpdateConsumer } from '../types/lambda';
import { findComponentElement } from '../data/data';

type UI = {
  components: boolean;
  properties: boolean;
  dataStructure: boolean;
  helpPaddings: boolean;
  responsiveMode: 'desktop' | 'tablet' | 'mobile';
};
export const DEFAULT_UI: UI = { components: true, properties: true, dataStructure: false, helpPaddings: true, responsiveMode: 'desktop' };

export type AppContext = {
  data: FormData;
  setData: UpdateConsumer<FormData>;
  selectedElement?: string;
  setSelectedElement: Dispatch<SetStateAction<string>>;
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
  //don't always evaluate element. just hold element instead of id
  const element = selectedElement !== undefined ? findComponentElement(data, selectedElement) : undefined;
  const setElement = (element: ComponentData) => {
    setData(oldData => {
      let findElement = findComponentElement(oldData, element.id);
      if (findElement) {
        findElement = element;
      }
      return oldData;
    });
  };
  return { data, setData, element, setElement };
};
