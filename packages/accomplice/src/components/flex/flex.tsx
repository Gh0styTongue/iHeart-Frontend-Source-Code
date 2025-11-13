import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx/lite';
import type { ReactNode, Ref } from 'react';
import { isPlainObject, mapValues } from 'remeda';
import type { Schema } from 'type-fest';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import type { ElementProps } from '../../types.js';
import { containerStyle } from '../box/box.css.js';

export interface FlexProps
  extends Omit<ElementProps<'div'>, 'color'>,
    RainbowSprinkles {
  children?: ReactNode;
  asChild?: boolean | undefined;
  isContainer?: boolean | undefined;
  inline?: boolean;
  isHidden?: Schema<RainbowSprinkles['display'], boolean>;
  ref?: Ref<HTMLDivElement>;
}

export function Flex({
  asChild,
  children,
  className,
  isHidden,
  inline,
  ref,
  ...props
}: FlexProps) {
  const Component = asChild ? Slot : 'div';
  const display = inline ? 'inline-flex' : 'flex';

  const rs = rainbowSprinkles({
    display:
      isPlainObject(isHidden) ?
        mapValues(isHidden, value => (value ? 'none' : display))
      : isHidden ? 'none'
      : display,
    ...props,
  });

  return (
    <Component
      className={clsx(rs.className, className, containerStyle)}
      ref={ref}
      style={rs.style}
      {...rs.otherProps}
    >
      {children}
    </Component>
  );
}
