import { useCallback, useEffect } from 'react';
import { useHydrated } from 'remix-utils/use-hydrated';

import { playback } from '~app/playback/playback';

export function useInitializePlayer() {
  const player = playback.usePlayer();
  const hydrated = useHydrated();

  const initialize = useCallback(async () => {
    await player.initialize();
  }, [player]);

  useEffect(() => {
    if (!player.initialized && hydrated) {
      initialize();
    }
  }, [player, hydrated, initialize]);
}
