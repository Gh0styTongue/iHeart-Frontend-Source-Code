import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import ms from 'ms';
import { isNonNullish, merge } from 'remeda';
import { isZodErrorLike } from 'zod-validation-error';

import * as Schemas from './player:schemas.js';
import * as Playback from './player:types.js';
import {
  type ExtendedErrorFactoryOptions,
  ExtendedError,
} from './utility:extended-error.js';

export enum PlayerErrorCode {
  AdBlocker = 'AdBlocker',
  AdsMetadata = 'AdsMetadata',
  AutoplayBlocked = 'AutoplayBlocked',
  ApiError = 'ApiError',
  ApiNoMoreSongs = 'ApiNoMoreSongs',
  CriticalError = 'CriticalError',
  Generic = 'Generic',
  InternalPlayerError = 'InternalPlayerError',
  InternalPlayerErrorDuringScan = 'InternalPlayerErrorDuringScan',
  InternalPlayerErrorFatal = 'InternalPlayerErrorFatal',
  InvalidMetadata = 'InvalidMetadata',
  InvalidPageKey = 'InvalidPageKey',
  InvalidPlayerState = 'InvalidPlayerState',
  InvalidSeekType = 'InvalidSeekType',
  InvalidSeekValue = 'InvalidSeekValue',
  InvalidSpeed = 'InvalidSpeed',
  InvalidSpeedType = 'InvalidSpeedType',
  InvalidStation = 'InvalidStation',
  InvalidTime = 'InvalidTime',
  InvalidVolume = 'InvalidVolume',
  Midroll = 'Midroll',
  MissingStreams = 'MissingStreams',
  NetworkError = 'NetworkError',
  PlayAttemptFailed = 'PlayAttemptFailed',
  Preroll = 'Preroll',
  RestrictedDuringAdBreak = 'RestrictedDuringAdBreak',
  SkipLimit = 'SkipLimit',
  Targeting = 'Targeting',
  UnsupportedMethod = 'UnsupportedMethod',
  NoAvailableSongs = 'NoAvailableSongs',
}

export enum PlayerErrorMessages {
  AdBlocker = 'It looks like you have an ad blocker configured, please disable it before streaming',
  AdsMetadata = 'Could not set player metadata for playback ad',
  ApiError = 'There was an error fetching the streams',
  ApiNoMoreSongs = 'Sorry, this station has run out of songs to play.',
  AutoplayBlocked = 'Attempted to autoplay, but something went wrong.',
  CriticalError = 'There was a critical error loading the player, please try refreshing the browser',
  Generic = 'Uh oh! Something went wrong :(',
  InternalPlayerError = 'Uh oh! An internal player error occurred.',
  InternalPlayerErrorDuringScan = '',
  InternalPlayerErrorFatal = "We're having problems playing this station right now",
  InvalidMetadata = 'Metadata follows the incorrect shape',
  InvalidPageKey = 'Missing or invalid page key.',
  InvalidPlayerState = 'The shape of player state is invalid.',
  InvalidSeekType = 'Seeking during a stream is not possible.',
  InvalidSeekValue = 'Must take a positive integer value.',
  InvalidSpeed = '"speed" must be a number between 0.25 and 4.',
  InvalidSpeedType = 'Player speed can only be updated for episodes.',
  InvalidStation = '"station" is "null". You must load a station into playback first before triggering this method.',
  InvalidTime = 'Position and duration must be a number greater than 0.',
  InvalidVolume = 'Volume must be a number between 0 and 100.',
  Midroll = 'Attempted to play a midroll ad, but something went wrong.',
  MissingStreams = 'There were no streams returned for this station.',
  NetworkError = 'Uh oh! A network error occurred :(',
  PlayAttemptFailed = 'Attempted to play, but something went wrong.',
  Preroll = 'Attempted to play a preroll ad, but something went wrong.',
  ResolvedStreams = 'Could not resolve any streams for this station.',
  RestrictedDuringAdBreak = 'This method is restricted for ad breaks.',
  SkipLimit = 'The user has reached their skip limit.',
  Targeting = 'Attempted to set targeting parameters for playback ad, but something went wrong',
  UnsupportedMethod = 'This method is not supported for this station type.',
  ValidStreams = 'There were no valid streams available for this station.',
  NoAvailableSongs = 'No available songs to play',
}

