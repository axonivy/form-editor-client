import type { CreateComponentData } from '../types/config';
import { ComponentBlockOverlay } from './canvas/ComponentBlock';
import { useData } from '../data/data';
import { useComponents } from '../context/ComponentsContext';
import { PaletteItemOverlay } from './palette/PaletteItem';

export const ItemDragOverlay = ({ activeId, createData }: { activeId?: string; createData?: CreateComponentData }) => {
  const { componentByElement, componentByName } = useComponents();
  const { element, data } = useData();
  if (!activeId) {
    return null;
  }
  const component = componentByName(createData?.componentName ?? activeId);
  if (component) {
    return <PaletteItemOverlay {...component} data={createData} />;
  }
  if (element) {
    const component = componentByElement(element, data.components);
    return <ComponentBlockOverlay config={component} data={element} />;
  }
  return null;
};
