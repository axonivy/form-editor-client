import type { CompositeInfo, FormContext, FormEditorData, FormSaveDataArgs, LogicInfo, VariableInfo } from './data';

export interface FormMetaRequestTypes {
  'meta/data/attributes': [FormContext, VariableInfo];
  'meta/data/logic': [FormContext, LogicInfo];
  'meta/composite/all': [FormContext, Array<CompositeInfo>];
}

export interface FormRequestTypes extends FormMetaRequestTypes {
  data: [FormContext, FormEditorData];
  saveData: [FormSaveDataArgs, void];
}

export interface FormNotificationTypes {
  dataChanged: void;
}
