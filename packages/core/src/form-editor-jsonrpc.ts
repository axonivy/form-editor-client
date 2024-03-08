import type {
  FormRequestTypes,
  FormNotificationTypes,
  FormMetaRequestTypes,
  FormData,
  Form,
  FormClient
} from '@axonivy/form-editor-protocol';
import type { Disposable } from 'vscode-jsonrpc';
import { createMessageConnection, Emitter } from 'vscode-jsonrpc';
import { ConnectionUtil, type MessageConnection } from './connection-util';
import { BaseRcpClient } from './rcp-client';

export class FormEditorJsonRpc extends BaseRcpClient implements FormRequestTypes {
  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged = this.onDataChangedEmitter.event;
  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onDataChangedEmitter);
    this.onNotification('dataChanged', data => this.onDataChangedEmitter.fire(data));
  }

  initialize(): Promise<boolean> {
    return this.sendRequest('initialize', undefined);
  }

  data(context: Form): Promise<Form> {
    return this.sendRequest('data', { ...context });
  }

  saveData(saveData: FormData): Promise<void> {
    return this.sendRequest('saveData', { ...saveData });
  }

  meta<TMeta extends keyof FormMetaRequestTypes>(
    path: TMeta,
    args: FormMetaRequestTypes[TMeta][0]
  ): Promise<FormMetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  sendRequest<K extends keyof FormRequestTypes>(command: K, args: FormRequestTypes[K][0]): Promise<FormRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args); // TODO command (string | number | symbol) not allowed
  }

  onNotification<K extends keyof FormNotificationTypes>(kind: K, listener: (args: FormNotificationTypes[K]) => any): Disposable {
    return this.connection.onNotification(kind, listener); // TODO kind (string | number | symbol) not allowed
  }
}

export namespace FormEditorJsonRpc {
  export async function startWebSocketClient(url: string): Promise<FormClient> {
    const webSocketUrl = ConnectionUtil.buildWebSocketUrl(url, '/ivy-inscription-lsp');
    const connection = await ConnectionUtil.createWebSocketConnection(webSocketUrl);
    return startClient(connection);
  }

  export async function startClient(connection: MessageConnection) {
    const messageConnection = createMessageConnection(connection.reader, connection.writer);
    const client = new FormEditorJsonRpc(messageConnection);
    client.start();
    connection.reader.onClose(() => client.stop());
    return client;
  }
}
