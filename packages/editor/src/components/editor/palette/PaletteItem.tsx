import { useDraggable } from '@dnd-kit/core';
import './PaletteItem.css';
import { componentByName } from '../../components';
import useDraggableOverWidth from '../../../utils/useDraggableOverWidth';
import { Flex } from '@axonivy/ui-components';
import type { CreateData } from '../../../types/config';

export type PaletteConfig = {
  name: string;
  description: string;
  data?: CreateData;
};

export const PaletteItem = ({ name, description, data }: PaletteConfig) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: name, data });
  const componentName = data?.componentName ?? name;
  return (
    <Flex className='palette-item' direction='column' gap={1} title={description} ref={setNodeRef} {...listeners} {...attributes}>
      <Flex className='palette-item-icon' justifyContent='center' alignItems='center'>
        {componentByName(componentName).icon}
      </Flex>
      <Flex justifyContent='center'>{name}</Flex>
    </Flex>
  );
};

export const PaletteItemOverlay = ({ name, data }: PaletteConfig) => {
  const width = useDraggableOverWidth();
  const component = componentByName(data?.componentName ?? name);
  return (
    <div className='draggable dragging' style={{ width }}>
      {component.render(data ? component.create(data) : component.defaultProps)}
    </div>
  );
};
