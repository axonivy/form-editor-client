import type { LogicEventInfo, LogicInfo, LogicMethodInfo } from '@axonivy/form-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { simpleType, typesString } from '../../../utils/string';

export const logicTreeData = (logicInfo: LogicInfo): Array<BrowserNode<LogicMethodInfo>> => {
  return [
    {
      value: 'Events',
      info: 'Event Start',
      icon: IvyIcons.EventStart,
      data: undefined,
      notSelectable: true,
      children: convertEventsToMethods(logicInfo.eventStarts),
      isLoaded: true
    },
    {
      value: 'Methods',
      info: 'Method Start',
      icon: IvyIcons.MethodStart,
      data: undefined,
      notSelectable: true,
      children: logicInfo.startMethods.map(param => ({
        value: `${param.name}(${typesString(param.parameters)})`,
        info: simpleType(param.returnParameter.type),
        icon: IvyIcons.MethodStart,
        data: param,
        children: [],
        isLoaded: true
      })),
      isLoaded: true
    }
  ];
};

export const convertEventsToMethods = (events: LogicEventInfo[]): Array<BrowserNode<LogicMethodInfo>> => {
  const eventsAsMethods = events.map(param => ({
    name: param.name,
    description: param.description,
    parameters: [],
    returnParameter: { name: '', type: '' }
  }));

  return eventsAsMethods.map(param => ({
    value: param.name,
    info: param.description,
    icon: IvyIcons.EventStart,
    data: param,
    children: [],
    isLoaded: true
  }));
};

export const formatLogicMethodInfo = (methodInfo: LogicMethodInfo): string => {
  const parametersString = methodInfo.parameters.map(param => `${param.name}: ${param.type}`).join(', ');
  return `${methodInfo.name}(${parametersString}):${methodInfo.returnParameter.type}`;
};
