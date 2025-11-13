import { clsx } from 'clsx/lite';
import {
  type ComponentProps,
  type ForwardedRef,
  type PropsWithChildren,
  forwardRef,
} from 'react';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { inlineAdStyles, inlineAdWrapperStyles } from './inline-ad.css.js';

export type InlineAdProps = PropsWithChildren<ComponentProps<'div'>> &
  Pick<RainbowSprinkles, 'width' | 'height'> & { isGrid?: boolean };

function _InlineAdContainer(
  { width, height, children, ...props }: InlineAdProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { className, style } = rainbowSprinkles({ width, height });
  return (
    <div
      className={clsx(inlineAdStyles, className)}
      ref={ref}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

function _InlineAdWrapper(
  { children, isGrid = false, ...props }: InlineAdProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      className={inlineAdWrapperStyles}
      data-grid={isGrid}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
}

export const InlineAdContainer = forwardRef(_InlineAdContainer);
export const InlineAdWrapper = forwardRef(_InlineAdWrapper);
