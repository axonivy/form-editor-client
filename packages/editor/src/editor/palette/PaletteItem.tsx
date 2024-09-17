import { useDraggable } from '@dnd-kit/core';
import './PaletteItem.css';
import { componentByName } from '../../components/components';
import { Flex } from '@axonivy/ui-components';
import type { CreateComponentData } from '../../types/config';

export type PaletteConfig = {
  name: string;
  description: string;
  data?: CreateComponentData;
  directCreate?: (name: string) => void;
};

export const PaletteItem = ({ name, description, data, directCreate }: PaletteConfig) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: name, data });
  const componentName = data?.componentName ?? name;
  return (
    <Flex
      className='palette-item'
      direction='column'
      gap={1}
      alignItems='center'
      title={description}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => directCreate?.(name)}
      style={directCreate ? { cursor: 'pointer' } : undefined}
    >
      <Flex className='palette-item-icon' justifyContent='center' alignItems='center'>
        {componentByName(componentName).icon}
      </Flex>
      <Flex justifyContent='center'>{name}</Flex>
    </Flex>
  );
};

export const PaletteItemOverlay = ({ name, data }: PaletteConfig) => {
  const component = componentByName(data?.componentName ?? name);
  return (
    <div className='draggable dragging' style={{ width: 400 }}>
      {component.render(data ? component.create(data) : component.defaultProps)}
    </div>
  );
};