export const PlayerError = createEmitter({
  Code: PlayerErrorCode,

  new(options: ExtendedErrorFactoryOptions<PlayerErrorCode>) {
    const extendedError = new ExtendedError<PlayerErrorCode>({
      ...options,
      message: options.message ?? PlayerError[options.code]?.message,
      name: 'Playback.Error',
    });
    Object.defineProperty(extendedError, 'message', { enumerable: true });

    return Schemas.PlayerErrorSchema.parse(extendedError);
  },

  [PlayerErrorCode.AdBlocker]: {
    code: PlayerErrorCode.AdBlocker,
    message: PlayerErrorMessages.AdBlocker,
  },

  [PlayerErrorCode.AdsMetadata]: {
    code: PlayerErrorCode.AdsMetadata,
    message: PlayerErrorMessages.AdsMetadata,
  },

  [PlayerErrorCode.ApiError]: {
    code: PlayerErrorCode.ApiError,
    message: PlayerErrorMessages.ApiError,
  },

  [PlayerErrorCode.ApiNoMoreSongs]: {
    code: PlayerErrorCode.ApiNoMoreSongs,
    message: PlayerErrorMessages.ApiNoMoreSongs,
  },

  [PlayerErrorCode.AutoplayBlocked]: {
    code: PlayerErrorCode.AutoplayBlocked,
    message: PlayerErrorMessages.AutoplayBlocked,
  },

  [PlayerErrorCode.CriticalError]: {
    code: PlayerErrorCode.CriticalError,
    message: PlayerErrorMessages.CriticalError,
  },

  [PlayerErrorCode.Generic]: {
    code: PlayerErrorCode.Generic,
    message: PlayerErrorMessages.Generic,
  },

  [PlayerErrorCode.InternalPlayerError]: {
    code: PlayerErrorCode.InternalPlayerError,
    message: PlayerErrorMessages.InternalPlayerError,
  },

  [PlayerErrorCode.InternalPlayerErrorDuringScan]: {
    code: PlayerErrorCode.InternalPlayerErrorDuringScan,
    message: PlayerErrorMessages.InternalPlayerError,
  },

  [PlayerErrorCode.InternalPlayerErrorFatal]: {
    code: PlayerErrorCode.InternalPlayerErrorFatal,
    message: PlayerErrorMessages.InternalPlayerErrorFatal,
  },

  [PlayerErrorCode.InvalidMetadata]: {
    code: PlayerErrorCode.InvalidMetadata,
    message: PlayerErrorMessages.InvalidMetadata,

    validate(metadata: Playback.Metadata) {
      try {
        return Schemas.MetadataSchema.parse(metadata);
      } catch {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidMetadata,
          data: metadata,
          message: PlayerErrorMessages.InvalidMetadata,
        });
      }
    },
  },

  [PlayerErrorCode.InvalidPageKey]: {
    code: PlayerErrorCode.InvalidPageKey,
    message: PlayerErrorMessages.InvalidPageKey,
  },

  [PlayerErrorCode.InvalidPlayerState]: {
    code: PlayerErrorCode.InvalidPlayerState,
    message: PlayerErrorMessages.InvalidPlayerState,

    validate<Station extends Playback.Station>(
      state: Playback.PlayerState<Station>,
    ) {
      try {
        return Schemas.createPlayerStateSchema(
          Schemas.StationSchema.unwrap(),
        ).parse(state);
      } catch (error: any) {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidPlayerState,
          data: {
            state,
            error: isZodErrorLike(error) ? error.issues : error,
          },
          message: PlayerErrorMessages.InvalidPlayerState,
        });
      }
    },
  },

  [PlayerErrorCode.InvalidSeekType]: {
    code: PlayerErrorCode.InvalidSeekType,
    message: PlayerErrorMessages.InvalidSeekType,

    validate(type: Playback.QueueItemType) {
      if (type === Playback.QueueItemType.Stream) {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidSeekType,
          data: { type },
          message: PlayerErrorMessages.InvalidSeekType,
        });
      }
    },
  },

  [PlayerErrorCode.InvalidSeekValue]: {
    code: PlayerErrorCode.InvalidSeekValue,
    message: PlayerErrorMessages.InvalidSeekValue,

    validate(seconds: Playback.SeekValue) {
      try {
        return Schemas.SeekValue.parse(seconds);
      } catch {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidSeekValue,
          data: { seconds },
          message: PlayerErrorMessages.InvalidSeekValue,
        });
      }
    },
  },

  [PlayerErrorCode.InvalidSpeed]: {
    code: PlayerErrorCode.InvalidSpeed,
    message: PlayerErrorMessages.InvalidSpeed,

    validate(speed: Playback.Speed) {
      try {
        return Schemas.SpeedSchema.parse(speed);
      } catch {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidSpeed,
          data: { speed },
          message: PlayerErrorMessages.InvalidSpeed,
        });
      }
    },
  },

  [PlayerErrorCode.InvalidSpeedType]: {
    code: PlayerErrorCode.InvalidSpeedType,
    message: PlayerErrorMessages.InvalidSpeedType,

    validate(type: Playback.QueueItemType) {
      if (type !== Playback.QueueItemType.Episode) {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidSpeedType,
          data: { type },
          message: PlayerErrorMessages.InvalidSpeedType,
        });
      }
    },
  },

  [PlayerErrorCode.InvalidStation]: {
    code: PlayerErrorCode.InvalidStation,
    message: PlayerErrorMessages.InvalidStation,

    validate<Station extends Playback.Station | null>(station?: Station) {
      try {
        return Schemas.StationSchema.unwrap().parse(station);
      } catch {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidStation,
          data: { station },
          message: PlayerErrorMessages.InvalidStation,
        });
      }
    },
  },

  [PlayerErrorCode.InvalidTime]: {
    code: PlayerErrorCode.InvalidTime,
    message: PlayerErrorMessages.InvalidTime,

    validate(time: Playback.Time) {
      try {
        return Schemas.TimeSchema.parse(time);
      } catch {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidTime,
          data: { time },
          message: PlayerErrorMessages.InvalidTime,
        });
      }
    },
  },

  [PlayerErrorCode.InvalidVolume]: {
    code: PlayerErrorCode.InvalidVolume,
    message: PlayerErrorMessages.InvalidVolume,

    validate(volume: Playback.Volume) {
      try {
        return Schemas.VolumeSchema.parse(volume);
      } catch {
        throw PlayerError.new({
          code: PlayerErrorCode.InvalidVolume,
          data: { volume },
          message: PlayerErrorMessages.InvalidVolume,
        });
      }
    },
  },

  [PlayerErrorCode.Midroll]: {
    code: PlayerErrorCode.Midroll,
    message: PlayerErrorMessages.Midroll,
  },

  [PlayerErrorCode.MissingStreams]: {
    code: PlayerErrorCode.MissingStreams,
    message: PlayerErrorMessages.MissingStreams,
  },

  [PlayerErrorCode.NetworkError]: {
    code: PlayerErrorCode.NetworkError,
    message: PlayerErrorMessages.NetworkError,
  },

  [PlayerErrorCode.PlayAttemptFailed]: {
    code: PlayerErrorCode.PlayAttemptFailed,
    message: PlayerErrorMessages.PlayAttemptFailed,
  },

  [PlayerErrorCode.Preroll]: {
    code: PlayerErrorCode.Preroll,
    message: PlayerErrorMessages.Preroll,
  },

  [PlayerErrorCode.NoAvailableSongs]: {
    code: PlayerErrorCode.NoAvailableSongs,
    message: PlayerErrorMessages.NoAvailableSongs,
  },

  [PlayerErrorCode.RestrictedDuringAdBreak]: {
    code: PlayerErrorCode.RestrictedDuringAdBreak,
    message: PlayerErrorMessages.RestrictedDuringAdBreak,

    // We are getting reports of the "This method is restricted during ad breaks"
    // While scanning, but no clue what method is originating those errors, so have
    // added a `method` param that will get included in the error meta [DEM 2025/02/26]
    validate(adbreak: boolean, method?: string) {
      if (adbreak) {
        throw PlayerError.new({
          code: PlayerErrorCode.RestrictedDuringAdBreak,
          message: PlayerErrorMessages.RestrictedDuringAdBreak,
          ...(method ? { meta: method } : {}),
        });
      }
    },
  },

  [PlayerErrorCode.SkipLimit]: {
    code: PlayerErrorCode.SkipLimit,
    message: PlayerErrorMessages.SkipLimit,

    validate(skips: number) {
      if (skips < 0) {
        throw PlayerError.new({
          code: PlayerErrorCode.SkipLimit,
          data: { skips },
          message: PlayerErrorMessages.SkipLimit,
        });
      }
    },
  },

  [PlayerErrorCode.Targeting]: {
    code: PlayerErrorCode.Targeting,
    message: PlayerErrorMessages.Targeting,
  },

  [PlayerErrorCode.UnsupportedMethod]: {
    code: PlayerErrorCode.UnsupportedMethod,
    message: PlayerErrorMessages.UnsupportedMethod,

    validate<Fn extends (...args: any[]) => any>(fn?: Fn) {
      if (fn === undefined) {
        throw PlayerError.new({
          code: PlayerErrorCode.UnsupportedMethod,
          message: PlayerErrorMessages.UnsupportedMethod,
        });
      }

      return fn;
    },
  },
});

