import { useMemo, useState } from 'react';
import type { UpdateConsumer } from '../types/types';
import type { FormData } from '@axonivy/form-editor-protocol';

export const useHistoryData = () => {
  const [history, setHistory] = useState<Array<FormData>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = (data: FormData) => {
    setHistory(oldHistory => [...oldHistory.slice(0, historyIndex + 1), structuredClone(data)]);
    setHistoryIndex(oldHistoryIndex => oldHistoryIndex + 1);
  };

  const undo = (setData: UpdateConsumer<FormData>) => {
    doHistoryChange(setData, historyIndex - 1);
  };

  const redo = (setData: UpdateConsumer<FormData>) => {
    doHistoryChange(setData, historyIndex + 1);
  };

  const canUndo = useMemo(() => historyIndex > 0, [historyIndex]);
  const canRedo = useMemo(() => historyIndex < history.length - 1, [historyIndex, history.length]);

  const doHistoryChange = (setData: UpdateConsumer<FormData>, newHistoryIndex: number) => {
    const newData = history[newHistoryIndex];
    if (newData === undefined) {
      return;
    }
    setData(() => newData);
    setHistoryIndex(newHistoryIndex);
  };

  return { pushHistory, undo, redo, canUndo, canRedo };
};
