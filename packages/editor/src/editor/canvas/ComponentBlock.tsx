import type { Component, ComponentData } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../context/AppContext';
import type { ComponentConfig, Config } from '../../types/config';
import './ComponentBlock.css';
import { useDraggable } from '@dnd-kit/core';
import { modifyData, useData } from '../../data/data';
import { dragData } from './drag-data';
import { Button, cn, Flex, Popover, PopoverAnchor, PopoverContent, Separator, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { Palette } from '../palette/Palette';
import { allComponentsByCategory } from '../../components/components';
import { DropZone, type DropZoneProps } from './DropZone';

type ComponentBlockProps = Omit<DropZoneProps, 'id'> & {
  component: ComponentData | Component;
  config: Config;
  preId?: string;
};

export const ComponentBlock = ({ component, config, preId, ...props }: ComponentBlockProps) => (
  <DropZone id={component.id} preId={preId} {...props}>
    <Draggable config={config.components[component.type]} data={component} />
  </DropZone>
);

type DraggableProps = {
  config: ComponentConfig;
  data: Component | ComponentData;
};

const Draggable = ({ config, data }: DraggableProps) => {
  const { setUi } = useAppContext();
  const { setData } = useData();
  const readonly = useReadonly();
  const { isDragging, attributes, listeners, setNodeRef } = useDraggable({ disabled: readonly, id: data.id, data: dragData(data) });
  const { selectedElement, setSelectedElement } = useAppContext();
  const isSelected = selectedElement === data.id;
  const elementConfig = { ...config.defaultProps, ...data.config };
  const deleteElement = () => {
    setData(oldData => modifyData(oldData, { type: 'remove', data: { id: data.id } }).newData);
    setSelectedElement(undefined);
  };
  const duplicateElement = () => setData(oldData => modifyData(oldData, { type: 'duplicate', data: { id: data.id } }).newData);
  const createElement = (name: string) =>
    setData(oldData => modifyData(oldData, { type: 'add', data: { componentName: name, targetId: data.id } }).newData);
  return (
    <Popover open={isSelected && !isDragging}>
      <PopoverAnchor asChild>
        <div
          onClick={e => {
            e.stopPropagation();
            setSelectedElement(data.id);
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            setUi(old => ({ ...old, properties: true }));
          }}
          onKeyUp={e => {
            e.stopPropagation();
            if (e.key === 'Delete') {
              deleteElement();
            }
            if (e.key === 'ArrowUp') {
              setData(oldData => modifyData(oldData, { type: 'moveUp', data: { id: data.id } }).newData);
            }
            if (e.key === 'ArrowDown') {
              setData(oldData => modifyData(oldData, { type: 'moveDown', data: { id: data.id } }).newData);
            }
          }}
          className={cn('draggable', isSelected && 'selected', isDragging && 'dragging')}
          ref={setNodeRef}
          {...listeners}
          {...attributes}
        >
          {config.render({ ...elementConfig, id: data.id })}
        </div>
      </PopoverAnchor>
      <Quickbar deleteAction={deleteElement} duplicateAction={duplicateElement} createAction={createElement} />
    </Popover>
  );
};

export const ComponentBlockOverlay = ({ config, data }: DraggableProps) => {
  const elementConfig = { ...config.defaultProps, ...data.config };
  return <div className='draggable dragging'>{config.render({ ...elementConfig, id: data.id })}</div>;
};

type QuickbarProps = {
  deleteAction: () => void;
  duplicateAction: () => void;
  createAction: (name: string) => void;
};

const Quickbar = ({ deleteAction, duplicateAction, createAction }: QuickbarProps) => {
  const [menu, setMenu] = useState(false);
  return (
    <PopoverContent className='quickbar' sideOffset={8} onOpenAutoFocus={e => e.preventDefault()}>
      <Popover open={menu} onOpenChange={change => setMenu(change)}>
        <PopoverAnchor asChild>
          <Flex gap={1}>
            <Button icon={IvyIcons.Trash} title='Delete' onClick={deleteAction} />
            <Button icon={IvyIcons.SubActivitiesDashed} title='Duplicate' onClick={duplicateAction} />
            {/* <Button icon={IvyIcons.ChangeType} title='Change Type' /> */}
            <Separator orientation='vertical' style={{ height: 20, margin: '0 var(--size-1)' }} />
            <Button
              icon={IvyIcons.Task}
              title='All Components'
              onClick={e => {
                e.stopPropagation();
                setMenu(old => !old);
              }}
            />
          </Flex>
        </PopoverAnchor>
        <PopoverContent className='quickbar-menu' sideOffset={8} onClick={e => e.stopPropagation()}>
          <Palette sections={allComponentsByCategory()} directCreate={createAction} />
        </PopoverContent>
      </Popover>
    </PopoverContent>
  );
};
