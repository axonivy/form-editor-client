import { useDraggable } from '@dnd-kit/core';
import type { PaletteConfig } from './palette-config';
import './PaletteItem.css';
import { config } from '../../components';
import useDraggableOverWidth from '../../../utils/useDraggableOverWidth';

type PaletteItemProps = {
  item: PaletteConfig;
};

export const PaletteItem = ({ item }: PaletteItemProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: item.name });
  return (
    <div className='palette-item' title={item.description} ref={setNodeRef} {...listeners} {...attributes}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
        <path d={item.icon}></path>
      </svg>
      <span>{item.name}</span>
    </div>
  );
};

export const PaletteItemOverlay = ({ item }: Partial<PaletteItemProps>) => {
  const width = useDraggableOverWidth();

  return (
    <>
      {item && (
        <div className='draggable dragging' style={{ width }}>
          {config.components[item.name].render(config.components[item.name].defaultProps)}
        </div>
      )}
    </>
  );
};
