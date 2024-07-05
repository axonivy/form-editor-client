import './index.css';
import { App, ClientContextProvider, QueryProvider, initQueryClient } from '@axonivy/form-editor';
import { ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FormClientMock } from './mock/form-client-mock';

export async function start(): Promise<void> {
  const formClient = new FormClientMock();
  const queryClient = initQueryClient();

  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider defaultTheme='light'>
        <ClientContextProvider client={formClient}>
          <QueryProvider client={queryClient}>
            <App context={{ app: '', pmv: '', file: '' }} />
          </QueryProvider>
        </ClientContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
