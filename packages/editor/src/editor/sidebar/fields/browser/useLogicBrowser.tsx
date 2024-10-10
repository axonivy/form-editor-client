import { useBrowser, type Browser } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../../context/useMeta';
import { useMemo } from 'react';
import type { LogicMethodInfo } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../../context/AppContext';
import { formatLogicMethodInfo, logicTreeData } from '../../../../data/logic-tree-data';

export const LOGIC_BROWSER_ID = 'Logic' as const;

export const useLogicBrowser = (): Browser => {
  const { context } = useAppContext();
  const logicInfo = useMeta('meta/data/logic', context, { startMethods: [], eventStarts: [] }).data;
  const tree = useMemo(() => logicTreeData(logicInfo), [logicInfo]);
  const browser = useBrowser(tree, undefined, '', true);
  return {
    name: LOGIC_BROWSER_ID,
    icon: IvyIcons.Process,
    browser,
    infoProvider: row => (row?.original.data ? formatLogicMethodInfo(row?.original.data as LogicMethodInfo) : row?.original.info),
    applyModifier: row => ({ value: 'logic.' + row.original.value })
  };
};
