import './index.css';
import { App, ClientContextProvider, QueryProvider, initQueryClient } from '@axonivy/form-editor';
import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { URLParams } from './url-helper';

export async function start(): Promise<void> {
  const server = URLParams.webSocketBase();
  const app = URLParams.app();
  const pmv = URLParams.pmv();
  const file = URLParams.file();
  const theme = URLParams.theme();

  const client = await FormClientJsonRpc.startWebSocketClient(server);
  const queryClient = initQueryClient();

  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <ClientContextProvider client={client}>
          <QueryProvider client={queryClient}>
            <App app={app} pmv={pmv} file={file} />
          </QueryProvider>
        </ClientContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
