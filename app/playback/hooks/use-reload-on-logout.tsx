import { useEffect, useRef } from 'react';

import { useUser } from '~app/contexts/user';
import { usePlayerStatus } from '~app/playback/contexts/player-status';
import { playback } from '~app/playback/playback';
import { isPremiumStation } from '~app/playback/playback-helpers';

export function useReloadOnLogout() {
  const user = useUser();
  const sessionRef = useRef(user?.sessionId);
  const { station } = playback.useState();
  const [, updatePlayerStatus] = usePlayerStatus();

  useEffect(() => {
    // If the session id stored in ref does not match the current user session
    if (
      sessionRef.current !== user?.sessionId &&
      isPremiumStation(station.type)
    ) {
      // set the loading flags to false, so that the effect below will not exit early
      updatePlayerStatus({
        type: 'batch',
        payload: {
          updateLoaded: false,
          updateLoading: false,
        },
      });
    }
  }, [user?.sessionId, station.type, updatePlayerStatus]);
}
