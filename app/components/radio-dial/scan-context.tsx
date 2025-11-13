import type { ReactNode } from 'react';
import { createContext, useCallback, useMemo } from 'react';

import { playback } from '~app/playback/playback';

type ScanContextValue = {
  stopScan: () => void;
};

export const ScanContext = createContext<ScanContextValue>({
  stopScan: () => 0,
});

export function ScanContextProvider({ children }: { children: ReactNode }) {
  const player = playback.usePlayer();

  const stopScan = useCallback(() => {
    player.setScanning({ isScanning: false, skip: true });
  }, [player]);

  return (
    <ScanContext.Provider value={useMemo(() => ({ stopScan }), [stopScan])}>
      {children}
    </ScanContext.Provider>
  );
}
