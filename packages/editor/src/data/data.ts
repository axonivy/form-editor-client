import type { UniqueIdentifier } from '@dnd-kit/core';
import type { ComponentConfig } from '../types/config';
import { componentByName } from '../components/components';
import { move } from '../utils/array';
import { v4 as uuid } from 'uuid';
import type { ComponentData, FormData } from '@axonivy/form-editor-protocol';

const targetIndex = (data: ComponentData[], target: UniqueIdentifier) => {
  const id = `${target}`.replace('DropZone-', '');
  const targetIndex = data.findIndex(obj => obj.id === id);
  if (targetIndex === -1) {
    return data.length;
  }
  return targetIndex;
};

const addNewComponent = (component: ComponentConfig, data: ComponentData[], target: UniqueIdentifier) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data.push({ id: `${component.name}-${uuid()}`, type: component.name, config: structuredClone<any>(component.defaultProps) });
  move(data, data.length - 1, targetIndex(data, target));
};

const moveComponent = (id: string, data: ComponentData[], target: UniqueIdentifier) => {
  const element = data.find(obj => obj.id === id);
  if (element) {
    const fromIndex = data.indexOf(element);
    const toIndex = targetIndex(data, target);
    move(data, fromIndex, fromIndex < toIndex ? toIndex - 1 : toIndex);
  }
};

export const modifyData = (data: FormData, activeId: string, targetId: UniqueIdentifier) => {
  const newData = structuredClone(data);
  const component = componentByName(activeId);
  if (component) {
    addNewComponent(component, newData.components, targetId);
  } else {
    moveComponent(activeId, newData.components, targetId);
  }
  return newData;
};
