export interface FormMetaRequestTypes {
  'meta/form': [any, any[]];
}

export interface FormRequestTypes extends FormMetaRequestTypes {
  initialize: [void, boolean];
  data: [any, any];
  saveData: [any, void];
}

export interface FormNotificationTypes {
  // dataChanged: any;
}
