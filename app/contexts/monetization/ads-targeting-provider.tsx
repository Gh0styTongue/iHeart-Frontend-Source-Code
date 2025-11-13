import type { Playback } from '@iheartradio/web.playback';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { isNonNullish } from 'remeda';

import { isClient } from '~app/utilities/constants';

import { useConfig } from '../config';
import { useIsMobile } from '../is-mobile';
import { useUser } from '../user';
import {
  AdsTargetingEmitter,
  AdsTargetingState,
} from './ads-targeting-emitter';

export type AdsTargetingContextValue = Playback.Targeting | null;

export type AdsProviderProps = {
  visitNum?: number;
  children(lsid: string): ReactNode;
};

export function AdsTargetingProvider({ visitNum, children }: AdsProviderProps) {
  const config = useConfig();
  const user = useUser();
  const isMobile = useIsMobile();
  const [lsid, setLsid] = useState('');

  // This is where we hook the `AdsTargetingEmitter` into the React lifecycle
  // We want this is a `useMemo` so it runs sooner, but only in the browser
  useMemo(() => {
    if (
      isClient &&
      !AdsTargetingEmitter.initialized &&
      isNonNullish(user.profileId) &&
      isNonNullish(user.sessionId)
    ) {
      AdsTargetingEmitter.initialize({
        config,
        user,
        visitNumber: visitNum,
        isMobile,
      });
    }
  }, [config, user, visitNum, isMobile]);

  useEffect(() => {
    return AdsTargetingState.subscribe({
      set(_, key, value) {
        if (key === 'lsid' && value) {
          setLsid(value as string);
        }
      },
    });
  }, []);

  return <>{children(lsid)}</>;
}
