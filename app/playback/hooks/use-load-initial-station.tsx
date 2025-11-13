import { type Station, StationType } from '@iheartradio/web.playback';
import { useCallback, useEffect, useMemo } from 'react';
import { isNonNullish, prop } from 'remeda';

import { useAmpClient } from '~app/api/amp-client';
import { useMarket } from '~app/contexts/market';
import {
  AdsTargetingState,
  useTargetingReady,
} from '~app/contexts/monetization/ads-targeting-emitter';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { usePlayerStatus } from '~app/playback/contexts/player-status';
import { playback } from '~app/playback/playback';
import { premiumStationFallback } from '~app/playback/playback-helpers';
import { ANALYTICS_LOCATION } from '~app/utilities/constants';

export function useLoadInitialStation() {
  const amp = useAmpClient();
  const checkReadyToLoad = useTargetingReady();
  const { geoMarket } = useMarket();
  const player = playback.usePlayer();
  const { station } = playback.useState();

  const [playerStatus, updatePlayerStatus] = usePlayerStatus();

  const pageName = useGetPageName();

  const context = useMemo(
    () => ({
      pageName,
      playedFrom: 6,
      eventLocation: ANALYTICS_LOCATION.MINIPLAYER_BUTTON,
    }),
    [pageName],
  );

  const doLoad = useCallback(
    (station: Station) => {
      if (playerStatus.loaded || playerStatus.loading) return;

      if (isNonNullish(station) && station.id !== -1) {
        updatePlayerStatus({ type: 'updateLoading', payload: true });

        player
          .load({
            ...station,
            targeting: AdsTargetingState.get('targetingParams'),
          })
          .then(() => {
            updatePlayerStatus({
              type: 'batch',
              payload: {
                updateLoaded: true,
                updateLoading: false,
              },
            });

            return null;
          })
          .catch(() => {
            updatePlayerStatus({
              type: 'batch',
              payload: {
                incrementLoadAttempts: undefined,
                updateLoading: false,
              },
            });

            doLoad(premiumStationFallback(station, playerStatus.loadAttempts));
          });
      } else if (isNonNullish(geoMarket?.marketId)) {
        updatePlayerStatus({ type: 'updateLoading', payload: true });

        amp.api.v2.content
          .getLiveStations({
            query: { marketId: geoMarket.marketId, limit: 1 },
          })
          .then(prop('body'))
          .then(prop('hits'))
          .then(hits => hits?.at(0))
          .then(hit => {
            return hit && hit.id ?
                player.load({
                  id: hit.id,
                  context,
                  type: StationType.Live,
                  targeting: AdsTargetingState.get('targetingParams'),
                })
              : player.load({
                  id: 1469,
                  context,
                  type: StationType.Live,
                  targeting: AdsTargetingState.get('targetingParams'),
                });
          })
          .then(() => {
            updatePlayerStatus({
              type: 'batch',
              payload: {
                updateLoaded: true,
                updateLoading: false,
              },
            });

            return null;
          })
          .catch(() => {
            updatePlayerStatus({
              type: 'batch',
              payload: {
                incrementLoadAttempts: undefined,
                updateLoading: false,
              },
            });
          });
      }
    },
    [
      amp.api.v2.content,
      context,
      geoMarket?.marketId,
      player,
      playerStatus,
      updatePlayerStatus,
    ],
  );

  useEffect(() => {
    if (player.initialized) {
      if (checkReadyToLoad()) {
        doLoad(station);
      } else {
        // Otherwise, check every 100ms until AdsTargeting is ready
        (async function doCheck() {
          setTimeout(() => {
            if (checkReadyToLoad()) {
              doLoad(station);
            } else {
              doCheck();
            }
          }, 100);
        })();
      }
    }
  }, [checkReadyToLoad, doLoad, player.initialized, station]);
}
