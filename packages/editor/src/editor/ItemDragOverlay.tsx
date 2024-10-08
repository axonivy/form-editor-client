import type { CreateComponentData } from '../types/config';
import { componentByElement, componentByName } from '../components/components';
import { ComponentBlockOverlay } from './canvas/ComponentBlock';
import { PaletteItemOverlay } from './palette/PaletteItem';
import { useData } from '../data/data';

export const ItemDragOverlay = ({ activeId, createData }: { activeId?: string; createData?: CreateComponentData }) => {
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
