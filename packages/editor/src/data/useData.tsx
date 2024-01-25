import { EMPTY_FORM, type ComponentData, type FormData } from '@axonivy/form-editor-protocol';
import { createContext, useContext, type SetStateAction, type Dispatch } from 'react';
import type { UpdateConsumer } from '../types/lambda';

export type SideBars = { components: boolean; properties: boolean; dataStructure: boolean };
export const DEFAULT_SIDEBARS: SideBars = { components: true, properties: true, dataStructure: false };

export type AppContext = {
  data: FormData;
  setData: UpdateConsumer<FormData>;
  selectedElement?: string;
  setSelectedElement: Dispatch<SetStateAction<string>>;
  sideBars: SideBars;
  setSideBars: Dispatch<SetStateAction<SideBars>>;
};

export const appContext = createContext<AppContext>({
  data: EMPTY_FORM,
  setData: data => data,
  setSelectedElement: () => {},
  sideBars: DEFAULT_SIDEBARS,
  setSideBars: () => {}
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  return useContext(appContext);
};

export const useData = () => {
  const { data, setData, selectedElement } = useAppContext();
  const element = data.components.find(obj => obj.id === selectedElement);
  const setElement = (element: ComponentData) => {
    const newData = structuredClone(data);
    const index = newData.components.findIndex(obj => obj.id === element.id);
    newData.components[index] = element;
    setData(() => newData);
  };
  return { data, element, setElement };
};
