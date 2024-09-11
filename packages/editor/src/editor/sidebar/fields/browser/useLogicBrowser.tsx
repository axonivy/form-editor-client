import { useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../../context/useMeta';
import { useEffect, useState } from 'react';
import type { LogicMethodInfo } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../../context/AppContext';
import { formatLogicMethodInfo, logicTreeData } from '../../../../data/logic-tree-data';

export const LOGIC_BROWSER_ID = 'Logic' as const;

export const useLogicBrowser = (): Browser => {
  const [tree, setTree] = useState<Array<BrowserNode<LogicMethodInfo>>>([]);
  const { context } = useAppContext();
  const logicInfo = useMeta('meta/data/logic', context, { startMethods: [], eventStarts: [] }).data;

  useEffect(() => {
    setTree(logicTreeData().of(logicInfo));
  }, [logicInfo, logicInfo.startMethods]);

  const logic = useBrowser(tree, undefined, '', true);
  return {
    name: LOGIC_BROWSER_ID,
    icon: IvyIcons.Process,
    browser: logic,
    infoProvider: row => (row?.original.data ? formatLogicMethodInfo(row?.original.data as LogicMethodInfo) : row?.original.info),
    applyModifier: row => ({ value: 'logic.' + row.original.value })
  };
};
