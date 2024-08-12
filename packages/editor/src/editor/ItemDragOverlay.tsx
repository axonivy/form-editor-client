import type { CreateData } from '../types/config';
import { componentByName } from '../components/components';
import { DraggableOverlay } from './canvas/Draggable';
import { PaletteItemOverlay } from './palette/PaletteItem';
import { useData } from '../data/data';

export const ItemDragOverlay = ({ activeId, createData }: { activeId?: string; createData?: CreateData }) => {
  const { element } = useData();
  if (!activeId) {
    return null;
  }
  const component = componentByName(createData?.componentName ?? activeId);
  if (component) {
    return <PaletteItemOverlay {...component} data={createData} />;
  }
  if (element) {
    const component = componentByName(element.type);
    return <DraggableOverlay config={component} data={element} />;
  }
  return null;
};
