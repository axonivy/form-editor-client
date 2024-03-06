import type { FormMetaRequestTypes } from './form-protocol';
import type { FormData } from './data';

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface FormClient {
  initialize(): Promise<boolean>;
  data(): Promise<FormData>;
  saveData(saveData: FormData): Promise<void>;

  meta<TMeta extends keyof FormMetaRequestTypes>(
    path: TMeta,
    args: FormMetaRequestTypes[TMeta][0]
  ): Promise<FormMetaRequestTypes[TMeta][1]>;

  // onDataChanged: Event<void>;
}
