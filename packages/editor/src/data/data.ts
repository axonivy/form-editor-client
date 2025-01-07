import type { ComponentConfig, CreateComponentData, CreateData } from '../types/config';
import { componentByName } from '../components/components';
import { add, remove } from '../utils/array';
import { isStructure, isTable, type ComponentData, type ComponentType, type DataTable, type FormData } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../context/AppContext';
import type { UpdateConsumer } from '../types/types';

export const CANVAS_DROPZONE_ID = 'canvas';
export const DELETE_DROPZONE_ID = 'delete';
export const STRUCTURE_DROPZONE_ID_PREFIX = 'layout-';
export const TABLE_DROPZONE_ID_PREFIX = 'table-';

const findComponent = (
  data: Array<ComponentData>,
  id: string,
  parent?: ComponentData
): { data: Array<ComponentData>; index: number; parent?: ComponentData } | undefined => {
  if (id === CANVAS_DROPZONE_ID) {
    return { data, index: data.length };
  }
  if (id.startsWith(STRUCTURE_DROPZONE_ID_PREFIX)) {
    return findStructureComponent(data, id.replace(STRUCTURE_DROPZONE_ID_PREFIX, ''));
  }
  if (id.startsWith(TABLE_DROPZONE_ID_PREFIX)) {
    return findTableComponent(data, id.replace(TABLE_DROPZONE_ID_PREFIX, ''));
  }
  return findComponentDeep(data, id, parent);
};

