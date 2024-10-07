import type { FormContext, ValidationResult } from './data/form';
import type { FormEditor, FormSaveData, FormAction } from './data/form-data';
import type { FormMetaRequestTypes } from './form-protocol';

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface FormClient {
  data(context: FormContext): Promise<FormEditor>;
  saveData(saveData: FormSaveData): Promise<void>;

  validate(context: FormContext): Promise<ValidationResult[]>;

  meta<TMeta extends keyof FormMetaRequestTypes>(
    path: TMeta,
    args: FormMetaRequestTypes[TMeta][0]
  ): Promise<FormMetaRequestTypes[TMeta][1]>;

  action(action: FormAction): void;

  onDataChanged: Event<void>;
  onValidationChanged: Event<void>;
}
