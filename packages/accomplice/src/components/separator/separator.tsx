import { type ForwardedRef, type PropsWithChildren, forwardRef } from 'react';
import { useSeparator } from 'react-aria';

import { lightDark } from '../../media.js';
import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import type { ElementProps } from '../../types.js';

export interface SeparatorProps
  extends PropsWithChildren<ElementProps<'div'> & RainbowSprinkles> {
  orientation?: 'horizontal' | 'vertical';
}

function Separator(
  {
    backgroundColor,
    children,
    orientation = 'horizontal',
    ...props
  }: SeparatorProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { separatorProps } = useSeparator({
    ...props,
    elementType: 'div',
    orientation,
  });

  const { className, style, otherProps } = rainbowSprinkles({
    ...props,
    backgroundColor: backgroundColor ?? lightDark('$gray150', '$gray500'),
    width: orientation === 'horizontal' ? '100%' : '0.1rem',
    height: orientation === 'horizontal' ? '0.1rem' : '100%',
  });

  return (
    <div
      className={className}
      data-orientation={orientation}
      ref={ref}
      style={style}
      {...separatorProps}
      {...otherProps}
    >
      {children}
    </div>
  );
}

const _Separator = forwardRef(Separator);

export { _Separator as Separator };