const findComponentDeep = (data: Array<ComponentData>, id: string, parent?: ComponentData) => {
  const index = data.findIndex(obj => obj.cid === id);
  if (index < 0) {
    for (const element of data) {
      if (isTable(element) || isStructure(element)) {
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

const findStructureComponent = (data: Array<ComponentData>, id: string) => {
  const find = findComponentDeep(data, id);
  if (find) {
    const structure = find.data[find.index];
    if (isStructure(structure)) {
      const structureData = structure.config.components;
      return { data: structureData, index: structureData.length };
    }
  }
  return;
};

const findTableComponent = (data: Array<ComponentData>, id: string) => {
  const find = findComponentDeep(data, id);
  if (find) {
    const table = find.data[find.index];
    if (isTable(table)) {
      const tableData = table.config.components;
      return { data: tableData, index: tableData.length };
    }
  }
  return;
};

export const findParentTableComponent = (data: Array<ComponentData>, element: ComponentData | undefined): DataTable | undefined => {
  for (const component of data) {
    if (component.type === 'DataTable') {
      const hasMatchingColumn = (component.config as unknown as DataTable).components.some(
        childComponent => childComponent.cid === element?.cid
      );
      if (hasMatchingColumn) {
        return component.config as unknown as DataTable;
      }
    }
  }
  return undefined;
};

const addComponent = (data: Array<ComponentData>, component: ComponentData, id: string) => {
  const find = findComponent(data, id);
  if (find) {
    add(find.data, component, find.index);
    return component.cid;
  }
  data.push(component);
  return component.cid;
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
  | { type: 'add'; data: { componentName: ComponentType; create?: CreateData; targetId?: string } }
  | { type: 'remove' | 'moveUp' | 'moveDown'; data: { id: string } }
  | { type: 'paste'; data: { id: string; targetId?: string } };

const dndModify = (data: Array<ComponentData>, action: Extract<ModifyAction, { type: 'dnd' }>['data']) => {
  const component = componentByName(action.activeId);
  if (component) {
    return addComponent(data, createComponentData(data, component, action.create), action.targetId);
  } else {
    const removed = removeComponent(data, action.activeId);
    if (removed && action.targetId !== DELETE_DROPZONE_ID) {
      return addComponent(data, removed, action.targetId);
    }
    return undefined;
  }
};

const createComponentData = (data: Array<ComponentData>, config: ComponentConfig, createData?: CreateData): ComponentData => ({
  cid: createId(data, config.name),
  type: config.name,
  config: (createData ? config.create(createData) : structuredClone(config.defaultProps)) as Extract<ComponentData, 'config'>
});

const createId = (components: Array<ComponentData>, name: ComponentType) => {
  const ids = allCids(components);
  const nextId = `${name}${highestIdNumber(ids) + 1}`.toLowerCase();
  if (ids.has(nextId)) {
    return createId(components, name);
  }
  return nextId;
};

const highestIdNumber = (ids: Set<string>): number => {
  const numbers = Array.from(ids)
    .map(id => {
      const match = id.match(/\d+$/);
      return match ? parseInt(match[0]) : -1;
    })
    .filter(num => num !== -1);
  return numbers.length > 0 ? Math.max(...numbers) : 0;
};

const allCids = (components: Array<ComponentData>) => {
  const ids = new Set<string>();
  for (const component of components) {
    ids.add(component.cid);
    if ('components' in component.config) {
      allCids(component.config.components as Array<ComponentData>).forEach(id => ids.add(id));
    }
  }
  return ids;
};

const pasteComponent = (data: FormData, id: string, targetId?: string) => {
  const newComponent = structuredClone(findComponentElement(data, id));
  if (newComponent) {
    const added = addComponent(data.components, newComponent.element, targetId ?? id);
    defineNewCid(data.components, newComponent.element);
    return added;
  }
  return undefined;
};

const defineNewCid = (components: Array<ComponentData>, component: ComponentData) => {
  component.cid = createId(components, component.type);
  if (isStructure(component)) {
    for (const child of component.config.components) {
      defineNewCid(components, child);
    }
  }
};

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
        createComponentData(newData.components, componentByName(action.data.componentName), action.data.create),
        action.data.targetId ?? CANVAS_DROPZONE_ID
      );
      break;
    case 'paste':
      pasteComponent(newData, action.data.id, action.data.targetId);
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

export const createInitTableColumns = (id: string, data: FormData, creates: Array<CreateComponentData>) => {
  creates.forEach(create => {
    data = modifyData(data, {
      type: 'add',
      data: { componentName: 'DataTableColumn', targetId: TABLE_DROPZONE_ID_PREFIX + id, create }
    }).newData;
  });
  return data;
};

export const createInitForm = (
  data: FormData,
  creates: Array<CreateComponentData>,
  workflowButtons: boolean,
  selectedElementId?: string
) => {
  creates.forEach(create => {
    data = modifyData(data, { type: 'add', data: { componentName: create.componentName, create, targetId: selectedElementId } }).newData;
  });
  if (workflowButtons) {
    const { newData, newComponentId } = modifyData(data, {
      type: 'add',
      data: {
        componentName: 'Layout',
        create: { label: '', value: '', defaultProps: { type: 'FLEX', justifyContent: 'END' } },
        targetId: selectedElementId
      }
    });
    const layoutId = `${STRUCTURE_DROPZONE_ID_PREFIX}${newComponentId}`;
    data = modifyData(newData, {
      type: 'add',
      data: {
        componentName: 'Button',
        create: { label: 'Cancel', value: '#{ivyWorkflowView.cancel()}', defaultProps: { variant: 'SECONDARY', processOnlySelf: true } },
        targetId: layoutId
      }
    }).newData;
    data = modifyData(data, {
      type: 'add',
      data: {
        componentName: 'Button',
        create: { label: 'Proceed', value: '#{logic.close}', defaultProps: { variant: 'PRIMARY' } },
        targetId: layoutId
      }
    }).newData;
  }
  return data;
};

export const creationTargetId = (data: Array<ComponentData>, elementId?: string) => {
  if (elementId === undefined) {
    return elementId;
  }
  const structure = findStructureComponent(data, elementId);
  if (structure) {
    return STRUCTURE_DROPZONE_ID_PREFIX + elementId;
  }
  return elementId;
};

export const useData = () => {
  const { data, setData, selectedElement, setSelectedElement, history } = useAppContext();
  const foundElement = selectedElement !== undefined ? findComponentElement(data, selectedElement) : undefined;
  const setHistoricisedData: UpdateConsumer<FormData> = updateData => {
    setData(old => {
      const newData = updateData(old);
      history.pushHistory(newData);
      return newData;
    });
  };
  const setElement: UpdateConsumer<ComponentData> = updateElement => {
    setHistoricisedData(oldData => {
      if (foundElement === undefined) {
        return oldData;
      }
      const findElement = findComponentElement(oldData, foundElement.element.cid);
      if (findElement?.element) {
        updateElement(findElement.element);
      }
      return oldData;
    });
  };
  return {
    data,
    setData: setHistoricisedData,
    setUnhistoricisedData: setData,
    element: foundElement?.element,
    setElement,
    setSelectedElement,
    parent: foundElement?.parent
  };
};
