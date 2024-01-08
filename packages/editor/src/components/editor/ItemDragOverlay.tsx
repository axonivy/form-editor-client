import { useData } from '../../data/useData';
import { componentByName } from '../components';
import { DraggableOverlay } from './canvas/Draggable';
import { PaletteItemOverlay } from './palette/PaletteItem';

export const ItemDragOverlay = ({ activeId }: { activeId?: string }) => {
  const { data } = useData();
  if (!activeId) {
    return null;
  }
  const component = componentByName(activeId);
  if (component) {
    return <PaletteItemOverlay item={component} />;
  }
  const element = data.content.find(obj => obj.id === activeId);
  if (element) {
    const component = componentByName(element.type);
    return <DraggableOverlay config={component} data={element} />;
  }
  return null;
};
