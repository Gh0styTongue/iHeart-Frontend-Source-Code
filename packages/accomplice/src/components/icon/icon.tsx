import { clsx } from 'clsx/lite';
import { type CSSProperties, type ReactElement, cloneElement } from 'react';
import { mapValues } from 'remeda';

import {
  type RainbowSprinkles,
  type ResponsiveConditions,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import type { ElementProps } from '../../types.js';
import { iconStyles } from './icon.css.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sizes = [
  10, 12, 16, 18, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 72, 88, 96, 124, 164,
  222, 736,
] as const;

type IconSize = (typeof sizes)[number];
type IconSizeConditions = {
  [Key in keyof ResponsiveConditions]?: IconSize;
};

export type IconProps = Omit<ElementProps<'svg'>, 'color'> & {
  /**
   * A screen reader only label for the Icon.
   */
  'aria-label'?: string;
  /**
   * The content to display. Should be an SVG.
   */
  children: ReactElement<any>;

  css?: RainbowSprinkles;

  /**
   * The fill color of the icon. If omitted, the fill color will be inherited from a parent's `color`.
   */
  color?: RainbowSprinkles['color'];

  /**
   * The size of the icon in `px`.
   * @default 24
   */
  size?: IconSize | IconSizeConditions;
  /**
   * A slot to place the icon in.
   * @default 'icon'
   */
  slot?: string;
  /**
   * Indicates whether the element is exposed to an accessibility API.
   */
  'aria-hidden'?: boolean | 'false' | 'true';

  style?: CSSProperties;
};

export function Icon(props: IconProps) {
  const {
    children,
    css,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHidden,
    size = 24,
    color,
    ...restProps
  } = props;

  const pxSize =
    typeof size === 'number' ?
      `${size}px`
    : mapValues(size, value => `${value}px` as const);

  const rs = rainbowSprinkles({
    ...css,
    color: color ?? 'inherit',
    fill: 'currentColor',
    height: pxSize,
    blockSize: pxSize,
    inlineSize: pxSize,
  });

  const className = clsx(iconStyles, rs.className, props.className);

  return cloneElement(children, {
    ...restProps,
    focusable: 'false',
    'aria-label': ariaLabel,
    'aria-hidden': ariaLabel ? ariaHidden || undefined : true,
    role: 'img',
    className,
    style: { ...rs.style, ...props.style },
  });
}
