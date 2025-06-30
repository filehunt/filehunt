import { createContext, useContext, ReactNode } from 'react';
import type { FilehuntConfig } from './config';
import { defaultConfig } from './config';

interface FilehuntContextValue {
  config: FilehuntConfig;
}

const FilehuntContext = createContext<FilehuntContextValue>({
  config: defaultConfig
});

interface FilehuntProviderProps {
  children: ReactNode;
  config?: Partial<FilehuntConfig>;
}

export function FilehuntProvider({ children, config = {} }: FilehuntProviderProps) {
  const mergedConfig = { ...defaultConfig, ...config };

  return (
    <FilehuntContext.Provider value={{ config: mergedConfig }}>
      {children}
    </FilehuntContext.Provider>
  );
}

export function useFilehuntConfig() {
  const context = useContext(FilehuntContext);
  if (!context) {
    throw new Error('useFilehuntConfig must be used within a FilehuntProvider');
  }
  return context.config;
}
