import { type PropsWithChildren, forwardRef } from 'react';
import { useId } from 'react-aria';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import type { ElementProps } from '../../types.js';
export interface SpacerProps extends PropsWithChildren<ElementProps<'div'>> {
  bottom?: RainbowSprinkles['paddingBottom'];
  top?: RainbowSprinkles['paddingTop'];
  left?: RainbowSprinkles['paddingLeft'];
  right?: RainbowSprinkles['paddingRight'];
  x?: RainbowSprinkles['px'];
  y?: RainbowSprinkles['py'];
  p?: RainbowSprinkles['padding'];
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(function Spacer(
  {
    bottom,
    children,
    id: _id,
    left,
    right,
    top,
    x,
    y,
    p,
    ...rest
  }: SpacerProps,
  ref,
) {
  const id = useId();
  const { className, style, otherProps } = rainbowSprinkles({
    paddingBottom: bottom,
    paddingTop: top,
    paddingLeft: left,
    paddingRight: right,
    px: x,
    py: y,
    padding: p,
    ...rest,
  });

  const ariaExpanded = rest['aria-expanded'] ?? false;

  return (
    <div
      aria-expanded={ariaExpanded}
      className={className}
      id={id}
      ref={ref}
      style={style}
      {...rest}
      {...otherProps}
    >
      {children}
    </div>
  );
});
