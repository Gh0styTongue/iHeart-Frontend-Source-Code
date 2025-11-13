import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

export function createConfigContext<T>(defaultValue: T) {
  const ConfigContext = createContext<typeof defaultValue>(defaultValue);
  ConfigContext.displayName = 'ConfigContext';

  function Provider({
    children,
    value = defaultValue,
  }: PropsWithChildren<{ value?: typeof defaultValue }>) {
    return (
      <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
    );
  }

  return {
    Consumer: ConfigContext.Consumer,

    Provider,

    useConfig: () => {
      return useContext(ConfigContext);
    },
  } as const;
}
