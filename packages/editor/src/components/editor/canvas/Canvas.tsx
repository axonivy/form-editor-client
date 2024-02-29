import './Canvas.css';
import type { Config } from '../../../types/config';
import { Draggable } from './Draggable';
import { useAppContext } from '../../../context/useData';
import { DropZone } from './DropZone';
import type { Component, ComponentData } from '@axonivy/form-editor-protocol';
import { CANVAS_DROPZONE_ID } from '../../../data/data';

type CanvasProps = {
  config: Config;
};

export const Canvas = ({ config }: CanvasProps) => {
  const { data } = useAppContext();
  return (
    <div className='canvas'>
      {data.components.map(obj => (
        <ComponentBlock key={obj.id} component={obj} config={config} />
      ))}
      <DropZone id={CANVAS_DROPZONE_ID} visible={true} />
    </div>
  );
};

export const ComponentBlock = ({ component, config }: { component: ComponentData | Component; config: Config }) => (
  <DropZone id={component.id}>
    <Draggable config={config.components[component.type]} data={component} />
  </DropZone>
);
