import type { DurationUnit } from 'luxon';
import { Duration } from 'luxon';
import { isNonNullish } from 'remeda';

export type FormatDurationOptions = {
  doubleDigits?: {
    hours?: boolean;
    minutes?: boolean;
    seconds?: boolean;
  };
};

export function formatDuration(
  seconds?: number,
  options?: FormatDurationOptions,
) {
  const duration = Duration.fromObject({
    seconds:
      isNonNullish(seconds) && !Number.isNaN(seconds) && seconds >= 0 ?
        seconds
      : 0,
  }).shiftTo('days', 'hours', 'minutes', 'seconds');

  let fmtString: string = '';
  const shiftToFlags: Partial<Record<DurationUnit, boolean>> = {
    days: false,
    hours: false,
    minutes: true,
    seconds: true,
  };

  if (duration.days > 0) {
    shiftToFlags.days = true;
    fmtString += 'd:';
  }

  if (duration.hours > 0 || duration.days > 0) {
    shiftToFlags.hours = true;
    fmtString +=
      shiftToFlags.days || options?.doubleDigits?.hours ? 'hh:' : 'h:';
  }

  fmtString +=
    shiftToFlags.hours || shiftToFlags.days || options?.doubleDigits?.minutes ?
      'mm:'
    : 'm:';

  fmtString += 'ss';

  const shiftToArgs = Object.entries(shiftToFlags).reduce(
    (accumulator, [key, value]) => {
      if (value) {
        accumulator.push(key as DurationUnit);
      }
      return accumulator;
    },
    [] as DurationUnit[],
  );

  return duration.shiftTo(...shiftToArgs).toFormat(fmtString);
}
