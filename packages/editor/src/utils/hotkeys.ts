import { hotkeyText } from '@axonivy/ui-components';
import { useMemo } from 'react';

export const HOTKEYS = {
  UNDO: 'mod+Z',
  REDO: 'mod+shift+Z',

  OPEN_DATACLASS: 'D',
  OPEN_PROCESS: 'P',
  OPEN_HELP: 'F1',

  VIEW_MODE: 'E',
  DEVICE_MODE: 'S',
  CREATE_FROM_DATA: 'A',

  FOCUS_TOOLBAR: '1',
  FOCUS_CANVAS: '2',
  FOCUS_INSCRIPTION: '3'
} as const;

export const useHotkeyTexts = () => {
  const undo = useMemo(() => `Undo (${hotkeyText(HOTKEYS.UNDO)})`, []);
  const redo = useMemo(() => `Redo (${hotkeyText(HOTKEYS.REDO)})`, []);
  const openDataClass = useMemo(() => `Open Data Class (${hotkeyText(HOTKEYS.OPEN_DATACLASS)})`, []);
  const openProcess = useMemo(() => `Open Process (${hotkeyText(HOTKEYS.OPEN_PROCESS)})`, []);
  const openHelp = useMemo(() => `Open Help (${hotkeyText(HOTKEYS.OPEN_HELP)})`, []);
  const viewMode = useMemo(() => `View Mode (${hotkeyText(HOTKEYS.VIEW_MODE)})`, []);
  const createFromData = useMemo(() => `Create from data (${hotkeyText(HOTKEYS.CREATE_FROM_DATA)})`, []);
  return { undo, redo, openDataClass, openProcess, openHelp, viewMode, createFromData };
};
