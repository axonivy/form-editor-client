import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../context/AppContext';
import { useMeta } from '../context/useMeta';
import type { ContentObject } from '@axonivy/form-editor-protocol';
import type { BadgeType } from '@axonivy/ui-components';

const useCmsValues = (text: string) => {
  const { context } = useAppContext();
  const cmsItems = useMeta('meta/cms/cmsTree', { context, requiredProjects: false }, []).data;

  const findCmsDeep = (targetPath: string, cmsTree: Array<ContentObject>) => {
    const notFound = ['no cms entry found'];
    if (cmsTree.length === 0) {
      return notFound;
    }
    const entries = findCmsDeepRec(targetPath, cmsTree[0]);
    if (!entries) {
      return notFound;
    }
    return Object.entries(entries).map(key => `${key[0]}: ${key[1]}`);
  };

  const findCmsDeepRec = (targetPath: string, obj?: ContentObject) => {
    if (!obj) return null;
    if (obj.fullPath === targetPath) return obj.values;
    if (!obj.children || obj.children.length === 0) return null;
    return findCmsDeepRec(
      targetPath,
      obj.children.find(e => targetPath.startsWith(e.fullPath))
    );
  };

  text = text.replaceAll(/#{ivy.cms.co\(|['"]|\)}/g, '');
  const entries = findCmsDeep(text, cmsItems);
  entries.unshift(text);
  return entries.map((entry, i) => {
    return (
      <span key={i}>
        {entry}
        <br />
      </span>
    );
  });
};

const badgePropertyCMS: BadgeType = {
  regex: /#{\s*ivy.cms.co[^}]+}/,
  icon: IvyIcons.Cms,
  badgeTextGen: (text: string) => '.../' + text.replaceAll(/#{\s*ivy.cms.co\(['"]|\/*[^\\]+\/|['"]\)\s*}/g, ''),
  tooltip: useCmsValues
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

const badgePropertyExpression: BadgeType = {
  regex: /#{[^}]*}/,
  icon: IvyIcons.StartProgram,
  badgeTextGen: (text: string) => text.replaceAll(/#{\s*|\s*}/g, '')
};

export const badgeProps = [badgePropertyData, badgePropertyLogic, badgePropertyCMS, badgePropertyExpression];
