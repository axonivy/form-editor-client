import { BrowsersView } from '@axonivy/ui-components';
import { useAttributeBrowser } from './data-class/useAttributeBrowser';
import { useCmsBrowser, CMS_BROWSER_ID } from './cms/useCmsBrowser';
import { useLogicBrowser } from './logic/useLogicBrowser';

type OnlyAttributeSelection = 'DYNAMICLIST' | 'COLUMN';

export type BrowserType = 'ATTRIBUTE' | 'LOGIC' | 'CMS';

export type BrowserOptions = {
  onlyTypesOf?: string;
  onlyAttributes?: OnlyAttributeSelection;
  directApply?: boolean;
};

type BrowserProps = {
  value: string;
  onChange: (value: string) => void;
  activeBrowsers: Array<BrowserType>;
  close: () => void;
  options?: BrowserOptions;
};

export const Browser = ({ value, onChange, activeBrowsers, close, options }: BrowserProps) => {
  const attrBrowser = useAttributeBrowser(options);
  const logicBrowser = useLogicBrowser();
  const cmsBrowser = useCmsBrowser();

  const browsers = [
    ...(activeBrowsers.includes('ATTRIBUTE') ? [attrBrowser] : []),
    ...(activeBrowsers.includes('LOGIC') ? [logicBrowser] : []),
    ...(activeBrowsers.includes('CMS') ? [cmsBrowser] : [])
  ];

  return (
    <BrowsersView
      browsers={browsers}
      apply={(browserName, result) => {
        if (result && browserName === CMS_BROWSER_ID) {
          onChange(`${value}#{${result.value}}`);
        } else if (result) {
          onChange(options?.onlyAttributes || options?.directApply ? result.value : `#{${result.value}}`);
        }
        close();
      }}
    />
  );
};
