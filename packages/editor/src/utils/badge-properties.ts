import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../context/AppContext';
import { useMeta } from '../context/useMeta';
import type { ContentObject } from '@axonivy/form-editor-protocol';

export const useBadgeProps = () => {
  const { context } = useAppContext();
  const cmsItems = useMeta('meta/cms/cmsTree', { context, requiredProjects: false }, []).data;
  const test = useMeta('meta/cms/cmsTree', { context, requiredProjects: false }, []);
  console.log(test.data);

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
  
  const badgePropertyCondition = {
    regex: /#{[^}]*}/,
    icon: IvyIcons.StartProgram,
    badgeTextGen: (text: string) => text.replaceAll(/#{|}/g, ""),
  };

  const badgePropertyCMS = {
    regex: /#{\s*ivy.cms.co[^}]+}/,
    icon: IvyIcons.Cms,
    badgeTextGen: (text: string) => {
      text = text.replaceAll(/#{\s*ivy.cms.co\(['"]|['"]\)\s*}/g, '')
      return (findCMSDeep(text, cmsItems)??{})["en"]
    }
  };

  const findCMSDeep = (targetPath: string, cmsTree: Array<ContentObject>) => {
    console.log(cmsTree)
    if (cmsTree.length === 0) return null;
    return findDeepRec(targetPath, cmsTree[0]);
  };
  
  const findDeepRec = (targetPath: string, obj?: ContentObject,) => {
    if (!obj) return null; 
    if (obj.fullPath === targetPath) return obj.values;
    if (!obj.children || obj.children.length === 0) return null;
    return findDeepRec(targetPath, obj.children.find(e => targetPath.startsWith(e.fullPath)));
  };

  return [badgePropertyCondition, badgePropertyData, badgePropertyLogic, badgePropertyCMS];

}
