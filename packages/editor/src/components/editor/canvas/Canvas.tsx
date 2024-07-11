import './Canvas.css';
import type { Config } from '../../../types/config';
import { Draggable } from './Draggable';
import { useAppContext } from '../../../context/useData';
import { DropZone, type DropZoneProps } from './DropZone';
import type { Component, ComponentData } from '@axonivy/form-editor-protocol';
import { CANVAS_DROPZONE_ID } from '../../../data/data';
import { EmptyDetail } from '@axonivy/ui-components';
import { useDndContext } from '@dnd-kit/core';

type CanvasProps = {
  config: Config;
};

export const Canvas = ({ config }: CanvasProps) => {
  const { ui, data } = useAppContext();
  const { droppableContainers } = useDndContext();

  return (
    <div className='canvas' data-help-paddings={ui.helpPaddings} data-responsive-mode={ui.responsiveMode}>
      {data.components.map((component, index) => (
        <ComponentBlock key={component.id} component={component} config={config} preId={data.components.at(index - 1)?.id} />
      ))}
      <EmtpyBlock
        id={CANVAS_DROPZONE_ID}
        preId={data.components.at(-1)?.id ?? ''}
        dragHint={{ display: droppableContainers.size === 1, message: 'Drag first element inside the canvase', mode: 'column' }}
      />
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

export const EmtpyBlock = ({
  id,
  preId,
  forLayout,
  dragHint
}: {
  id: string;
  preId: string;
  forLayout?: boolean;
  dragHint?: { display: boolean; mode: 'row' | 'column'; message: string };
}) => (
  <DropZone id={id} preId={preId}>
    {dragHint?.display ? (
      <EmptyDetail message={dragHint.message} mode={dragHint.mode} className={`drag-hint ${dragHint.mode === 'column' ? 'column' : ''}`} />
    ) : (
      <div className={`empty-block${forLayout ? ' for-layout' : ''}`} />
    )}
  </DropZone>
);
