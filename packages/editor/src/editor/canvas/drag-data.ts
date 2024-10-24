import { isStructure, isTable, type Component, type ComponentData } from '@axonivy/form-editor-protocol';
import type { Active } from '@dnd-kit/core';
import { STRUCTURE_DROPZONE_ID_PREFIX, TABLE_DROPZONE_ID_PREFIX } from '../../data/data';

export type DragData = { disabledIds: Array<string> };

const disabledIds = (data: Component | ComponentData): Array<string> => {
  if (isStructure(data) || isTable(data)) {
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
  return { disabledIds: disabledIds(data) };
};

export const isDragData = (data: unknown): data is DragData => {
  return typeof data === 'object' && data !== null && 'disabledIds' in data;
};

export const isDropZoneDisabled = (id: string, active: Active | null, preId?: string) => {
  const dropZoneId = active?.id;

  if (disableDropZoneDataTableColumn(id, dropZoneId?.toString())) {
    return true;
  }
  if (
    dropZoneId === id ||
    `${STRUCTURE_DROPZONE_ID_PREFIX}${dropZoneId}` === id ||
    `${TABLE_DROPZONE_ID_PREFIX}${dropZoneId}` === id ||
    dropZoneId === preId
  ) {
    return true;
  }
  const data = active?.data.current;
  if (isDragData(data)) {
    return data.disabledIds.includes(id);
  }
  return false;
};

const disableDropZoneDataTableColumn = (id: string, dropZoneId: string | undefined) => {
  const isColumn = id.startsWith('DataTableColumn');
  const isColumnTarget = dropZoneId ? dropZoneId.includes('DataTableColumn') : false;

  if (isColumn) {
    return !isColumnTarget;
  }
  return isColumnTarget;
};
