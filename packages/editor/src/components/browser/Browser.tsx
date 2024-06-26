import { BrowsersView, useBrowser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import './browser.css';

export const enum BrowserType {
  Attribute = 'Attribute'
}

const attrData: Array<BrowserNode> = [
  {
    value: 'data',
    info: 'ProcurementRequest',
    icon: IvyIcons.Attribute,
    children: [
      { value: 'accepted', info: 'Boolean', icon: IvyIcons.Attribute, children: [] },
      {
        value: 'requester',
        info: 'User',
        icon: IvyIcons.Attribute,
        children: [
          { value: 'email', info: 'String', icon: IvyIcons.Attribute, children: [] },
          { value: 'fullName', info: 'String', icon: IvyIcons.Attribute, children: [] },
          { value: 'role', info: 'String', icon: IvyIcons.Attribute, children: [] }
        ]
      }
    ]
  }
];

export const Browser = ({ applyFn, browserTypes }: { applyFn: (value?: string) => void; browserTypes?: BrowserType[] }) => {
  const attributes = useBrowser(attrData);

  return (
    <BrowsersView
      browsers={[
        { name: BrowserType.Attribute, icon: IvyIcons.Attribute, browser: attributes, infoProvider: (row: any) => row?.original.info }
      ].filter(browser => browserTypes?.includes(browser.name))}
      apply={value => {
        if (value) {
          applyFn('#{data' + createPath(value!.cursor, attrData) + '}');
        } else {
          applyFn();
        }
      }}
    />
  );
};

const createPath = (value: string, data: Array<BrowserNode>) => {
  let path = undefined;
  data.forEach(n => {
    const retVal = pathFinder(value, n, '');
    if (retVal) path = retVal;
  });
  return path;
};

const pathFinder = (value: string, node: BrowserNode, prefix: string) => {
  prefix = prefix + '.' + node.value;
  if (node.value === value) return prefix;
  if (!node.children) return undefined;
  let path = undefined;
  node.children.forEach(child => {
    const retVal = pathFinder(value, child, prefix);
    if (retVal) path = retVal;
  });
  return path;
};
