import type {
  FormRequestTypes,
  FormNotificationTypes,
  FormMetaRequestTypes,
  FormContext,
  FormClient,
  FormEditorData,
  FormSaveDataArgs,
  FormActionArgs,
  FormOnNotificationTypes
} from '@axonivy/form-editor-protocol';
import {
  BaseRpcClient,
  urlBuilder,
  createMessageConnection,
  Emitter,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';

export class FormClientJsonRpc extends BaseRpcClient implements FormClient {
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged = this.onDataChangedEmitter.event;
  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.onNotification('dataChanged', data => this.onDataChangedEmitter.fire(data));
  }

  data(context: FormContext): Promise<FormEditorData> {
    return this.sendRequest('data', { ...context });
  }

  saveData(saveData: FormSaveDataArgs): Promise<void> {
    return this.sendRequest('saveData', { ...saveData });
  }

  meta<TMeta extends keyof FormMetaRequestTypes>(
    path: TMeta,
    args: FormMetaRequestTypes[TMeta][0]
  ): Promise<FormMetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  action(action: FormActionArgs): void {
    this.sendNotification('action', action);
  }

  sendRequest<K extends keyof FormRequestTypes>(command: K, args: FormRequestTypes[K][0]): Promise<FormRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  sendNotification<K extends keyof FormNotificationTypes>(command: K, args: FormNotificationTypes[K]): Promise<void> {
    return this.connection.sendNotification(command, args);
  }

  onNotification<K extends keyof FormOnNotificationTypes>(kind: K, listener: (args: FormOnNotificationTypes[K]) => any): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-form-lsp');
  }

  public static async startClient(connection: Connection): Promise<FormClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<FormClientJsonRpc> {
    const client = new FormClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
