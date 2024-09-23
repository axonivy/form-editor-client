import type {
  CmsMetaRequest,
  CompositeInfo,
  ContentObject,
  FormContext,
  FormEditorData,
  FormSaveDataArgs,
  LogicInfo,
  VariableInfo
} from './data';

export interface FormMetaRequestTypes {
  'meta/data/attributes': [FormContext, VariableInfo];
  'meta/data/logic': [FormContext, LogicInfo];
  'meta/data/cms': [CmsMetaRequest, Array<ContentObject>];
  'meta/composite/all': [FormContext, Array<CompositeInfo>];
}

export interface FormRequestTypes extends FormMetaRequestTypes {
  data: [FormContext, FormEditorData];
  saveData: [FormSaveDataArgs, void];
}

export interface FormNotificationTypes {
  dataChanged: void;
}
