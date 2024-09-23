import type { ContentObject, ContentObjectType } from '@axonivy/form-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

export const cmsTreeData = (contentObjects: ContentObject[]): Array<BrowserNode<ContentObject>> => {
  const convertToBrowserNode = (contentObject: ContentObject): BrowserNode<ContentObject> => {
    return {
      value: contentObject.name,
      info: contentObject.type,
      icon: getIconForContentType(contentObject.type),
      children: contentObject.children.map(convertToBrowserNode),
      data: contentObject,
      notSelectable: contentObject.type === 'FOLDER',
      isLoaded: true
    };
  };

  return contentObjects.map(convertToBrowserNode);
};

const getIconForContentType = (type: ContentObjectType): IvyIcons => {
  if (type === 'FOLDER') {
    return IvyIcons.FolderOpen;
  }
  if (type === 'FILE') {
    return IvyIcons.File;
  }
  return IvyIcons.ChangeType;
};
