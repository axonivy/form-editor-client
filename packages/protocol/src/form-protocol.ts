import type { FormContext, FormEditorData, FormSaveDataArgs, VariableInfo } from './data';

export interface FormMetaRequestTypes {
  'meta/data/attributes': [FormContext, VariableInfo];
}

export interface FormRequestTypes extends FormMetaRequestTypes {
  data: [FormContext, FormEditorData];
  saveData: [FormSaveDataArgs, void];
}

export interface FormNotificationTypes {
  dataChanged: void;
}
