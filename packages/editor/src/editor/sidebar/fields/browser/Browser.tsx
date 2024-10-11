import { BrowsersView } from '@axonivy/ui-components';
import { CMS_BROWSER_ID, useCmsBrowser } from './useCmsBrowser';
import { useAttributeBrowser } from './useAttributeBrowser';
import { useLogicBrowser } from './useLogicBrowser';

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
