import type { FormMetaRequestTypes } from './form-protocol';
import type { FormContext, FormEditorData, FormSaveDataArgs } from './data';

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface FormClient {
  data(context: FormContext): Promise<FormEditorData>;
  saveData(saveData: FormSaveDataArgs): Promise<void>;

  meta<TMeta extends keyof FormMetaRequestTypes>(
    path: TMeta,
    args: FormMetaRequestTypes[TMeta][0]
  ): Promise<FormMetaRequestTypes[TMeta][1]>;

  onDataChanged: Event<void>;
}
