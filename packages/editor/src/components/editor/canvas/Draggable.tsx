import { useAppContext } from '../../../data/useData';
import type { ContentData } from '../../../data/data';
import type { ComponentConfig } from '../../../types/config';
import './Draggable.css';
import { useDraggable } from '@dnd-kit/core';

type DraggableProps = {
  config: ComponentConfig;
  data: ContentData;
};

export const Draggable = ({ config, data }: DraggableProps) => {
  const { isDragging, attributes, listeners, setNodeRef, transform } = useDraggable({ id: data.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;
  const appContext = useAppContext();
  const isSelected = appContext.selectedElement === data.id;
  return (
    <div
      onClick={() => appContext.setSelectedElement(data.id)}
      className={`draggable${isSelected ? ' selected' : ''}${isDragging ? ' dragging' : ''}`}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {config.render({ id: data.id, ...data.props })}
    </div>
  );
};
