/* eslint-disable prefer-const */
import {
  type ImgHTMLAttributes,
  type JSX,
  type ReactElement,
  isValidElement,
  memo,
  useRef,
} from 'react';
import { clamp, isNumber } from 'remeda';
import srcset from 'srcset';

import { MediaServerURL } from './media-server-url.js';
import { type GravityRegion, GravityRegions } from './types.js';
import { useImage } from './use-image.js';

type DefaultImageAttributes = ImgHTMLAttributes<HTMLImageElement>;

type ImageFormat = 'webp' | 'png' | 'jpeg' | 'gif';

export type ImageProps = {
  /**
   * The alt text for the image.
   */
  alt: string;
  /**
   * The aspect ratio of the image
   */
  aspectRatio?: `${number} / ${number}`;
  /**
   * Tells media server to allow the browser to cache the catalog images.
   */
  cacheable?: boolean;

  className?: string;

  /**
   * Classnames generated from Vanilla Extract styling
   */
  classNames?: {
    wrapper?: string;
    placeholder?: string;
    image?: string;
  };

  debugPlaceholder?: boolean;

  /**
   * Sprinkles styles
   */
  style?: Record<string, string>;
  /**
   * The gravity to apply to the image
   */
  gravity?: GravityRegion;
  /**
   * The height of the image. Passed to the underlying `height` attribute.
   */
  height?: number;
  /**
   * The height of the image. Passed to the underlying `width` attribute.
   */
  width?: number;
  fetchPriority?: DefaultImageAttributes['fetchPriority'];
  /**
   * The format of the image file to load.
   * @default webp
   */
  format?: ImageFormat;
  /**
   * Define custom loading functionality for the image.
   * @default defaultImageLoader
   */
  resolver?: ImageResolverFunction;
  decoding?: DefaultImageAttributes['decoding'];
  /**
   * Define the `loading` attribute for the image
   * @default "lazy"
   */
  loading?: DefaultImageAttributes['loading'];
  /**
   * Define custom loading functionality for the placeholder image.
   * @default defaultPlaceholderLoader
   */
  placeholderResolver?: ImageResolverFunction;
  /**
   * Whether or not to render a placeholder image.
   * - If `false` or `undefined`, no placeholder will be used.
   * - If `true`, the placeholder will be created using the `placeholderLoader` function.
   * - If a `string`, the value will be used as the placeholder image source, bypassing the `placeholderLoader` function.
   * - If a `ReactElement`, the value will be rendered as the placeholder.
   *
   * Defaults to `true`
   */
  placeholder?: boolean | string | ReactElement;
  /**
   * The source of the image.
   */
  src?: string | URL | MediaServerURL | undefined;

  srcSet?: DefaultImageAttributes['srcSet'];
  /**
   * The quality to use for the image. Specifying this value will add a `quality` parameter to the MediaServerURL.
   * @default 75
   */
  quality?: number;
  /**
   * The widths to define for the image. This is used to generate the `srcset` attribute for various widths. Must define `sizes` if this is defined.
   */
  widths?: Array<number>;
  /**
   * The densities to define for the image. This is used to generate the `srcset` attribute for
   * various pixel densities.
   * @default [1, 2]
   */
  densities?: Array<number>;
  /**
   * The sizes to define for the image. This is used to generate the `sizes` attribute. Must be
   * defined if `widths` is defined.
   */
  sizes?: DefaultImageAttributes['sizes'];
};

export type ImageResolverFunctionArgs = {
  aspectRatio: ImageProps['aspectRatio'];
  cacheable: ImageProps['cacheable'];
  density: Exclude<ImageProps['densities'], undefined>[number];
  format: Exclude<ImageProps['format'], undefined>;
  gravity: Exclude<ImageProps['gravity'], undefined>;
  height: ImageProps['height'];
  quality: Exclude<ImageProps['quality'], undefined>;
  src: ImageProps['src'];
  width: ImageProps['width'];
};

export type ImageResolverFunction = (args: ImageResolverFunctionArgs) => string;

function wholeNumber(x: unknown) {
  return isNumber(x) ? Number(Math.floor(x).toFixed(0)) : 0;
}

export function defaultResolver({
  aspectRatio = '1 / 1',
  cacheable = false,
  density = 1,
  format,
  gravity,
  height: _height,
  quality,
  src,
  width: _width,
}: ImageResolverFunctionArgs) {
  const url = MediaServerURL.fromURL(src);

  if (cacheable) {
    url.cacheable = cacheable;
  }

  if (!url.hasOp('gravity')) {
    url.gravity(gravity);
  }

  // If we pass in a MediaServerURL, we don't want to override the `format` and `quality` already set
  if (!url.hasOp('format')) {
    url.format(format);
  }

  if (!url.hasOp('quality')) {
    url.quality(quality);
  }

  const width = wholeNumber(_width) * density;
  const height = wholeNumber(_height) * density;

  if (width > 0 || height > 0) {
    url.removeOps('fit');
    url.fit(width, height);
  }

  if (!url.hasOp('ratio')) {
    const [aspectWidth, aspectHeight] = aspectRatio
      .split('/')
      .reduce(
        (accumulator, value) => [...accumulator, value.trim()],
        [] as string[],
      );
    url.ratio(Number(aspectWidth), Number(aspectHeight));
  }

  return url.toString();
}

