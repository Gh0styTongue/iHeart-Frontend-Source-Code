import type { StyleRule } from '@vanilla-extract/css';
import { isNonNullish } from 'remeda';

import type { ThemeColorOrAnyColor } from './themes/default/theme-tokens.js';

export const BreakpointNames = {
  Mobile: 'mobile',
  Tablet: 'tablet',
  Desktop: 'desktop',
  XSmall: 'xsmall',
  Small: 'small',
  Shmedium: 'shmedium',
  Medium: 'medium',
  Large: 'large',
  XLarge: 'xlarge',
  XXLarge: 'xxlarge',
} as const;

export const breakpointSizes = {
  [BreakpointNames.Tablet]: 768,
  [BreakpointNames.Desktop]: 1024,

  [BreakpointNames.XSmall]: 320,
  [BreakpointNames.Small]: 421,
  [BreakpointNames.Shmedium]: 560,
  [BreakpointNames.Medium]: 769,
  [BreakpointNames.Large]: 1025,
  [BreakpointNames.XLarge]: 1367,
  [BreakpointNames.XXLarge]: 1600,
} as const;

export function containerMediaBreakpoint<N extends number>(
  n: N,
): `(min-width: ${N}px)` {
  return `(min-width: ${n}px)`;
}

export function mediaBreakpoint<N extends number>(
  n: N,
): `screen and (min-width: ${N}px)` {
  return `screen and (min-width: ${n}px)`;
}

export function maxMediaBreakpoint<N extends number>(
  n: N,
): `screen and (max-width: ${N}px)` {
  return `screen and (max-width: ${n}px)`;
}

export function prefersReducedMotion(styles: StyleRule) {
  return {
    '(prefers-reduced-motion)': styles,
  };
}

export const breakpoints = {
  [BreakpointNames.Mobile]: mediaBreakpoint(0),
  [BreakpointNames.Tablet]: mediaBreakpoint(breakpointSizes.tablet),
  [BreakpointNames.Desktop]: mediaBreakpoint(breakpointSizes.desktop),

  [BreakpointNames.XSmall]: mediaBreakpoint(breakpointSizes.xsmall),
  [BreakpointNames.Small]: mediaBreakpoint(breakpointSizes.small),
  [BreakpointNames.Shmedium]: mediaBreakpoint(breakpointSizes.shmedium),
  [BreakpointNames.Medium]: mediaBreakpoint(breakpointSizes.medium),
  [BreakpointNames.Large]: mediaBreakpoint(breakpointSizes.large),
  [BreakpointNames.XLarge]: mediaBreakpoint(breakpointSizes.xlarge),
  [BreakpointNames.XXLarge]: mediaBreakpoint(breakpointSizes.xxlarge),
} as const;

export const maxBreakpoints = {
  [BreakpointNames.Tablet]: maxMediaBreakpoint(breakpointSizes.tablet),
  [BreakpointNames.Desktop]: maxMediaBreakpoint(breakpointSizes.desktop),

  [BreakpointNames.XSmall]: maxMediaBreakpoint(breakpointSizes.xsmall),
  [BreakpointNames.Small]: maxMediaBreakpoint(breakpointSizes.small),
  [BreakpointNames.Shmedium]: maxMediaBreakpoint(breakpointSizes.shmedium),
  [BreakpointNames.Medium]: maxMediaBreakpoint(breakpointSizes.medium),
  [BreakpointNames.Large]: maxMediaBreakpoint(breakpointSizes.large),
  [BreakpointNames.XLarge]: maxMediaBreakpoint(breakpointSizes.xlarge),
  [BreakpointNames.XXLarge]: maxMediaBreakpoint(breakpointSizes.xxlarge),
} as const;

export const containerBreakPoints = {
  [BreakpointNames.Tablet]: containerMediaBreakpoint(breakpointSizes.tablet),
  [BreakpointNames.Desktop]: containerMediaBreakpoint(breakpointSizes.desktop),

  [BreakpointNames.XSmall]: containerMediaBreakpoint(breakpointSizes.xsmall),
  [BreakpointNames.Small]: containerMediaBreakpoint(breakpointSizes.small),
  [BreakpointNames.Shmedium]: containerMediaBreakpoint(
    breakpointSizes.shmedium,
  ),
  [BreakpointNames.Medium]: containerMediaBreakpoint(breakpointSizes.medium),
  [BreakpointNames.Large]: containerMediaBreakpoint(breakpointSizes.large),
  [BreakpointNames.XLarge]: containerMediaBreakpoint(breakpointSizes.xlarge),
} as const;

/**
 * Define both light and dark colors for a given CSS property without having to specify a selector or media query.
 *
 * Only works for `light` and `dark` modes. It does not work with any other values such as custom theme names.
 *
 * @example
 *  Calling this:
 * ```ts
 * style({
 *   backgroundColor: mode('blue', 'red')
 * })
 * ```
 * Results in the following CSS:
 * ```css
 * .someClass {
 *   backgroundColor: light-dark(blue, red);
 * }
 * ```
 */
export const lightDark = <
  LC extends ThemeColorOrAnyColor,
  DC extends ThemeColorOrAnyColor,
>(
  lightColor: LC,
  darkColor: DC,
) => `light-dark(${lightColor}, ${darkColor})` as const;

export const isTouchDevice = () => {
  return (
    isNonNullish(globalThis.window) &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
};
