import { createContext, useContext, type ReactNode } from 'react';
import { useComponents } from '../components/components';

type ComponentsContextValue = ReturnType<typeof useComponents>;

const ComponentsContext = createContext<ComponentsContextValue | null>(null);

export const ComponentsProvider = ({ children }: { children: ReactNode }) => {
  const components = useComponents();
  return <ComponentsContext.Provider value={components}>{children}</ComponentsContext.Provider>;
};

export const useSharedComponents = (): ComponentsContextValue => {
  const context = useContext(ComponentsContext);
  if (context === null) {
    throw new Error('useSharedComponents must be used within <ComponentsProvider>');
  }
  return context;
};
