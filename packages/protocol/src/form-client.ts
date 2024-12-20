import type { FormContext, ValidationResult, FormActionArgs } from './data/form';
import type { FormEditor, FormSaveData } from './data/form-data';
import type { FormMetaRequestTypes } from './form-protocol';

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  action(action: FormActionArgs): void;

  onDataChanged: Event<void>;
  onValidationChanged: Event<void>;
}
