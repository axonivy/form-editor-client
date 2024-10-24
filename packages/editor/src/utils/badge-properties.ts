import { IvyIcons } from '@axonivy/ui-icons';

const badgePropertyData = {
  regex: /#{\s*data\.[^}]+}/,
  icon: IvyIcons.File,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*data\.|}/g, '')
};

const badgePropertyLogic = {
  regex: /#{\s*logic\.[^}]+}/,
  icon: IvyIcons.Bpmn,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*logic\.|}/g, '')
};

const badgePropertyCMS = {
  regex: /#{\s*ivy.cms.co[^}]+}/,
  icon: IvyIcons.Cms,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*ivy.cms.co\(['"]|['"]\)}/g, '')
};

const badgePropertyCondition = {
  regex: /#{\s*(?!data\.|logic\.|ivy\.cms\.co)[^}]+}/,
  icon: IvyIcons.DataClass,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*|}/g, '')
};

export const badgeProps = [badgePropertyData, badgePropertyLogic, badgePropertyCMS, badgePropertyCondition];
