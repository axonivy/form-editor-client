import type { Component, ComponentData } from '@axonivy/form-editor-protocol';
import { useAppContext, useData } from '../../context/useData';
import type { ComponentConfig } from '../../types/config';
import './Draggable.css';
import { useDraggable } from '@dnd-kit/core';
import { modifyData } from '../../data/data';
import { dragData } from './drag-data';
import { useReadonly } from '@axonivy/ui-components';

type DraggableProps = {
  config: ComponentConfig;
  data: Component | ComponentData;
};

export const Draggable = ({ config, data }: DraggableProps) => {
  const { setUi } = useAppContext();
  const { setData } = useData();
  const readonly = useReadonly();
  const { isDragging, attributes, listeners, setNodeRef } = useDraggable({ disabled: readonly, id: data.id, data: dragData(data) });
  const appContext = useAppContext();
  const isSelected = appContext.selectedElement === data.id;
  const elementConfig = { ...config.defaultProps, ...data.config };
  return (
    <div
      onClick={e => {
        e.stopPropagation();
        appContext.setSelectedElement(data.id);
      }}
      onDoubleClick={e => {
        e.stopPropagation();
        setUi(old => ({ ...old, properties: true }));
      }}
      onKeyUp={e => {
        e.stopPropagation();
        if (e.key === 'Delete') {
          setData(oldData => modifyData(oldData, { type: 'remove', data: { id: data.id } }).newData);
          appContext.setSelectedElement(undefined);
        }
        if (e.key === 'ArrowUp') {
          setData(oldData => modifyData(oldData, { type: 'moveUp', data: { id: data.id } }).newData);
        }
        if (e.key === 'ArrowDown') {
          setData(oldData => modifyData(oldData, { type: 'moveDown', data: { id: data.id } }).newData);
        }
      }}
      className={`draggable${isSelected ? ' selected' : ''}${isDragging ? ' dragging' : ''}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {config.render({ ...elementConfig, id: data.id })}
    </div>
  );
};

export const DraggableOverlay = ({ config, data }: DraggableProps) => {
  const elementConfig = { ...config.defaultProps, ...data.config };
  return <div className='draggable dragging'>{config.render({ ...elementConfig, id: data.id })}</div>;
};
