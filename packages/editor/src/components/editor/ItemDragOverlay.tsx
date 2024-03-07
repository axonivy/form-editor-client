import { useData } from '../../context/useData';
import { componentByName } from '../components';
import { DraggableOverlay } from './canvas/Draggable';
import { PaletteItemOverlay } from './palette/PaletteItem';

export const ItemDragOverlay = ({ activeId }: { activeId?: string }) => {
  const { element } = useData();
  if (!activeId) {
    return null;
  }
  const component = componentByName(activeId);
  if (component) {
    return <PaletteItemOverlay item={component} />;
  }
  if (element) {
    const component = componentByName(element.type);
    return <DraggableOverlay config={component} data={element} />;
  }
  return null;
};
