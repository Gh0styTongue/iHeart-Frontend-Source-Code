import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx/lite';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import type { ElementProps } from '../../types.js';
import { containerStyle } from './box.css.js';

type DOMProps = Omit<ElementProps<'div'>, 'color'>;

export interface BoxProps extends DOMProps, RainbowSprinkles {
  asChild?: boolean | undefined;
}

export function Box({ asChild, children, ref, ...props }: BoxProps) {
  const Component = asChild ? Slot : 'div';
  const { className, style, otherProps } = rainbowSprinkles(props);

  return (
    <Component
      className={clsx(className, containerStyle)}
      ref={ref}
      style={style}
      {...otherProps}
    >
      {children}
    </Component>
  );
}
