import { useDraggable } from '@dnd-kit/core';
import './PaletteItem.css';
import { Flex } from '@axonivy/ui-components';
import type { CreateComponentData } from '../../types/config';
import { useSharedComponents } from '../../context/ComponentsContext';

export type PaletteConfig = {
  name: string;
  displayName: string;
  description: string;
  data?: CreateComponentData;
  directCreate?: (name: string) => void;
};

export const PaletteItem = ({ name, displayName, description, data, directCreate }: PaletteConfig) => {
  const { componentByName } = useSharedComponents();
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
      <Flex justifyContent='center'>{displayName}</Flex>
    </Flex>
  );
};

export const PaletteItemOverlay = ({ name, data }: PaletteConfig) => {
  const { componentByName } = useSharedComponents();
  const component = componentByName(data?.componentName ?? name);
  return (
    <div className='draggable dragging' style={{ width: 400 }}>
      {component.render(data ? component.create(data) : component.defaultProps)}
    </div>
  );
};
