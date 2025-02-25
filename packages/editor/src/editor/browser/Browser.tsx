import { BrowsersView, useConditionBuilder } from '@axonivy/ui-components';
import { useAttributeBrowser } from './data-class/useAttributeBrowser';
import { useCmsBrowser, CMS_BROWSER_ID } from './cms/useCmsBrowser';
import { useLogicBrowser } from './logic/useLogicBrowser';
import { generateConditionString, logicOperators, operators } from './condition-builder/condition-builder-data';
import { InputFieldWithBrowser } from '../sidebar/fields/InputFieldWithBrowser';
import type { Selection } from './cms/useTextSelection';

type OnlyAttributeSelection = 'DYNAMICLIST' | 'COLUMN';

export type BrowserType = 'ATTRIBUTE' | 'LOGIC' | 'CMS' | 'CONDITION';

export type BrowserOptions = {
  typeHint?: string;
  onlyAttributes?: OnlyAttributeSelection;
  directApply?: boolean;
  overrideSelection?: boolean;
};

type BrowserProps = {
  value: string;
  onChange: (value: string) => void;
  activeBrowsers: Array<BrowserType>;
  close: () => void;
  options?: BrowserOptions;
  selection?: Selection;
};

export const Browser = ({ value, onChange, activeBrowsers, close, options, selection }: BrowserProps) => {
  const attrBrowser = useAttributeBrowser(options);
  const logicBrowser = useLogicBrowser();
  const cmsBrowser = useCmsBrowser();
  const conditionBuilder = useConditionBuilder({
    generateConditionString,
    operators,
    logicOperators,
    argumentInput: (value, onChange) => (
      <InputFieldWithBrowser value={value} onChange={onChange} browsers={['ATTRIBUTE']} options={{ directApply: true }} />
    )
  });
  const browsers = [
    ...(activeBrowsers.includes('LOGIC') ? [logicBrowser] : []),
    ...(activeBrowsers.includes('ATTRIBUTE') ? [attrBrowser] : []),
    ...(activeBrowsers.includes('CMS') ? [cmsBrowser] : []),
    ...(activeBrowsers.includes('CONDITION') ? [conditionBuilder] : [])
  ];

  return (
    <BrowsersView
      browsers={browsers}
      apply={(browserName, result) => {
        if (result && options?.overrideSelection && selection) {
          const newValue = value.substring(0, selection.start) + result.value + value.substring(selection.end);
          onChange(newValue);
          close();
          return;
        } else if (result && browserName === CMS_BROWSER_ID) {
          onChange(`${value}#{${result.value}}`);
        } else if (result) {
          onChange(options?.onlyAttributes || options?.directApply ? result.value : `#{${result.value}}`);
        }
        close();
      }}
    />
  );
};
