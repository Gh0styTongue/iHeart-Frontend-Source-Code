import type { CSSProperties } from '@vanilla-extract/css';
import { useMemo } from 'react';
import { isNullish, isPlainObject } from 'remeda';

import type { MediaValue } from '../types/index.js';

/**
 * @description - This function properly maps media props into valid css properties.
 *
 * @param mediaValue {MediaValue<any> | any} - This is the prop that needs to be transformed into
 * valid css.
 * @param mapFn {(value: any) => CSSProperties} - This is the function we use to map the prop into
 * valid css.
 *
 * @returns CSSProperties
 *
 * @example
 * const style = useMapMediaProp({ 'mobile': 'h4', 'large': h3 }, (value) => kinds[value]);
 *
 * // "style" is then equal to the following css:
 * {
 *   "fontSize": {
 *       "mobile": "$20",
 *        "large": "$24"
 *    },
 *   "fontWeight": {
 *     "mobile": "700",
 *   "large": "700"
 *  },
 *  "letterSpacing": {
 *     "mobile": "$1",
 *    "large": "$1"
 *  },
 * "lineHeight": {
 *    "mobile": "$24",
 *    "large": "$30"
 *  },
 * }
 */
export function useMapMediaProp<Value>(
  mediaValue: MediaValue<Value> | Value,
  mapFn: (value: Value) => CSSProperties,
) {
  return useMemo(() => {
    if (isNullish(mediaValue)) {
      return {};
    }

    return isPlainObject(mediaValue) ?
        Object.entries(mediaValue).reduce((accumulator, [condition, value]) => {
          const mappedValue = mapFn(value as Value);

          return Object.entries(mappedValue).reduce(
            (innerAccumulator, [prop, propValue]) => {
              if (!innerAccumulator[prop]) {
                innerAccumulator[prop] = {};
              }

              innerAccumulator[prop][
                condition === 'mobile' ? 'mobile' : condition
              ] = propValue as string | number;
              return innerAccumulator;
            },
            accumulator,
          );
        }, {} as any)
      : mapFn(mediaValue);
  }, [mapFn, mediaValue]);
}
