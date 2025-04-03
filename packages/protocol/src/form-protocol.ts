/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  FormContext,
  VariableInfo,
  LogicInfo,
  FormCmsMetaRequest,
  ContentObject,
  CompositeInfo,
  ParameterInfo,
  CompositeContext,
  ValidationResult,
  FormActionArgs,
  CmsQuickActionRequest,
  CmsQuickAction,
  ExecuteCmsQuickActionRequest,
  EditorFileContent,
  ExtractContext
} from './data/form';
import type { FormEditor, FormSaveData } from './data/form-data';

export interface FormMetaRequestTypes {
  'meta/data/attributes': [FormContext, VariableInfo];
  'meta/data/logic': [FormContext, LogicInfo];
  'meta/cms/cmsTree': [FormCmsMetaRequest, Array<ContentObject>];
  'meta/cms/executeCmsQuickAction': [ExecuteCmsQuickActionRequest, string];
  'meta/cms/cmsQuickActions': [CmsQuickActionRequest, Array<CmsQuickAction>];
  'meta/composite/all': [FormContext, Array<CompositeInfo>];
  'meta/composite/params': [CompositeContext, Array<ParameterInfo>];
  'meta/composite/extractIntoComponent': [ExtractContext, string];
}

export interface FormRequestTypes extends FormMetaRequestTypes {
  data: [FormContext, FormEditor];
  saveData: [FormSaveData, EditorFileContent];

  validate: [FormContext, ValidationResult[]];
}

export interface FormNotificationTypes {
  action: FormActionArgs;
}

export interface FormOnNotificationTypes {
  dataChanged: void;
  validationChanged: void;
}
