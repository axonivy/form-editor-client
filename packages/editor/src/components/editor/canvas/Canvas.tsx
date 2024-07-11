import './Canvas.css';
import type { Config } from '../../../types/config';
import { Draggable } from './Draggable';
import { useAppContext } from '../../../context/useData';
import { DropZone, type DropZoneProps } from './DropZone';
import type { Component, ComponentData } from '@axonivy/form-editor-protocol';
import { CANVAS_DROPZONE_ID } from '../../../data/data';

type CanvasProps = {
  config: Config;
};

export const Canvas = ({ config }: CanvasProps) => {
  const { ui, data } = useAppContext();
  return (
    <div className='canvas' data-help-paddings={ui.helpPaddings} data-responsive-mode={ui.responsiveMode}>
      {data.components.map((component, index) => (
        <ComponentBlock key={component.id} component={component} config={config} preId={data.components.at(index - 1)?.id} />
      ))}
      <EmtpyBlock id={CANVAS_DROPZONE_ID} preId={data.components.at(-1)?.id ?? ''} />
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

export const EmtpyBlock = ({ id, preId, forLayout }: { id: string; preId: string; forLayout?: boolean }) => (
  <DropZone id={id} preId={preId}>
    <div className={`empty-block${forLayout ? ' for-layout' : ''}`} />
  </DropZone>
);
