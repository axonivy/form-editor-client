import './index.css';
import { App } from '@axonivy/form-editor';
import React from 'react';
import { createRoot } from 'react-dom/client';

export async function start(): Promise<void> {
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

start();
