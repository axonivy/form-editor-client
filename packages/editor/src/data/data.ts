import type { ComponentConfig, CreateData } from '../types/config';
import { componentByName } from '../components/components';
import { add, remove } from '../utils/array';
import { v4 as uuid } from 'uuid';
import { isLayout, type ComponentData, type FormData } from '@axonivy/form-editor-protocol';

export const CANVAS_DROPZONE_ID = 'canvas';
export const DELETE_DROPZONE_ID = 'delete';
export const LAYOUT_DROPZONE_ID_PREFIX = 'layout-';

const findComponent = (
  data: Array<ComponentData>,
  id: string,
  parent?: ComponentData
): { data: Array<ComponentData>; index: number; parent?: ComponentData } | undefined => {
  if (id === CANVAS_DROPZONE_ID) {
    return { data, index: data.length };
  }
  if (id.startsWith(LAYOUT_DROPZONE_ID_PREFIX)) {
    return findLayoutComponent(data, id.replace(LAYOUT_DROPZONE_ID_PREFIX, ''));
  }
  return findComponentDeep(data, id, parent);
};

const findComponentDeep = (data: Array<ComponentData>, id: string, parent?: ComponentData) => {
  const index = data.findIndex(obj => obj.id === id);
  if (index < 0) {
    for (const element of data) {
      if (isLayout(element)) {
        const find = findComponent(element.config.components, id, element);
        if (find) {
          return find;
        }
      }
    }
    return;
  }
  return { data, index, parent };
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

const addComponent = (data: Array<ComponentData>, component: ComponentData, id: string) => {
  const find = findComponent(data, id);
  if (find) {
    add(find.data, component, find.index);
    return component.id;
  }
  data.push(component);
  return component.id;
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
        targetId: string;
        create?: CreateData;
      };
    }
  | { type: 'add'; data: { create: CreateData; targetId?: string } }
  | {
      type: 'remove' | 'moveUp' | 'moveDown';
      data: { id: string };
    };

const dndModify = (data: Array<ComponentData>, action: Extract<ModifyAction, { type: 'dnd' }>['data']) => {
  const component = componentByName(action.activeId);
  if (component) {
    return addComponent(data, createComponentData(component, action.create), action.targetId);
  } else {
    const removed = removeComponent(data, action.activeId);
    if (removed && action.targetId !== DELETE_DROPZONE_ID) {
      return addComponent(data, removed, action.targetId);
    }
    return undefined;
  }
};

const createComponentData = (config: ComponentConfig, data?: CreateData): ComponentData => ({
  id: `${config.name}-${uuid()}`,
  type: config.name,
  config: (data ? config.create(data) : structuredClone(config.defaultProps)) as Extract<ComponentData, 'config'>
});

export const modifyData = (data: FormData, action: ModifyAction) => {
  const newData = structuredClone(data);
  let newComponentId;
  switch (action.type) {
    case 'dnd':
      newComponentId = dndModify(newData.components, action.data);
      break;
    case 'add':
      newComponentId = addComponent(
        newData.components,
        createComponentData(componentByName(action.data.create.componentName), action.data.create),
        action.data.targetId ?? CANVAS_DROPZONE_ID
      );
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
  return { newData, newComponentId };
};

export const findComponentElement = (data: FormData, id: string) => {
  const find = findComponent(data.components, id);
  if (find) {
    return { element: find.data[find.index], parent: find.parent };
  }
  return;
};

export const createInitForm = (data: FormData, creates: Array<CreateData>, workflowButtons: boolean) => {
  creates.forEach(create => {
    data = modifyData(data, { type: 'add', data: { create } }).newData;
  });
  if (workflowButtons) {
    const { newData, newComponentId } = modifyData(data, {
      type: 'add',
      data: { create: { componentName: 'Layout', label: '', value: '', defaultProps: { type: 'FLEX', justifyContent: 'END' } } }
    });
    const layoutId = `${LAYOUT_DROPZONE_ID_PREFIX}${newComponentId}`;
    data = modifyData(newData, {
      type: 'add',
      data: {
        create: { componentName: 'Button', label: 'Cancel', value: '#{ivyWorkflowView.cancel()}', defaultProps: { variant: 'SECONDARY' } },
        targetId: layoutId
      }
    }).newData;
    data = modifyData(data, {
      type: 'add',
      data: {
        create: { componentName: 'Button', label: 'Proceed', value: '#{logic.close}', defaultProps: { variant: 'PRIMARY' } },
        targetId: layoutId
      }
    }).newData;
  }
  return data;
};
