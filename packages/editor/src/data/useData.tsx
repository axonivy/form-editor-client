import { createContext, useContext, type SetStateAction, type Dispatch } from 'react';
import type { ContentData, UiEditorData } from './data';

export type SideBars = { components: boolean; properties: boolean };
export const DEFAULT_SIDEBARS: SideBars = { components: true, properties: true };

export type AppContext = {
  data: UiEditorData;
  setData: (data: UiEditorData) => void;
  selectedElement?: string;
  setSelectedElement: (element: string) => void;
  sideBars: SideBars;
  setSideBars: Dispatch<SetStateAction<SideBars>>;
};

export const appContext = createContext<AppContext>({
  data: { root: {}, content: [] },
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
  const element = data.content.find(obj => obj.id === selectedElement);
  const setElement = (element: ContentData) => {
    const newData = structuredClone(data);
    const index = newData.content.findIndex(obj => obj.id === element.id);
    newData.content[index] = element;
    setData(newData);
  };
  return { data, element, setElement };
};
