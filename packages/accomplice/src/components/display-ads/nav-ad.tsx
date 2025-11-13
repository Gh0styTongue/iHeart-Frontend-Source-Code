import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  type ComponentProps,
  type ForwardedRef,
  type PropsWithChildren,
  forwardRef,
} from 'react';

import type { RainbowSprinkles } from '../../rainbow-sprinkles.css.js';
import { navAdHeight, navAdStyles, navAdWidth } from './nav-ad.css.js';

export type NavAdProps = PropsWithChildren<ComponentProps<'div'>> &
  Pick<RainbowSprinkles, 'width' | 'height'>;

function _NavAdContainer(
  { width, height, children, ...props }: NavAdProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      className={navAdStyles}
      ref={ref}
      style={assignInlineVars({
        [navAdHeight]: `${height}px`,
        [navAdWidth]: `${width}px`,
      })}
      {...props}
    >
      {children}
    </div>
  );
}

export const NavAdContainer = forwardRef(_NavAdContainer);
