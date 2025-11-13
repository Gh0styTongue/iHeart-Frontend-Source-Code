import type {
  ampContract,
  ClientInferResponseBody,
} from '@iheartradio/web.api/amp';
import { getLiveAdUnit } from '@iheartradio/web.playback';
import * as Playback from '@iheartradio/web.playback';
import memoize from 'memoize';
import { useMemo, useRef } from 'react';

import { useConfig } from '~app/contexts/config';
import { playback } from '~app/playback/playback';

import { type AdPosition, CCRPOS } from './constants';

const getPrimaryMarket = memoize(
  (
    markets?: ClientInferResponseBody<
      typeof ampContract.v3.livemeta.getStationMeta
    >['markets'],
  ) => {
    if (!markets) {
      return '';
    }

    const market = markets.find(m => m.isPrimary);

    if (market?.name === 'DIGITAL-NAT') {
      return 'DIGITALCHANNELS';
    }

    return market?.name ?? '';
  },
);

function postfix(ccrpos: AdPosition) {
  return ccrpos === CCRPOS.Inline ? 'n' : undefined;
}

export const useAdUnit = ({ ccrpos }: { ccrpos: AdPosition }) => {
  const config = useRef(useConfig());

  const playerState = playback.useState();
  const adsState = playback.useAds();

  const adId = useRef(config.current.ads.dfpInstanceId);
  const defaultAdUnit = useMemo(
    () =>
      `/${[
        adId.current,
        'ccr.ihr',
        ['ihr4', postfix(ccrpos)].filter(Boolean).join('.'),
      ]
        .filter(Boolean)
        .join('/')}`,
    [ccrpos],
  );

  return useMemo(() => {
    const queue = playerState.queue;
    const index = playerState.index;

    const stationType = playerState.station?.type;

    const itemMeta = queue?.[index]?.meta as Playback.QueueItem['meta'];
    const primaryMarket = getPrimaryMarket(itemMeta?.markets);

    const callLetters = itemMeta?.callLetters;
    const audioProvider = itemMeta?.provider;

    if (
      [
        Playback.AdPlayerStatus.Paused,
        Playback.AdPlayerStatus.Playing,
      ].includes(adsState.status) ||
      (playerState.status === Playback.Status.Idle &&
        adsState.status === Playback.AdPlayerStatus.Buffering)
    ) {
      return null;
    }

    const isPlaying = [
      Playback.Status.Playing,
      Playback.Status.Buffering,
    ].includes(playerState.status);

    if (!isPlaying) {
      return defaultAdUnit;
    } else if (stationType?.toLowerCase() !== Playback.StationType.Live) {
      return `/${[
        adId.current,
        ['ccr.ihr', postfix(ccrpos)].filter(Boolean).join('.'),
        'customtalk',
      ]
        .filter(Boolean)
        .join('/')}`;
    } else {
      return (
        getLiveAdUnit({
          provider: audioProvider,
          callLetters,
          market: primaryMarket,
          dfpInstanceId: adId.current,
          postfix: postfix(ccrpos),
        }) ?? defaultAdUnit
      );
    }
  }, [
    playerState.queue,
    playerState.index,
    playerState.station?.type,
    playerState.status,
    adsState.status,
    defaultAdUnit,
    ccrpos,
  ]);
};
