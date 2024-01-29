import './Canvas.css';
import type { Config } from '../../../types/config';
import { Draggable } from './Draggable';
import { useAppContext } from '../../../context/useData';
import { DropZone } from './DropZone';
import { Fragment } from 'react';

type CanvasProps = {
  config: Config;
};

export const Canvas = ({ config }: CanvasProps) => {
  const { data } = useAppContext();
  return (
    <div className='canvas'>
      {data.components.map(obj => (
        <Fragment key={obj.id}>
          <DropZone id={obj.id}>
            <Draggable config={config.components[obj.type]} data={obj} />
          </DropZone>
        </Fragment>
      ))}
      <DropZone id='canvas' visible={true} />
    </div>
  );
};
