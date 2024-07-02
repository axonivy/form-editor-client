import { useDraggable } from '@dnd-kit/core';
import type { PaletteConfig } from './palette-config';
import './PaletteItem.css';

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
  return (
    <>
      {item && (
        <div className='palette-item'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
            <path fill='currentColor' d={item.icon}></path>
          </svg>
          <span>{item.name}</span>
        </div>
      )}
    </>
  );
};
