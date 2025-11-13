import { addToast } from '@iheartradio/web.accomplice/components/toast';
import { PlayerErrorCode } from '@iheartradio/web.playback';
import { useEffect } from 'react';
import { isNonNullish } from 'remeda';

import { usePlayerStatus } from '../contexts/player-status';
import { playback } from '../playback';

function safeJsonParse<T extends Record<string, unknown>>(
  data: string,
): T | undefined {
  try {
    return JSON.parse(data) as T;
  } catch {
    return undefined;
  }
}

const IGNORED_ERRORS = new Set([
  PlayerErrorCode.PlayAttemptFailed,
  PlayerErrorCode.ApiError,
  60_003,
]);

function getErrorInformation(error?: Error) {
  if (error) {
    const data =
      'data' in error && typeof error.data === 'string' ?
        safeJsonParse(error.data)
      : undefined;
    const dataCode =
      !!data && 'code' in data && typeof data.code === 'number' ?
        data.code
      : undefined;
    const errorCode =
      'code' in error && typeof error.code === 'string' ?
        (error.code as PlayerErrorCode)
      : undefined;
    const errorMessage =
      'message' in error && typeof error.message === 'string' ?
        error.message
      : undefined;

    return {
      dataCode,
      errorCode,
      errorMessage,
    };
  } else {
    return {
      dataCode: undefined,
      errorCode: undefined,
      errorMessage: undefined,
    };
  }
}

export function usePlayerErrorToast() {
  const lastError = playback.useError();
  const [state] = usePlayerStatus();
  const { loaded, loadAttempts } = state;

  useEffect(() => {
    const [error] = lastError?.slice(-1) ?? [];

    // if we're still trying to load a premium fallback or the default station, don't pop an error
    // toast just yet;
    if (!loaded && loadAttempts < 2) return;

    globalThis.window?.newrelic?.noticeError?.(error);

    const { dataCode, errorCode, errorMessage } = getErrorInformation(error);

    if (
      (errorCode && IGNORED_ERRORS.has(errorCode)) ||
      (dataCode && IGNORED_ERRORS.has(dataCode))
    ) {
      return;
    }

    // If we have trouble playing a live station during scan, we don't necessarily want to show an error and stop playback
    // so here we handle just showing a warning. The continuation of playback happens in the JW Player Subscription
    if (
      isNonNullish(error) &&
      errorCode &&
      errorMessage &&
      'meta' in error &&
      errorCode === PlayerErrorCode.InternalPlayerErrorDuringScan
    ) {
      addToast({
        kind: 'warning',
        text: `We had trouble playing ${error.meta}`,
      });
    } else if (errorMessage) {
      addToast({
        kind: 'error',
        text: errorMessage,
      });
    }
  }, [lastError, loadAttempts, loaded]);
}