export function defaultPlaceholderResolver(options: ImageResolverFunctionArgs) {
  const { src, format, width } = options;
  return MediaServerURL.fromURL(src)
    .format(format)
    .quality(1)
    .fit(clamp((width ?? 200) * 0.5, { min: 1, max: 100 }), 0)
    .toString();
}

class ImageArgumentsError extends TypeError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * A component for rendering images with support for responsive images, lazy loading, and
 * placeholders. This component is a wrapper around the native `<img>` element.
 */
export const Image = memo(function Image(
  props: ImageProps,
): JSX.Element | null {
  let {
    alt,
    cacheable = false,
    className,
    classNames,
    decoding = 'async',
    densities,
    format = 'webp',
    debugPlaceholder,
    gravity = GravityRegions.Center,
    height: _height,
    resolver = defaultResolver,
    loading = 'lazy',
    placeholder = true,
    placeholderResolver = defaultPlaceholderResolver,
    quality = 75,
    sizes,
    style,
    src,
    widths,
    width: _width,
    aspectRatio,
    srcSet,
    ...restProps
  } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const { height, status, width, onError, onLoad } = useImage(imgRef, {
    height: _height,
    width: _width,
  });

  if (width && height && !aspectRatio) {
    aspectRatio = `${Number(Number(width / height).toFixed(2))} / ${height / height}`;
  }

  try {
    if (densities && densities.length > 0 && widths && widths.length > 0) {
      throw new ImageArgumentsError(
        'cannot specify both "densities" and "widths"',
      );
    }

    if (widths && widths.length > 0 && !sizes) {
      throw new ImageArgumentsError(
        'if declaring "widths", "sizes" must also be declared',
      );
    }

    const placeholderSource =
      placeholder && typeof placeholder === 'string' ? placeholder
      : placeholder === true ?
        placeholderResolver({
          aspectRatio,
          cacheable,
          density: 1,
          format,
          gravity,
          height,
          quality,
          src,
          width,
        })
      : null;

    const hasPlaceholder =
      placeholderSource !== null || isValidElement(placeholder);

    const imageSource = resolver({
      aspectRatio,
      cacheable,
      density: 1,
      format,
      gravity,
      height,
      quality,
      src,
      width,
    });

    const sourceSetDefinitions =
      widths && widths.length > 0 ?
        [...widths, width].sort().map(width => {
          return {
            url: resolver({
              aspectRatio,
              cacheable,
              density: 1,
              format,
              gravity,
              height: 0,
              quality,
              src,
              width,
            }),
            width,
          };
        })
      : (densities ?? [1, 2]).sort().map(density => {
          return {
            url: resolver({
              aspectRatio,
              cacheable,
              density,
              format,
              gravity,
              height,
              quality,
              src,
              width,
            }),
            density,
          };
        });

    const sourceSet = srcset.stringify(sourceSetDefinitions);

    return hasPlaceholder ?
        // Use `data-loaded` attribute to control the visibility/opacity of the placeholder and "real"
        // image with defined styles
        <div
          className={classNames?.wrapper ?? className}
          data-status={status}
          data-test="web.assets.image-wrapper"
          ref={wrapperRef}
          style={{
            ...style,
            display: 'grid',
            gridTemplateAreas: `"img-container"`,
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto',
          }}
        >
          {placeholderSource ?
            <img
              alt={`${alt} (thumbnail)`}
              className={classNames?.placeholder}
              data-test="web.assests.image-placeholder"
              // Set `loading="eager"` and `decoding="sync"` since we want this placeholder image to
              // be loaded and rendered ASAP
              decoding="sync"
              loading="eager"
              src={placeholderSource}
              {...(height > 0 ? { height } : {})}
              {...(width > 0 ? { width } : {})}
              style={{
                ...style,
                aspectRatio: 'inherit',
                gridArea: 'img-container',
                opacity: status !== 'loaded' || debugPlaceholder ? 1 : 0,
                transition: 'opacity 0.3s',
                zIndex: -1,
                height: '100%',
                width: '100%',
              }}
            />
          : placeholder}
          <img
            decoding={decoding}
            loading={loading}
            {...restProps}
            alt={alt}
            className={classNames?.image}
            data-test="web.assets.image"
            onError={onError}
            onLoad={onLoad}
            ref={imgRef}
            sizes={sizes}
            src={imageSource}
            srcSet={srcSet ?? sourceSet}
            style={{
              ...style,
              aspectRatio: 'inherit',
              gridArea: 'img-container',
              opacity: status === 'loaded' && !debugPlaceholder ? 1 : 0,
              transition: 'opacity 0.3s',
              height: '100%',
              width: '100%',
            }}
            {...(height > 0 ? { height } : {})}
            {...(width > 0 ? { width } : {})}
          />
        </div>
      : <img
          decoding={decoding}
          loading={loading}
          {...restProps}
          alt={alt}
          className={classNames?.image}
          data-test="web.assets.image"
          onError={onError}
          onLoad={onLoad}
          ref={imgRef}
          sizes={sizes}
          src={imageSource}
          srcSet={srcSet ?? sourceSet}
          style={style}
          {...(height > 0 ? { height } : {})}
          {...(width > 0 ? { width } : {})}
        />;
  } catch (error: unknown) {
    if (error instanceof ImageArgumentsError) {
      throw new TypeError(error.message);
    }

    console.warn(
      error instanceof Error ? error.message : JSON.stringify(error),
    );
    return null;
  }
});
