import './Canvas.css';
import { useAppContext } from '../../context/AppContext';
import { CANVAS_DROPZONE_ID, DELETE_DROPZONE_ID } from '../../data/data';
import { cn, IvyIcon } from '@axonivy/ui-components';
import { useDndContext, useDroppable } from '@dnd-kit/core';
import { IvyIcons } from '@axonivy/ui-icons';
import { ComponentBlock } from './ComponentBlock';
import { EmtpyBlock } from './EmptyBlock';
import { isDragData } from './drag-data';

export const Canvas = () => {
  const { ui, data } = useAppContext();
  return (
    <div className='canvas' data-help-paddings={ui.helpPaddings} data-responsive-mode={ui.deviceMode}>
      {data.components.map((component, index) => (
        <ComponentBlock key={component.id} component={component} preId={data.components.at(index - 1)?.id} />
      ))}
      <EmtpyBlock
        id={CANVAS_DROPZONE_ID}
        preId={data.components.at(-1)?.id ?? ''}
        dragHint={{ display: data.components.length === 0, message: 'Drag first element inside the canvas', mode: 'column' }}
      />
      <DeleteDropZone />
    </div>
  );
};

const DeleteDropZone = () => {
  const { active } = useDndContext();
  const { isOver, setNodeRef } = useDroppable({ id: DELETE_DROPZONE_ID });
  if (!isDragData(active?.data.current)) {
    return null;
  }
  return (
    <div ref={setNodeRef} className={cn('delete-drop-zone', active && 'dnd-active', isOver && 'is-drop-target')}>
      <IvyIcon icon={IvyIcons.Trash} className='delete-icon' />
    </div>
  );
};
