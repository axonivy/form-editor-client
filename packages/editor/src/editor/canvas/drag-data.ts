import { isColumn, isStructure, isTable, type Component, type ComponentData, type ComponentType } from '@axonivy/form-editor-protocol';
import type { Active } from '@dnd-kit/core';
import { COLUMN_DROPZONE_ID_PREFIX, getParentComponent, STRUCTURE_DROPZONE_ID_PREFIX, TABLE_DROPZONE_ID_PREFIX } from '../../data/data';
import type { AutoCompleteWithString } from '../../types/types';

export type DragData = {
  componentType: ComponentType;
  disabledIds: Array<string>;
};

const disabledIds = (data: Component | ComponentData): Array<string> => {
  if (isStructure(data) || isTable(data) || isColumn(data)) {
    const ids: Array<string> = [];
    for (const component of data.config.components) {
      ids.push(...disabledIds(component));
      ids.push(component.cid);
    }
    return ids;
  }
  return [];
};

export const dragData = (data: Component | ComponentData): DragData => {
  return { componentType: data.type, disabledIds: disabledIds(data) };
};

export const isDragData = (data: unknown): data is DragData => {
  return typeof data === 'object' && data !== null && 'componentType' in data && 'disabledIds' in data;
};

export const isDropZoneDisabled = (
  dropId: string,
  components?: Array<ComponentData>,
  dropType?: ComponentType,
  active?: Active | null,
  preDropId?: string
) => {
  if (active === undefined || active === null) {
    return false;
  }
  const dragId = active.id;
  if (
    dragId === dropId ||
    `${STRUCTURE_DROPZONE_ID_PREFIX}${dragId}` === dropId ||
    `${TABLE_DROPZONE_ID_PREFIX}${dragId}` === dropId ||
    `${COLUMN_DROPZONE_ID_PREFIX}${dragId}` === dropId ||
    dragId === preDropId
  ) {
    return true;
  }

  const data = active.data.current;

  if (
    (dropId.startsWith(COLUMN_DROPZONE_ID_PREFIX) || (components && getParentComponent(components, dropId)?.type === 'DataTableColumn')) &&
    data?.componentType !== 'Button' &&
    active.id !== 'Button'
  ) {
    return true;
  }
  if (disableDataTableColumnDropZone(dropType, (data as Partial<DragData>)?.componentType ?? '')) {
    return true;
  }
  if (isDragData(data)) {
    return data.disabledIds.includes(dropId);
  }
  return false;
};

const disableDataTableColumnDropZone = (dropType: ComponentType | undefined, dragType: AutoCompleteWithString<ComponentType>) => {
  const isColumn = dragType === 'DataTableColumn';
  const isColumnTarget = dropType === 'DataTableColumn';
  if (isColumn) {
    return !isColumnTarget;
  }
  if (isColumnTarget) {
    return !isColumn;
  }
  return false;
};
