import type { FormMetaRequestTypes } from './form-protocol';

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface FormClient {
  initialize(): Promise<boolean>;
  data(context: any): Promise<any>;
  saveData(saveData: any): Promise<any[]>;

  validate(context: any): Promise<any[]>;

  meta<TMeta extends keyof FormMetaRequestTypes>(
    path: TMeta,
    args: FormMetaRequestTypes[TMeta][0]
  ): Promise<FormMetaRequestTypes[TMeta][1]>;

  action(action: any): void;

  onDataChanged: Event<any>;
  onValidation: Event<any[]>;
}
