import { type ReactNode, createContext, useContext } from 'react';

export interface PlayerProgressContextProps {
  duration: number;
  position?: number;
}

export const PlayerProgressContext =
  createContext<PlayerProgressContextProps | null>(null);

export function PlayerProgressProvider({
  children,
  ...props
}: PlayerProgressContextProps & { children: ReactNode }) {
  return (
    <PlayerProgressContext.Provider value={props}>
      {children}
    </PlayerProgressContext.Provider>
  );
}

export function usePlayerProgress() {
  const contextValue = useContext(PlayerProgressContext);

  return contextValue;
}
