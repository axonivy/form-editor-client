import './index.css';
import { App, ClientContextProvider, QueryProvider, initQueryClient } from '@axonivy/form-editor';
import { ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FormClientMock } from './mock/form-client-mock';

export function start() {
  const formClient = new FormClientMock();
  const queryClient = initQueryClient();

  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('Root element not found');
  }
  createRoot(root).render(
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
