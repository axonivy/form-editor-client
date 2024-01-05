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
  const { isDragging, attributes, listeners, setNodeRef } = useDraggable({ id: data.id });
  const appContext = useAppContext();
  const isSelected = appContext.selectedElement === data.id;
  return (
    <div
      onClick={() => appContext.setSelectedElement(data.id)}
      className={`draggable${isSelected ? ' selected' : ''}${isDragging ? ' dragging' : ''}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {config.render({ id: data.id, ...data.props })}
    </div>
  );
};

export const DraggableOverlay = ({ config, data }: DraggableProps) => {
  return <div className='draggable dragging'>{config.render({ id: data.id, ...data.props })}</div>;
};
