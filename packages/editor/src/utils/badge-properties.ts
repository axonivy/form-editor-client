import { IvyIcons } from '@axonivy/ui-icons';
import { useMeta } from '../context/useMeta';
import { useAppContext } from '../context/AppContext';

const badgePropertyData = {
  regex: /#{\s*data\.[^\s}]+\s*}/,
  icon: IvyIcons.Attribute,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*data\.|}/g, '')
};

const badgePropertyLogic = {
  regex: /#{\s*logic\.[^\s}]+\s*}/,
  icon: IvyIcons.Process,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*logic\.|}/g, '')
};

const badgePropertyCMS = {
  regex: /#{\s*ivy.cms.co[^}]+}/,
  icon: IvyIcons.Cms,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*ivy.cms.co\(['"]|\/*[^\\]+\/|['"]\)\s*}/g, '')
};

const badgePropertyCondition = {
  regex: /#{[^}]*}/,
  icon: IvyIcons.StartProgram,
  badgeTextGen: (text: string) => {
    return text;
  }
};

export const badgeProps = [badgePropertyCondition, badgePropertyData, badgePropertyLogic, badgePropertyCMS];
