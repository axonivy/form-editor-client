import type { LogicEventInfo, LogicInfo, LogicMethodInfo, Parameter } from '@axonivy/form-editor-protocol';
import type { BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

export const logicTreeData = () => {
  const of = (logicInfo: LogicInfo): Array<BrowserNode<LogicMethodInfo>> => {
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
          value: param.name + '(' + getParameterTypesString(param.parameters) + ')',
          info: getLastPartOfType(param.returnParameter.type),
          icon: IvyIcons.MethodStart,
          data: param,
          children: [],
          isLoaded: true
        })),
        isLoaded: true
      }
    ];
  };

  const getLastPartOfType = (type: string): string => {
    const typeParts = type.split('.');
    return typeParts[typeParts.length - 1];
  };

  const getParameterTypesString = (parameters: Parameter[]): string => {
    return parameters.map(param => getLastPartOfType(param.type)).join(', ');
  };

  const convertEventsToMethods = (events: LogicEventInfo[]): Array<BrowserNode<LogicMethodInfo>> => {
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
  return { of, getLastPartOfType, getParameterTypesString, convertEventsToMethods };
};

export const formatLogicMethodInfo = (methodInfo: LogicMethodInfo): string => {
  const parametersString = methodInfo.parameters.map(param => `${param.name}: ${param.type}`).join(', ');
  return `${methodInfo.name}(${parametersString}):${methodInfo.returnParameter.type}`;
};
