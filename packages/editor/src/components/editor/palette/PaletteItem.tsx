import { useDraggable } from '@dnd-kit/core';
import type { PaletteConfig } from './palette-config';
import './PaletteItem.css';
import { config } from '../../components';
import useDraggableOverWidth from '../../../utils/useDraggableOverWidth';
import { Flex } from '@axonivy/ui-components';

type PaletteItemProps = {
  item: PaletteConfig;
};

export const PaletteItem = ({ item }: PaletteItemProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: item.name });
  return (
    <Flex className='palette-item' direction='column' gap={1} title={item.description} ref={setNodeRef} {...listeners} {...attributes}>
      <Flex className='palette-item-icon' justifyContent='center' alignItems='center'>
        {config.components[item.name].icon}
      </Flex>
      <Flex justifyContent='center'>{item.name}</Flex>
    </Flex>
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
