import { IvyIcons } from '@axonivy/ui-icons';

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
  regex: /#{\s*[^\s}]+(?:\s+[^\s}]+)+\s*}/,
  icon: IvyIcons.StartProgram,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*|}/g, '')
};

export const badgeProps = [badgePropertyData, badgePropertyLogic, badgePropertyCMS, badgePropertyCondition];
