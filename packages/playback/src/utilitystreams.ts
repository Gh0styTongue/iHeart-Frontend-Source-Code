import { HTTPError } from '@iheartradio/web.api';
import type { StationEnum } from '@iheartradio/web.api/amp';
import { delay } from '@iheartradio/web.utilities/timing/delay';
import { isPlainObject, prop } from 'remeda';

import { PlayerError, PlayerErrorCode } from './player:error.js';
import type { Api } from './player:types.js';

export type PlaybackStation = (typeof StationEnum)[Extract<
  keyof typeof StationEnum,
  'RADIO' | 'PODCAST' | 'COLLECTION'
>];

const MAX_RETRIES = 3 as const;
const WAIT_ARGS = {
  BASE: 500,
  POW: 0.8,
} as const;

export async function fetchPlaybackStreams(
  {
    api,
    playedFrom,
    stationType,
    contentIds = [],
    initial = true,
    seed,
    seedType,
    stationId,
  }: {
    api: Api;
    playedFrom: number;
    stationType: PlaybackStation;
    contentIds?: number[];
    initial?: boolean;
    seed?: number;
    seedType?: 'ARTIST2START' | 'SONG2START';
    stationId?: string | number;
  },
  tries = 0,
) {
  if (
    stationId === undefined ||
    (stationType === 'PODCAST' && contentIds.length === 0)
  ) {
    throw PlayerError.new({ code: PlayerErrorCode.InternalPlayerError });
  }

  try {
    const { items, ageLimit } = await api.api.v2.playback
      .postStreams({
        body: {
          contentIds,
          playedFrom,
          hostName: api.hostName,
          stationId: String(stationId),
          stationType,
          startStream:
            initial && seedType && seed ?
              { contentId: seed, reason: seedType }
            : undefined,
        },
      })
      .then(prop('body'));

    return { items, ageLimit };
  } catch (error: unknown) {
    if (error instanceof HTTPError) {
      const responseErrors = await error.getResponseErrors();
      const data = {
        requestPayload: await error.getRequestPayload(),
        requestUrl: await error.getRequestUrl(),
        responseErrors,
      };
      const noMoreSongs = responseErrors.some(
        (value: unknown) =>
          isPlainObject(value) && 'code' in value && value.code === 617,
      );

      if (noMoreSongs) {
        throw PlayerError.new({
          code: PlayerErrorCode.ApiNoMoreSongs,
          data,
        });
      } else {
        throw PlayerError.new({
          code: PlayerErrorCode.ApiError,
          data,
        });
      }
    } else if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        // If the request timed out, then make the request again with an exponential back-off
        if (tries < MAX_RETRIES) {
          const nextTry = tries + 1;
          // Calculate the timeout - nextTry times 500 to the power of .8, which would result in
          // wait times of: 144ms, 251ms & 347ms, respectively
          await delay(Math.floor((nextTry * WAIT_ARGS.BASE) ** WAIT_ARGS.POW));

          return fetchPlaybackStreams(
            {
              api,
              playedFrom,
              stationType,
              contentIds,
              initial,
              seedType,
              stationId,
            },
            nextTry,
          );
        } else {
          throw error;
        }
      } else {
        throw PlayerError.new({
          code: PlayerErrorCode.Generic,
          data: {
            stack: error.stack,
            cause: error.cause,
            message: error.message,
          },
        });
      }
    } else {
      throw PlayerError.new({
        code: PlayerErrorCode.Generic,
      });
    }
  }
}
