import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  type ComponentProps,
  type ForwardedRef,
  type PropsWithChildren,
  forwardRef,
} from 'react';

import type { RainbowSprinkles } from '../../rainbow-sprinkles.css.js';
import {
  companionAdHeight,
  companionAdStyles,
  companionAdWidth,
} from './companion-ad.css.js';

export type CompanionAdProps = PropsWithChildren<ComponentProps<'div'>> &
  Pick<RainbowSprinkles, 'width' | 'height'>;

function _CompanionAdContainer(
  { width, height, children, ...props }: CompanionAdProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      className={companionAdStyles}
      ref={ref}
      style={assignInlineVars({
        [companionAdHeight]: `${height}px`,
        [companionAdWidth]: `${width}px`,
      })}
      {...props}
    >
      {children}
    </div>
  );
}

export const CompanionAdContainer = forwardRef(_CompanionAdContainer);
