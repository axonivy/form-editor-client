import { BasicCheckbox, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';

import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../../../context/useMeta';
import { useMemo, useState } from 'react';
import type { ContentObject } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../../../context/AppContext';
import { cmsTreeData } from './cms-tree-data';

export const CMS_BROWSER_ID = 'CMS' as const;

export const useCmsBrowser = (): Browser => {
  const [requiredProject, setRequiredProject] = useState<boolean>(false);
  const { context } = useAppContext();
  const cmsTree = useMeta('meta/cms/cmsTree', { context, requiredProjects: requiredProject }, []).data;
  const tree = useMemo(() => cmsTreeData(cmsTree), [cmsTree]);
  const browser = useBrowser(tree, { expandedState: true });
  return {
    name: CMS_BROWSER_ID,
    icon: IvyIcons.Cms,
    browser,
    header: (
      <BasicCheckbox
        label='Enable required Projects'
        checked={requiredProject}
        onCheckedChange={() => setRequiredProject(!requiredProject)}
      />
    ),
    infoProvider: row => <CmsInfoProvider row={row} />,
    applyModifier: row => ({ value: `ivy.cms.co('${(row.original.data as ContentObject).fullPath}')` })
  };
};

const CmsInfoProvider = ({ row }: { row?: Row<BrowserNode> }) => {
  const node = row?.original.data as unknown as ContentObject;
  return (
    <>
      <div>{node.name}</div>
      <code>
        {Object.entries(node.values).map(([key, value]) => (
          <div key={key}>
            <b>{`${key}: `}</b>
            {value}
          </div>
        ))}
      </code>
    </>
  );
};
