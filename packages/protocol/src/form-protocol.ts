import type {
  FormContext,
  VariableInfo,
  LogicInfo,
  CmsMetaRequest,
  ContentObject,
  CompositeInfo,
  ParameterInfo,
  CompositeContext,
  ValidationResult,
  FormActionArgs
} from './data/form';
import type { FormEditor, FormSaveData } from './data/form-data';

export interface FormMetaRequestTypes {
  'meta/data/attributes': [FormContext, VariableInfo];
  'meta/data/logic': [FormContext, LogicInfo];
  'meta/data/cms': [CmsMetaRequest, Array<ContentObject>];
  'meta/composite/all': [FormContext, Array<CompositeInfo>];
  'meta/composite/params': [CompositeContext, Array<ParameterInfo>];
}

export interface FormRequestTypes extends FormMetaRequestTypes {
  data: [FormContext, FormEditor];
  saveData: [FormSaveData, void];

  validate: [FormContext, ValidationResult[]];
}

export interface FormNotificationTypes {
  action: FormActionArgs;
}

export interface FormOnNotificationTypes {
  dataChanged: void;
  validationChanged: void;
}
