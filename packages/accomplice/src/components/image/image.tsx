import type { ImageProps as PrimitiveProps } from '@iheartradio/web.assets';
import { Image as Primitive } from '@iheartradio/web.assets';
import { type PropsWithChildren, cloneElement, memo } from 'react';

import { lightDark } from '../../media.js';
import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { vars } from '../../theme-contract.css.js';
import {
  imageStyles,
  loaderStyles,
  placeholderStyles,
  spinnerStyles,
  wrapperStyles,
} from './image.css.js';

export type ImageProps = Omit<PrimitiveProps, 'classNames' | 'style'> & {
  css?: RainbowSprinkles;
  aspectRatio?: string;
  backgroundColor?: ReturnType<typeof lightDark>;
};

/**
 * Image component
 *
 * Accepts all props from `web.asset` Image {@link PrimitiveProps},
 * except `classNames` which are generated in this component
 */
const Image = memo(function Image(props: ImageProps) {
  const { aspectRatio, backgroundColor, css, ...restProps } = props;

  const { className, style } = rainbowSprinkles({
    aspectRatio,
    backgroundColor:
      backgroundColor ?? lightDark(vars.color.brandWhite, vars.color.gray600),
    ...css,
  });

  const classNames: PrimitiveProps['classNames'] = {
    wrapper: [wrapperStyles, className].join(' '),
    placeholder: [placeholderStyles, className].join(' '),
    image: [imageStyles, className].join(' '),
  };

  return <Primitive classNames={classNames} style={style} {...restProps} />;
});

Image.displayName = 'Image';

/**
 * Wrapper component for custom placeholder. Using this will ensure that the placeholder
 * shows/hides correctly when the image finishes loading
 *
 * @param {children} children
 * @returns JSX.Element
 */
const Loader = ({ children }: PropsWithChildren) => (
  <div className={loaderStyles} data-test="web.accomplice.Image-Loader">
    {children}
  </div>
);

/**
 * Basic spinner-type placeholder.
 *
 * Uses `cloneElement` so that the `props.placeholder.type` check will pass.
 *
 * When using this element as a placeholder, pass it as `placeholder={Spinner}`, instead of
 * `placeholder={<Spinner />}`
 */
const Spinner = cloneElement<null>(
  <Loader />,
  undefined,
  <div
    className={spinnerStyles}
    data-test="web.accomplice.Image-Loader.Spinner"
  />,
);

export { Image, Loader, Spinner };
