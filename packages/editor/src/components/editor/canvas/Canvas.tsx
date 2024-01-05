import './Canvas.css';
import type { Config } from '../../../types/config';
import { Draggable } from './Draggable';
import { useAppContext } from '../../../data/useData';
import { DropZone } from './DropZone';
import { Fragment } from 'react';

type CanvasProps = {
  config: Config;
};

export const Canvas = ({ config }: CanvasProps) => {
  const { data } = useAppContext();
  return (
    <div className='canvas'>
      {data.content.map(obj => (
        <Fragment key={obj.id}>
          <DropZone id={obj.id}>
            <Draggable key={obj.id} config={config.components[obj.type]} data={obj} />
          </DropZone>
        </Fragment>
      ))}
      <DropZone id='canvas' visible={true} />
    </div>
  );
};
