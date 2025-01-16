import './index.css';
import { App, ClientContextProvider, QueryProvider, initQueryClient } from '@axonivy/form-editor';
import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { ThemeProvider, ReadonlyProvider, toast, Toaster, Spinner, Flex, HotkeysProvider } from '@axonivy/ui-components';
import { webSocketConnection, type Connection } from '@axonivy/jsonrpc';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { URLParams } from './url-helper';

export async function start(): Promise<void> {
  const server = URLParams.webSocketBase();
  const app = URLParams.app();
  const pmv = URLParams.pmv();
  const file = URLParams.file();
  const directSave = URLParams.directSave();
  const theme = URLParams.theme();
  const readonly = URLParams.readonly();
  const queryClient = initQueryClient();
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <Flex style={{ height: '100%' }} justifyContent='center' alignItems='center'>
          <Spinner size='large' />
        </Flex>
        <Toaster closeButton={true} position='bottom-left' />
      </ThemeProvider>
    </React.StrictMode>
  );

  const initialize = async (connection: Connection) => {
    const client = await FormClientJsonRpc.startClient(connection);
    root.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme={theme}>
          <ClientContextProvider client={client}>
            <QueryProvider client={queryClient}>
              <ReadonlyProvider readonly={readonly}>
                <HotkeysProvider initiallyActiveScopes={['global']}>
                  <App context={{ app, pmv, file }} directSave={directSave} />
                </HotkeysProvider>
              </ReadonlyProvider>
            </QueryProvider>
          </ClientContextProvider>
          <Toaster closeButton={true} position='bottom-left' />
        </ThemeProvider>
      </React.StrictMode>
    );
    return client;
  };

  const reconnect = async (connection: Connection, oldClient: FormClientJsonRpc) => {
    await oldClient.stop();
    return initialize(connection);
  };

  webSocketConnection<FormClientJsonRpc>(FormClientJsonRpc.webSocketUrl(server)).listen({
    onConnection: initialize,
    onReconnect: reconnect,
    logger: { log: console.log, info: toast.info, warn: toast.warning, error: toast.error }
  });
}

start();
