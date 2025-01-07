import type { Component, ComponentData, ComponentType } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../context/AppContext';
import type { ComponentConfig } from '../../types/config';
import './ComponentBlock.css';
import { useDraggable } from '@dnd-kit/core';
import { creationTargetId, modifyData, TABLE_DROPZONE_ID_PREFIX, useData } from '../../data/data';
import { dragData } from './drag-data';
import { Button, cn, evalDotState, Flex, Popover, PopoverAnchor, PopoverContent, Separator, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { Palette } from '../palette/Palette';
import { allComponentsByCategory, componentByName } from '../../components/components';
import { DropZone, type DropZoneProps } from './DropZone';
import { useValidations } from '../../context/useValidation';
import { DataClassDialog } from '../browser/data-class/DataClassDialog';
import { useClipboard, type TextDropItem } from 'react-aria';

type ComponentBlockProps = Omit<DropZoneProps, 'id'> & {
  component: ComponentData | Component;
  preId?: string;
};

export const ComponentBlock = ({ component, preId, ...props }: ComponentBlockProps) => (
  <DropZone id={component.cid} type={component.type} preId={preId} {...props}>
    <Draggable config={componentByName(component.type)} data={component} />
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
  const { isDragging, attributes, listeners, setNodeRef } = useDraggable({ disabled: readonly, id: data.cid, data: dragData(data) });
  const { selectedElement, setSelectedElement } = useAppContext();
  const isSelected = selectedElement === data.cid;
  const elementConfig = { ...config.defaultProps, ...data.config };
  const deleteElement = () => {
    setData(oldData => modifyData(oldData, { type: 'remove', data: { id: data.cid } }).newData);
    setSelectedElement(undefined);
  };
  const duplicateElement = () => setData(oldData => modifyData(oldData, { type: 'paste', data: { id: data.cid } }).newData);
  const createColumn = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: { componentName: 'DataTableColumn', targetId: TABLE_DROPZONE_ID_PREFIX + data.cid }
        }).newData
    );
  };
  const createElement = (name: ComponentType) =>
    setData(
      oldData =>
        modifyData(oldData, { type: 'add', data: { componentName: name, targetId: creationTargetId(oldData.components, data.cid) } })
          .newData
    );
  const validations = useValidations(data.cid);
  const { clipboardProps } = useClipboard({
    getItems() {
      return [{ 'text/plain': data.cid }];
    },
    async onPaste(items) {
      const item = items.filter(item => item.kind === 'text' && item.types.has('text/plain'))[0] as TextDropItem;
      const cid = await item.getText('text/plain');
      setData(old => modifyData(old, { type: 'paste', data: { id: cid, targetId: data.cid } }).newData);
    }
  });
  return (
    <Popover open={isSelected && !isDragging}>
      <PopoverAnchor asChild>
        <div
          onClick={e => {
            e.stopPropagation();
            setSelectedElement(data.cid);
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            setUi(old => ({ ...old, properties: true }));
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              setSelectedElement(data.cid);
            }
            if (e.key === 'Delete') {
              e.stopPropagation();
              deleteElement();
            }
            if (e.key === 'ArrowUp') {
              e.stopPropagation();
              setData(oldData => modifyData(oldData, { type: 'moveUp', data: { id: data.cid } }).newData);
            }
            if (e.key === 'ArrowDown') {
              e.stopPropagation();
              setData(oldData => modifyData(oldData, { type: 'moveDown', data: { id: data.cid } }).newData);
            }
          }}
          className={cn(
            'draggable',
            isSelected && 'selected',
            isDragging && 'dragging',
            validations.length > 0 && `validation ${evalDotState(validations, undefined)}`
          )}
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          {...clipboardProps}
        >
          {config.render({ ...elementConfig, id: data.cid })}
        </div>
      </PopoverAnchor>
      <Quickbar
        deleteAction={config.quickActions.includes('DELETE') ? deleteElement : undefined}
        duplicateAction={config.quickActions.includes('DUPLICATE') ? duplicateElement : undefined}
        createAction={config.quickActions.includes('CREATE') ? createElement : undefined}
        createFromDataAction={config.quickActions.includes('CREATEFROMDATA') ? data.cid : undefined}
        createColumnAction={config.quickActions.includes('CREATECOLUMN') ? createColumn : undefined}
      />
    </Popover>
  );
};

export const ComponentBlockOverlay = ({ config, data }: DraggableProps) => {
  const elementConfig = { ...config.defaultProps, ...data.config };
  return <div className='draggable dragging'>{config.render({ ...elementConfig, id: data.cid })}</div>;
};

type QuickbarProps = {
  deleteAction?: () => void;
  duplicateAction?: () => void;
  createAction?: (name: ComponentType) => void;
  createColumnAction?: () => void;
  createFromDataAction?: string;
};

const Quickbar = ({ deleteAction, duplicateAction, createAction, createColumnAction, createFromDataAction }: QuickbarProps) => {
  const [menu, setMenu] = useState(false);
  return (
    <PopoverContent className='quickbar' sideOffset={8} onOpenAutoFocus={e => e.preventDefault()} hideWhenDetached={true}>
      <Popover open={menu} onOpenChange={change => setMenu(change)}>
        <PopoverAnchor asChild>
          <Flex gap={1}>
            {deleteAction && <Button icon={IvyIcons.Trash} aria-label='Delete' title='Delete' onClick={deleteAction} />}
            {duplicateAction && <Button icon={IvyIcons.Duplicate} aria-label='Duplicate' title='Duplicate' onClick={duplicateAction} />}
            {(createColumnAction || createAction || createFromDataAction) && (
              <Separator orientation='vertical' style={{ height: 20, margin: '0 var(--size-1)' }} />
            )}
            {createColumnAction && (
              <Button
                icon={IvyIcons.PoolSwimlanes}
                rotate={90}
                aria-label='Create Column'
                title='Create Column'
                onClick={createColumnAction}
              />
            )}
            {/* <Button icon={IvyIcons.ChangeType} title='Change Type' /> */}
            {createFromDataAction && (
              <DataClassDialog worfkflowButtonsInit={false} creationTarget={createFromDataAction}>
                <Button
                  icon={IvyIcons.DatabaseLink}
                  size='small'
                  aria-label='Create from data'
                  title='Create from data'
                  onClick={e => {
                    e.stopPropagation();
                  }}
                />
              </DataClassDialog>
            )}
            {createAction && (
              <Button
                icon={IvyIcons.Task}
                aria-label='All Components'
                title='All Components'
                onClick={e => {
                  e.stopPropagation();
                  setMenu(old => !old);
                }}
              />
            )}
          </Flex>
        </PopoverAnchor>
        <PopoverContent className='quickbar-menu' sideOffset={8} onClick={e => e.stopPropagation()}>
          <Palette sections={allComponentsByCategory()} directCreate={type => createAction?.(type as ComponentType)} />
        </PopoverContent>
      </Popover>
    </PopoverContent>
  );
};
