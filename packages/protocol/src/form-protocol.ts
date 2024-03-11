export interface FormMetaRequestTypes {
  'meta/form': [any, any[]];
}

export interface FormRequestTypes extends FormMetaRequestTypes {
  data: [any, any];
  saveData: [any, void];
}

export interface FormNotificationTypes {
  dataChanged: void;
}
