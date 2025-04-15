/* eslint-disable @typescript-eslint/no-invalid-void-type */
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
  FormActionArgs,
  CmsQuickActionRequest,
  CmsQuickAction,
  ExecuteCmsQuickActionRequest,
  ExtractContext,
  CompositeData
} from './data/form';
import type { FormEditor, FormSaveData } from './data/form-data';

export interface FormMetaRequestTypes {
  'meta/data/attributes': [FormContext, VariableInfo];
  'meta/data/logic': [FormContext, LogicInfo];
  'meta/cms/cmsTree': [CmsMetaRequest, Array<ContentObject>];
  'meta/cms/executeCmsQuickAction': [ExecuteCmsQuickActionRequest, string];
  'meta/cms/cmsQuickActions': [CmsQuickActionRequest, Array<CmsQuickAction>];
  'meta/composite/all': [FormContext, Array<CompositeInfo>];
  'meta/composite/params': [CompositeContext, Array<ParameterInfo>];
  'meta/composite/data': [CompositeContext, CompositeData];
  'meta/composite/extractIntoComponent': [ExtractContext, string];
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