type RetryOptions = {
  [k: number]: number;
};
type SpecialHandler = <T extends ErrorCounter>(
  instance: T,
  data?: jwplayer.ErrorParam,
) => void;
type SpecialHandlers = Partial<{ [k: number]: SpecialHandler }>;
type ErrorCounterProps = {
  retryOptions: RetryOptions;
  clearIntervalAfterFatal: number;
  specialHandlers: SpecialHandlers;
};
const DEFAULT_ERROR_COUNTER_PROPS: ErrorCounterProps = {
  // https://docs.jwplayer.com/players/docs/jw8-player-errors-reference#media-playback-html5
  retryOptions: {
    220_001: 3,
    221_000: 3,
    224_000: 1,
    224_001: 3,
    224_002: 3,
    224_003: 1,
    230_000: 3,
    230_001: 3,
    230_002: 1,
    232_000: 3,
    232_001: 3,
    232_002: 1,
    232_006: 3,
    232_011: 1,
    232_012: 1,
    232_400: 3,
    232_401: 3,
    232_404: 3,
    232_500: 3,
    232_501: 3,
    232_503: 3,
    232_600: 1,
    232_631: 1,
    232_632: 1,
    233_000: 1,
    233_001: 3,
    233_006: 1,
    233_011: 1,
    233_012: 1,
    233_400: 1,
    233_401: 1,
    233_403: 1,
    233_404: 1,
    233_500: 1,
    233_501: 1,
    233_503: 1,
    233_600: 1,
    233_650: 1,
    234_001: 3,
    234_002: 3,
    239_000: 1,
  },
  clearIntervalAfterFatal: ms('30s'),
  specialHandlers: {},
} as const;
export class ErrorCounter {
  readonly #errorMap: Map<number, number>;
  readonly #retryMap: Map<number, number>;
  readonly #specialHandlers: SpecialHandlers;
  readonly #retryAfter: number;
  readonly #defaultHandler: SpecialHandler;
  #fatalCodes: Set<number>;
  #lockoutCreated: number | undefined;

