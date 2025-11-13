import { clsx } from 'clsx/lite';
import type { ReactNode } from 'react';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { sprinkles } from '../../sprinkles.css.js';
import type { ElementProps } from '../../types.js';

export interface GroupProps extends ElementProps<'div'> {
  children?: ReactNode;

  css?: RainbowSprinkles;

  align?: RainbowSprinkles['alignItems'];
  gap?: RainbowSprinkles['gap'];
  grow?: RainbowSprinkles['flexGrow'];
  /** @default false */
  inline?: boolean;
  justify?: RainbowSprinkles['justifyContent'];
  wrap?: RainbowSprinkles['flexWrap'];
}

export function Group({ children, css, ...props }: GroupProps) {
  const {
    align: alignItems,
    gap,
    justify: justifyContent,
    wrap,
    inline = false,
    grow,
    ...restProps
  } = props;

  const { className, style } = rainbowSprinkles({
    alignItems,
    gap,
    justifyContent,
    wrap,
    grow,
    ...css,
  });

  return (
    <div
      className={clsx(
        sprinkles({
          alignSelf: 'stretch',
          display: inline ? 'inline-flex' : 'flex',
          flexDirection: 'row',
        }),
        className,
      )}
      style={style}
      {...restProps}
    >
      {children}
    </div>
  );
}
