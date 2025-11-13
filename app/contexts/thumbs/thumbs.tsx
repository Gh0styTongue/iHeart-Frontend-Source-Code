import { sprinkles } from '@iheartradio/web.accomplice';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import { ThumbDownOutline } from '@iheartradio/web.accomplice/icons/thumb-down-outline';
import { ThumbUpOutline } from '@iheartradio/web.accomplice/icons/thumb-up-outline';
import type { AmpClient } from '@iheartradio/web.api/amp';
import {
  ThumbRadioStationTypes,
  ThumbsStationTypes,
} from '@iheartradio/web.api/amp';
import * as Playback from '@iheartradio/web.playback';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isNullish } from 'remeda';

import { amp } from '~app/api/amp-client';
import { playback } from '~app/playback/playback';

import { useConfig } from '../config';
import { useUser } from '../user';

export type Thumbs = 'up' | 'down' | undefined | null;

export enum ThumbStatus {
  Up = 'up',
  Down = 'down',
}

export const ThumbsContext = createContext<{
  isAnonymous: boolean;
  resetThumbTrack: () => Promise<null>;
  setThumbStatus: Dispatch<SetStateAction<Thumbs>>;
  metadata: Playback.Metadata | null;
  station: Playback.Station | null;
  thumbStatus: Thumbs;
  thumbTrack: ({ thumbType }: { thumbType: ThumbStatus }) => Promise<null>;
}>({
  isAnonymous: true,
  resetThumbTrack: async () => null,
  setThumbStatus: () => {
    /* */
  },
  metadata: null,
  station: null,
  thumbStatus: null,
  thumbTrack: async () => null,
});

const fetchTrackThumbStatus = async (trackId: string, amp: AmpClient) => {
  return amp.api.v3.profiles
    .getTrackThumbStatus({
      params: { trackId },
      throwOnErrorStatus: false,
    })
    .then(data => data);
};

export const ThumbsProvider = ({ children }: { children: ReactNode }) => {
  const [thumbStatus, setThumbStatus] = useState<Thumbs>(null);
  const [playerData, setPlayerData] = useState<{
    metadata: Playback.Metadata | null;
    station: Playback.Station | null;
  }>({ metadata: null, station: null });
  const player = playback.usePlayer();
  const { environment } = useConfig();
  const { hostName } = environment;
  const user = useUser();
  const lastTrackId = useRef<number | null>(null);

  const thumbTrack = useCallback(
    async ({ thumbType }: { thumbType: ThumbStatus }) => {
      const playerState = player.getState();
      const station = playerState.get('station');
      const metadata = playerState.get('metadata');

      if (isNullish(metadata)) {
        return null;
      }

      const { context } = station;
      const { data, type } = metadata;
      const { id, trackId: liveStationTrackId, artistId } = data;

      const isActiveLiveStation = type === Playback.MetadataType.InStream;
      const trackId = isActiveLiveStation ? liveStationTrackId : id;

      return (
        (await amp.api.v3.profiles
          .putThumbTrack({
            body: {
              deviceName: hostName,
              playedFrom: context.playedFrom,
              radioStationType: ThumbRadioStationTypes.Enum.track,
              seedId: trackId,
              stationId: artistId.toString(),
              thumbType,
              trackId,
            },
          })
          .then(({ status }) => {
            if (status === 204) {
              setThumbStatus(thumbType);
              addToast({
                NotificationIcon: (
                  <div
                    className={sprinkles({
                      color: 'brandBlack',
                    })}
                  >
                    {thumbType === ThumbStatus.Up ?
                      <ThumbUpOutline />
                    : <ThumbDownOutline />}
                  </div>
                ),
                kind: 'success',
                text:
                  thumbType === ThumbStatus.Up ?
                    isActiveLiveStation ?
                      "Glad you like it. We'll let our Djs know."
                    : "Nice! You'll hear this song more often."
                  : isActiveLiveStation ?
                    `We'll let our Djs know you've heard enough of this song.`
                  : `Got it, you'll hear less of this.`,
              });
            }
            return null;
          })) ?? null
      );
    },
    [hostName, player],
  );

  const resetThumbTrack = useCallback(async () => {
    const playerState = player.getState();
    const metadata = playerState.get('metadata');

    if (isNullish(metadata)) {
      return null;
    }

    const { data, type: metadataType } = metadata;
    const { id, trackId: liveStationTrackId, artistId } = data;

    const isActiveLiveStation = metadataType === Playback.MetadataType.InStream;
    const trackId = isActiveLiveStation ? liveStationTrackId : id;

    return (
      (await amp.api.v3.profiles
        .deleteResetThumb({
          query: {
            stationId: artistId.toString(),
            stationType: ThumbsStationTypes.Enum.Custom,
            trackId,
          },
        })
        .then(({ status }) => {
          if (status === 204) {
            setThumbStatus(null);
          }
          return null;
        })) ?? null
    );
  }, [player]);

  const contextValue = useMemo(() => {
    return {
      thumbStatus,
      setThumbStatus,
      thumbTrack,
      resetThumbTrack,
      metadata: playerData.metadata,
      station: playerData.station,
      isAnonymous: user?.isAnonymous,
    };
  }, [
    thumbStatus,
    setThumbStatus,
    thumbTrack,
    resetThumbTrack,
    user?.isAnonymous,
    playerData,
  ]);

  useEffect(() => {
    if (amp) {
      // Subscribe to the player's `setMetadata` method and fetch the thumb status for the track that was just loaded
      return player.subscribe({
        setMetadata() {
          const playerState = player.getState();
          const station = playerState.get('station');
          const metadata = playerState.get('metadata');

          if (isNullish(metadata)) {
            return null;
          }

          setPlayerData({ metadata, station });

          const { id, trackId: liveStationTrackId } = metadata?.data ?? {};
          const { type: metadataType } = metadata;
          const isActiveLiveStation =
            metadataType === Playback.MetadataType.InStream;
          const trackId = isActiveLiveStation ? liveStationTrackId : id;

          // Immediately set thumb status to null when `setMetadata` is called.
          // This prevents the previous song's thumb status persisting for a short period of time after the player loads a new track.
          if (lastTrackId.current !== trackId) {
            setThumbStatus(null);
          }

          if (
            (station.type !== Playback.StationType.Live ||
              (station.type === Playback.StationType.Live &&
                isActiveLiveStation)) &&
            lastTrackId.current !== trackId
          ) {
            fetchTrackThumbStatus(trackId, amp)
              .then(({ status, body }) => {
                if (status === 404) {
                  setThumbStatus(null);
                  return body;
                } else {
                  setThumbStatus(body);
                }
                return body;
              })
              .catch(() => {
                console.error(
                  `Failed to fetch thumb status for track: ${trackId}`,
                );
              });

            lastTrackId.current = trackId;
          }
        },
      });
    }
  }, [player]);

  return (
    <ThumbsContext.Provider value={contextValue}>
      {children}
    </ThumbsContext.Provider>
  );
};
