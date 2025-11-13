import { isNonNullish, isNullish } from 'remeda';
import srcset from 'srcset';

import { MediaServerURL } from './media-server-url.js';
import type { GravityRegion, Macro } from './types.js';

/**
 *
 * @param ratio
 * @returns the parsed ratio or `undefined`
 */
export function parseRatio(
  ratio: Ratio,
): readonly [number, number] | undefined {
  if (typeof ratio === 'string') {
    const parts = ratio.trim().split(/[/:]/);

    if (parts.length !== 2) {
      return undefined;
    }

    return parts.map(x => Number.parseInt(x)) as [number, number];
  }

  if (Array.isArray(ratio) && ratio.length === 2) {
    return ratio;
  }

  return undefined;
}

type GetDimensionsInput = {
  height?: number | undefined;
  width?: number | undefined;
  ratio?: readonly [number, number] | number;
};

export function getDimensions({ height, width, ratio }: GetDimensionsInput) {
  if (height && width) {
    return { height, width };
  }

  if (
    isNullish(ratio) ||
    ratio === 0 ||
    (Array.isArray(ratio) && ratio.includes(0))
  ) {
    return undefined;
  }

  const computedRatio =
    Array.isArray(ratio) ? ratio[0] / ratio[1] : (ratio as number);

  if (!height && width) {
    return {
      height: width / computedRatio,
      width,
    };
  } else if (!width && height) {
    return {
      height,
      width: height * computedRatio,
    };
  }
}

type RatioString =
  | `${number}:${number}`
  | `${number}/${number}`
  | `${number} / ${number}`;
type Ratio = readonly [number, number] | RatioString;

export interface ResponsiveImgOptions {
  height?: number;
  width: number;
  densities?: number[];
  quality?: number;
  ratio?: Ratio;
  gravity?: GravityRegion;
  run?: Macro;
}

export function getResponsiveImgAttributes(
  imageUrl: MediaServerURL | URL | string | undefined | null,
  {
    height,
    width,
    densities = [1, 1.5, 2],
    ratio,
    gravity,
    run,
  }: ResponsiveImgOptions,
) {
  if (!imageUrl || (typeof imageUrl === 'string' && !URL.canParse(imageUrl))) {
    return { src: imageUrl ?? undefined, srcSet: undefined };
  }

  const mediaServerURL =
    imageUrl instanceof MediaServerURL ?
      imageUrl.clone()
    : MediaServerURL.fromURL(imageUrl);

  if (gravity && !mediaServerURL.hasOp('gravity')) {
    mediaServerURL.gravity(gravity);
  }

  let parsedRatio;

  if (ratio) {
    parsedRatio = parseRatio(ratio);

    if (isNonNullish(parsedRatio) && !mediaServerURL.hasOp('ratio')) {
      mediaServerURL.ratio(...parsedRatio);
    }
  }

  if (run && !mediaServerURL.hasOp('run')) {
    mediaServerURL.run(run);
  }

  return {
    ...getDimensions({ width, height, ratio: parsedRatio }),
    src: mediaServerURL.clone().scale(width).toString(),
    srcSet:
      densities ?
        srcset.stringify(
          densities?.map(d => ({
            density: d,
            url: mediaServerURL
              .clone()
              .scale(Math.ceil(width * d))
              .toString(),
          })),
        )
      : undefined,
  };
}
