import { IvyIcons } from '@axonivy/ui-icons';

export const badgeProps = [
  {
    regex: /#{\s*data\.[^}]+}/,
    icon: IvyIcons.File,
    badgeTextGen: (text: string) => text.replaceAll(/#{\s*data\.|}/g, '')
  },
  {
    regex: /<%=[^%>]+%>/,
    icon: IvyIcons.StartProgram,
    badgeTextGen: (text: string) => text.replaceAll(/(<%=\s*)|(\s*%>)/g, '')
  }
];