  constructor(
    props: Partial<ErrorCounterProps> & { defaultHandler: SpecialHandler },
  ) {
    const retryOptions =
      props?.retryOptions ?? DEFAULT_ERROR_COUNTER_PROPS.retryOptions;
    const clearIntervalAfterFatal =
      props?.clearIntervalAfterFatal ??
      DEFAULT_ERROR_COUNTER_PROPS.clearIntervalAfterFatal ??
      ms('30s');
    const specialHandlers =
      merge(
        DEFAULT_ERROR_COUNTER_PROPS.specialHandlers,
        props?.specialHandlers,
      ) ?? {};

    this.#retryMap = Object.entries(retryOptions).reduce(
      (accumulator, [key, value]) => accumulator.set(Number(key), value),
      new Map<number, number>(),
    );
    this.#errorMap = new Map();
    this.#retryAfter = clearIntervalAfterFatal;
    this.#fatalCodes = new Set();
    this.#lockoutCreated = undefined;
    this.#specialHandlers = specialHandlers;
    this.#defaultHandler = props.defaultHandler;
  }

  shouldRetry(code: number): boolean {
    return this.#retryMap.has(code);
  }

  retry(code: number, data?: jwplayer.ErrorParam): boolean {
    let newCount: number;

    if (this.#errorMap.has(code)) {
      newCount = (this.#errorMap.get(code) ?? 0) + 1;
    } else {
      newCount = 1;
    }
    this.#errorMap.set(code, newCount);

    const maxTries = this.#retryMap.get(code);

    if (isNonNullish(maxTries)) {
      const stop = newCount > maxTries;

      if (stop) {
        this.fatal(code, data);
      }
      return !stop;
    }

    return true;
  }

  clear(code: number): void {
    this.#errorMap.delete(code);
    this.#fatalCodes.delete(code);
  }

  clearAll(): void {
    this.#errorMap.clear();
    this.#fatalCodes.clear();
  }

  count(code: number): number | undefined {
    return this.#errorMap.get(code);
  }

  private fatal(code: number, data?: jwplayer.ErrorParam): void {
    this.#fatalCodes.add(code);
    this.#lockoutCreated = Date.now();

    const handler = this.#specialHandlers[code] ?? this.#defaultHandler;
    handler(this, data);

    setTimeout(() => {
      this.clear(code);
    }, this.#retryAfter);
  }

  get isFatal() {
    return this.#fatalCodes.size > 0;
  }

  get timeRemaining() {
    return this.isFatal ?
        (this.#lockoutCreated ?? 0) + this.#retryAfter - Date.now()
      : 0;
  }

  timeRemainingFormatted(): `${string} second` | `${string} seconds` {
    const d = new Date(Date.UTC(0, 0, 0, 0, 0, 0, this.timeRemaining));
    const seconds = d.getUTCSeconds();

    return seconds > 1 ? `${seconds} seconds` : `${seconds} second`;
  }
}
