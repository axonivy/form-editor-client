import { useData } from '../../context/useData';
import { findComponent } from '../../data/data';
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
  const find = findComponent(data.components, activeId);
  if (find) {
    const element = find.data[find.index];
    const component = componentByName(element.type);
    return <DraggableOverlay config={component} data={element} />;
  }
  return null;
};
