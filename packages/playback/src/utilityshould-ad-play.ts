import { isNonNullish, isNullish } from 'remeda';

import * as Playback from './player:types.js';

const lastAdTest = ({
  lastAdComplete,
  lastAdError,
  interval,
}: {
  lastAdComplete?: Playback.Ad;
  lastAdError?: Playback.Ad;
  interval: number;
}) => {
  // if we have a completed ad, but do not have an error
  if (isNonNullish(lastAdComplete) && isNullish(lastAdError)) {
    // return whether the time between now and and the last ad complete is less than the interval
    return Date.now() - lastAdComplete.timestamp < interval;

    // if we have an ad error, but do not have an ad complete
  } else if (isNullish(lastAdComplete) && isNonNullish(lastAdError)) {
    return Date.now() - lastAdError.timestamp < 60_000;

    // else if we have both an ad complete and an ad error
  } else if (isNonNullish(lastAdComplete) && isNonNullish(lastAdError)) {
    return (
      // return whether the last error was less than a minute ago
      Date.now() - lastAdError.timestamp < 60_000 ||
      // or return whether the last complete was less than the interval
      Date.now() - lastAdComplete.timestamp < interval
    );
  } else {
    // else we have neither lastAdError nor lastAdComplete (we shouldn't ever get here, but for completeness-sake)
    // so return true
    return true;
  }
};

export const shouldAdPlay = async ({
  ads,
  interval,
  format,
  type,
}: {
  ads: Playback.Ads;
  interval: number;
  format: Playback.AdFormat;
  type: Playback.AdType;
}): Promise<boolean> => {
  // Get the last ad that successfully completed
  const lastAdComplete: Playback.Ad | undefined = ads.history.findLast(
    entry =>
      entry.type === type &&
      entry.status === Playback.AdStatus.Complete &&
      entry.format === format,
  );

  // Get the last ad that errored out
  const lastAdError: Playback.Ad | undefined = ads.history.findLast(
    entry =>
      entry.type === type &&
      entry.status === Playback.AdStatus.Error &&
      entry.format === format,
  );

  // If both `lastAdComplete` and `lastAdError` are nil
  if (isNullish(lastAdComplete) && isNullish(lastAdError)) {
    // then the ad should definitely play, so return true
    return true;
  } else {
    // We have a `lastAdComplete`, `lastAdError` or both, we need to run some additional logic to
    // determine if the ad should play, if the test fails - the ad should play
    return !lastAdTest({
      lastAdComplete,
      lastAdError,
      interval,
    });
  }
};
