import './index.css';
import { App, ClientContextProvider, QueryProvider, initQueryClient } from '@axonivy/form-editor';
import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { FormClientMock } from './mock/form-client-mock';
import { datatableParam, readonlyParam } from './url-helper';
import { initTranslation } from './i18n';

export function start() {
  const datatable = datatableParam();
  const formClient = new FormClientMock(datatable);
  const queryClient = initQueryClient();
  const readonly = readonlyParam();

  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('Root element not found');
  }
  initTranslation();
  createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider defaultTheme='light'>
        <ClientContextProvider client={formClient}>
          <QueryProvider client={queryClient}>
            <ReadonlyProvider readonly={readonly}>
              <HotkeysProvider initiallyActiveScopes={['global']}>
                <App context={{ app: '', pmv: '', file: '' }} />
              </HotkeysProvider>
            </ReadonlyProvider>
          </QueryProvider>
        </ClientContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
