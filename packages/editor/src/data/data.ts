import type { UniqueIdentifier } from '@dnd-kit/core';
import type { ComponentConfig, DefaultComponentProps } from '../types/config';
import { componentByName } from '../components/components';
import { move } from '../utils/array';
import { v4 as uuid } from 'uuid';

export type ContentData = {
  id: string;
  type: string;
  props: DefaultComponentProps;
};

export type UiEditorData = {
  root: {};
  content: ContentData[];
};

const targetIndex = (data: ContentData[], target: UniqueIdentifier) => {
  const id = `${target}`.replace('DropZone-', '');
  const targetIndex = data.findIndex(obj => obj.id === id);
  if (targetIndex === -1) {
    return data.length;
  }
  return targetIndex;
};

const addNewComponent = (component: ComponentConfig, data: ContentData[], target: UniqueIdentifier) => {
  data.push({ id: `${component.name}-${uuid()}`, type: component.name, props: structuredClone(component.defaultProps) });
  move(data, data.length - 1, targetIndex(data, target));
};

const moveComponent = (id: string, data: ContentData[], target: UniqueIdentifier) => {
  const element = data.find(obj => obj.id === id);
  if (element) {
    const fromIndex = data.indexOf(element);
    const toIndex = targetIndex(data, target);
    move(data, fromIndex, fromIndex < toIndex ? toIndex - 1 : toIndex);
  }
};

export const modifyData = (data: UiEditorData, activeId: string, targetId: UniqueIdentifier) => {
  const newData = structuredClone(data);
  const component = componentByName(activeId);
  if (component) {
    addNewComponent(component, newData.content, targetId);
  } else {
    moveComponent(activeId, newData.content, targetId);
  }
  return newData;
};
