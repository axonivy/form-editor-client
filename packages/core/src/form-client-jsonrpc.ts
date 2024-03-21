import type {
  FormRequestTypes,
  FormNotificationTypes,
  FormMetaRequestTypes,
  FormContext,
  FormClient,
  FormEditorData,
  FormSaveDataArgs
} from '@axonivy/form-editor-protocol';
import {
  BaseRpcClient,
  urlBuilder,
  createWebSocketConnection,
  createMessageConnection,
  Emitter,
  type Connection,
  type Disposable
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

  sendRequest<K extends keyof FormRequestTypes>(command: K, args: FormRequestTypes[K][0]): Promise<FormRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  onNotification<K extends keyof FormNotificationTypes>(kind: K, listener: (args: FormNotificationTypes[K]) => any): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  public static async startWebSocketClient(url: string): Promise<FormClient> {
    const webSocketUrl = urlBuilder(url, 'ivy-form-lsp');
    const connection = await createWebSocketConnection(webSocketUrl);
    return FormClientJsonRpc.startClient(connection);
  }

  public static async startClient(connection: Connection): Promise<FormClient> {
    const messageConnection = createMessageConnection(connection.reader, connection.writer);
    const client = new FormClientJsonRpc(messageConnection);
    client.start();
    connection.reader.onClose(() => client.stop());
    return client;
  }
}
