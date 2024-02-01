import type { UniqueIdentifier } from '@dnd-kit/core';
import type { ComponentConfig } from '../types/config';
import { componentByName } from '../components/components';
import { add, remove } from '../utils/array';
import { v4 as uuid } from 'uuid';
import { isLayout, type ComponentData, type FormData } from '@axonivy/form-editor-protocol';

export const CANVAS_DROPZONE_ID = 'canvas';
export const LAYOUT_DROPZONE_ID_PREFIX = 'layout-';

const findComponent = (data: Array<ComponentData>, id: string): { data: Array<ComponentData>; index: number } | undefined => {
  if (id === CANVAS_DROPZONE_ID) {
    return { data, index: data.length };
  }
  if (id.startsWith(LAYOUT_DROPZONE_ID_PREFIX)) {
    return findLayoutComponent(data, id.replace(LAYOUT_DROPZONE_ID_PREFIX, ''));
  }
  return findComponentDeep(data, id);
};

const findComponentDeep = (data: Array<ComponentData>, id: string) => {
  const index = data.findIndex(obj => obj.id === id);
  if (index < 0) {
    for (const element of data) {
      if (isLayout(element)) {
        const find = findComponent(element.config.components, id);
        if (find) {
          return find;
        }
      }
    }
    return;
  }
  return { data, index };
};

const findLayoutComponent = (data: Array<ComponentData>, id: string) => {
  const find = findComponentDeep(data, id);
  if (find) {
    const layout = find.data[find.index];
    if (isLayout(layout)) {
      const layoutData = layout.config.components;
      return { data: layoutData, index: layoutData.length };
    }
  }
  return;
};

const addNewComponent = (data: Array<ComponentData>, component: ComponentConfig, target: string) => {
  const newComponent: ComponentData = {
    id: `${component.name}-${uuid()}`,
    type: component.name,
    config: structuredClone(component.defaultProps) as Extract<ComponentData, 'config'>
  };
  addComponent(data, newComponent, target);
};

const addComponent = (data: Array<ComponentData>, component: ComponentData, id: string) => {
  const find = findComponent(data, id);
  if (find) {
    add(find.data, component, find.index);
    return;
  }
  data.push(component);
};

const removeComponent = (data: Array<ComponentData>, id: string) => {
  const find = findComponent(data, id);
  if (find) {
    return remove(find.data, find.index);
  }
  return;
};

const moveComponent = (data: Array<ComponentData>, id: string, indexMove: number) => {
  const find = findComponent(data, id);
  if (find) {
    const removed = remove(find.data, find.index);
    const moveIndex = find.index + indexMove < 0 ? 0 : find.index + indexMove;
    add(find.data, removed, moveIndex);
  }
  return;
};

type ModifyAction =
  | {
      type: 'dnd';
      data: {
        activeId: string;
        targetId: UniqueIdentifier;
      };
    }
  | {
      type: 'remove' | 'moveUp' | 'moveDown';
      data: { id: string };
    };

const dndModify = (data: Array<ComponentData>, action: Extract<ModifyAction, { type: 'dnd' }>['data']) => {
  const component = componentByName(action.activeId);
  if (component) {
    addNewComponent(data, component, action.targetId as string);
  } else {
    const removed = removeComponent(data, action.activeId);
    if (removed) {
      addComponent(data, removed, action.targetId as string);
    }
  }
};

export const modifyData = (data: FormData, action: ModifyAction) => {
  const newData = structuredClone(data);
  switch (action.type) {
    case 'dnd':
      dndModify(newData.components, action.data);
      break;
    case 'remove':
      removeComponent(newData.components, action.data.id);
      break;
    case 'moveUp':
      moveComponent(newData.components, action.data.id, -1);
      break;
    case 'moveDown':
      moveComponent(newData.components, action.data.id, 1);
      break;
  }
  return newData;
};
