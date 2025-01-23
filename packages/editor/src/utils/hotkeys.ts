import { hotkeyText, isWindows } from '@axonivy/ui-components';
import { useMemo } from 'react';

type KnownHotkey = { hotkey: string; label: string };

export const useKnownHotkeys = () => {
  const undo = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+Z';
    return { hotkey, label: `Undo (${hotkeyText(hotkey)})` };
  }, []);

  const redo = useMemo<KnownHotkey>(() => {
    const hotkey = isWindows() ? 'mod+Y' : 'mod+shift+Z';
    return { hotkey, label: `Redo (${hotkeyText(hotkey)})` };
  }, []);

  const openDataClass = useMemo<KnownHotkey>(() => {
    const hotkey = 'D';
    return { hotkey, label: `Open Data Class (${hotkeyText(hotkey)})` };
  }, []);

  const openProcess = useMemo<KnownHotkey>(() => {
    const hotkey = 'P';
    return { hotkey, label: `Open Process (${hotkeyText(hotkey)})` };
  }, []);

  const openHelp = useMemo<KnownHotkey>(() => {
    const hotkey = 'F1';
    return { hotkey, label: `Open Help (${hotkeyText(hotkey)})` };
  }, []);

  const viewMode = useMemo<KnownHotkey>(() => {
    const hotkey = 'E';
    return { hotkey, label: `View Mode (${hotkeyText(hotkey)})` };
  }, []);

  const deviceMode = useMemo<KnownHotkey>(() => {
    const hotkey = 'S';
    return { hotkey, label: `Change device mode (${hotkeyText(hotkey)})` };
  }, []);

  const createFromData = useMemo<KnownHotkey>(() => {
    const hotkey = 'A';
    return { hotkey, label: `Create from data (${hotkeyText(hotkey)})` };
  }, []);

  const focusToolbar = useMemo<KnownHotkey>(() => {
    const hotkey = '1';
    return { hotkey, label: `Focus Toolbar (${hotkeyText(hotkey)})` };
  }, []);

  const focusMain = useMemo<KnownHotkey>(() => {
    const hotkey = '2';
    return { hotkey, label: `Focus Main (${hotkeyText(hotkey)})` };
  }, []);

  const focusInscription = useMemo<KnownHotkey>(() => {
    const hotkey = '3';
    return { hotkey, label: `Focus Inscription (${hotkeyText(hotkey)})` };
  }, []);

  return {
    undo,
    redo,
    openDataClass,
    openProcess,
    openHelp,
    viewMode,
    deviceMode,
    createFromData,
    focusToolbar,
    focusMain,
    focusInscription
  };
};
