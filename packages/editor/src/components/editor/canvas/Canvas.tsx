import './Canvas.css';
import type { Config } from '../../../types/config';
import { Draggable } from './Draggable';
import { useAppContext } from '../../../context/useData';
import { DropZone, type DropZoneProps } from './DropZone';
import type { Component, ComponentData } from '@axonivy/form-editor-protocol';
import { CANVAS_DROPZONE_ID } from '../../../data/data';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './ErrorFallback';

type CanvasProps = {
  config: Config;
};

export const Canvas = ({ config }: CanvasProps) => {
  const { ui, data } = useAppContext();
  return (
    <div className='canvas' data-help-paddings={ui.helpPaddings} data-responsive-mode={ui.responsiveMode}>
      <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[ui.dataStructure]}>
        {data.components.map((component, index) => (
          <ComponentBlock key={component.id} component={component} config={config} preId={data.components[index - 1]?.id} />
        ))}
        <EmtpyBlock id={CANVAS_DROPZONE_ID} preId={data.components[data.components.length - 1]?.id} />
      </ErrorBoundary>
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

export const EmtpyBlock = ({ id, preId }: { id: string; preId: string }) => (
  <DropZone id={id} preId={preId}>
    <div className='empty-block' />
  </DropZone>
);
