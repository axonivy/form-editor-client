import './Canvas.css';
import type { Config } from '../../types/config';
import { Draggable } from './Draggable';
import { useAppContext } from '../../context/useData';
import { DropZone, type DropZoneProps } from './DropZone';
import type { Component, ComponentData } from '@axonivy/form-editor-protocol';
import { CANVAS_DROPZONE_ID, DELETE_DROPZONE_ID } from '../../data/data';
import { cn, Flex, IvyIcon, PanelMessage } from '@axonivy/ui-components';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { DataClassDialog } from './data-class/DataClassDialog';
import { IvyIcons } from '@axonivy/ui-icons';

type CanvasProps = {
  config: Config;
};

export const Canvas = ({ config }: CanvasProps) => {
  const { ui, data } = useAppContext();
  const { droppableContainers } = useDndContext();

  return (
    <div className='canvas' data-help-paddings={ui.helpPaddings} data-responsive-mode={ui.deviceMode}>
      {data.components.map((component, index) => (
        <ComponentBlock key={component.id} component={component} config={config} preId={data.components.at(index - 1)?.id} />
      ))}
      <EmtpyBlock
        id={CANVAS_DROPZONE_ID}
        preId={data.components.at(-1)?.id ?? ''}
        dragHint={{ display: droppableContainers.size === 1, message: 'Drag first element inside the canvas', mode: 'column' }}
      />
      <DeleteDropZone />
    </div>
  );
};

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

type EmptyBlockProps = {
  id: string;
  preId: string;
  forLayout?: boolean;
  dragHint?: { display: boolean; mode: 'row' | 'column'; message: string };
};

export const EmtpyBlock = ({ id, preId, forLayout, dragHint }: EmptyBlockProps) => (
  <DropZone id={id} preId={preId}>
    {dragHint?.display ? (
      <>
        <PanelMessage message={dragHint.message} mode={dragHint.mode} className={cn('drag-hint', dragHint.mode)} />
        {!forLayout && (
          <Flex justifyContent='center'>
            <DataClassDialog />
          </Flex>
        )}
      </>
    ) : (
      <div className={cn('empty-block', forLayout && 'for-layout')} />
    )}
  </DropZone>
);

const DeleteDropZone = () => {
  const dnd = useDndContext();
  const { isOver, setNodeRef } = useDroppable({ id: DELETE_DROPZONE_ID });
  return (
    <div ref={setNodeRef} className={cn('delete-drop-zone', dnd.active && 'dnd-active', isOver && 'is-drop-target')}>
      <IvyIcon icon={IvyIcons.Trash} className='delete-icon' />
    </div>
  );
};
