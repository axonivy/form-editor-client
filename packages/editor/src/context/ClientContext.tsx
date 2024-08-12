import type { FormClient } from '@axonivy/form-editor-protocol';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

export interface ClientContext {
  client: FormClient;
}

/** We always use a provider so default can be undefined */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultClientContext: any = undefined;

const ClientContextInstance = createContext<ClientContext>(defaultClientContext);
export const useClient = (): FormClient => {
  const { client } = useContext(ClientContextInstance);
  return client;
};

export const ClientContextProvider = ({ client, children }: { client: FormClient; children: ReactNode }) => {
  return <ClientContextInstance.Provider value={{ client }}>{children}</ClientContextInstance.Provider>;
};
