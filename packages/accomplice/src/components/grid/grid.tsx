import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx/lite';
import type { ForwardedRef, PropsWithChildren } from 'react';
import { forwardRef } from 'react';
import { isPlainObject, mapValues } from 'remeda';
import type { Schema } from 'type-fest';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { type Sprinkles, sprinkles } from '../../sprinkles.css.js';
import type { ElementProps } from '../../types.js';

export interface GridProps
  extends PropsWithChildren<
    Omit<ElementProps<'div'>, 'title'> & RainbowSprinkles
  > {
  css?: RainbowSprinkles & { containerType?: Sprinkles['containerType'] };
  // display?: 'grid' | 'inline-grid';
  asChild?: boolean | undefined;
  inline?: boolean;
  isHidden?: Schema<RainbowSprinkles['display'], boolean>;
}

function Grid(
  { asChild, children, css, inline, isHidden, ...props }: GridProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const display = inline ? 'inline-grid' : 'grid';

  const { className, style, otherProps } = rainbowSprinkles({
    ...props,
    ...css,
    display:
      isPlainObject(isHidden) ?
        mapValues(isHidden, value => (value ? 'none' : display))
      : isHidden ? 'none'
      : display,
  });

  // rainbowSprinkles doesn't support containerType, but sprinkles does, so delete before it gets added to the element
  if (otherProps.containerType) {
    delete otherProps.containerType;
  }
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={clsx(
        sprinkles({ containerType: css?.containerType }),
        className,
      )}
      ref={ref}
      style={style}
      {...otherProps}
    >
      {children}
    </Component>
  );
}

export const _Grid = forwardRef<HTMLDivElement, GridProps>(Grid);
export { _Grid as Grid };
