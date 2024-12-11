import { IvyIcons } from '@axonivy/ui-icons';
import type { BadgeType } from '@axonivy/ui-components';
import { CmsTooltip } from './CmsTooltip';

const badgePropertyCMS: BadgeType = {
  regex: /#{\s*ivy.cms.co[^}]+}/,
  icon: IvyIcons.Cms,
  badgeTextGen: (text: string) => '...' + text.replaceAll(/#{\s*ivy.cms.co\(['"]|.*(?=\/)|['"]\)\s*}/g, ''),
  tooltip: (text: string) => <CmsTooltip text={text} />
};

const badgePropertyData: BadgeType = {
  regex: /#{\s*data\.[^\s}]+\s*}/,
  icon: IvyIcons.Attribute,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*data\.|}/g, '')
};

const badgePropertyLogic: BadgeType = {
  regex: /#{\s*logic\.[^\s}]+\s*}/,
  icon: IvyIcons.Process,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*logic\.|}/g, '')
};

const badgePropertyBean: BadgeType = {
  regex: /#{[^}]*\([^}()\s]*\)\s*}/,
  icon: IvyIcons.StartProgram,
  badgeTextGen: (text: string) => text.replaceAll(/#{[^}]*\.|\(.*\)|}/g, '')
};

const badgePropertyExpression: BadgeType = {
  regex: /#{[^}]*}/,
  icon: IvyIcons.StartProgram,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*|\s*}/g, '')
};

export const badgeProps = [badgePropertyData, badgePropertyLogic, badgePropertyCMS, badgePropertyBean, badgePropertyExpression];
