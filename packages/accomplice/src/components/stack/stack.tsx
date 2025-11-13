import type { ReactNode } from 'react';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { sprinkles } from '../../sprinkles.css.js';
import type { ElementProps } from '../../types.js';
import { joinClassnames } from '../../utilities/internal.js';

export interface StackProps extends ElementProps<'div'> {
  children?: ReactNode;

  css?: RainbowSprinkles;

  align?: RainbowSprinkles['alignItems'];
  gap?: RainbowSprinkles['gap'];
  /** @default false */
  inline?: boolean;
  justify?: RainbowSprinkles['justifyContent'];
}

export function Stack({ children, css, ...props }: StackProps) {
  const {
    inline = false,
    align: alignItems,
    gap,
    justify: justifyContent,
    ...restProps
  } = props;

  const { className, style } = rainbowSprinkles({
    alignItems,
    gap,
    justifyContent,
    ...css,
  });

  return (
    <div
      className={joinClassnames([
        sprinkles({
          display: inline ? 'inline-flex' : 'flex',
          flexDirection: 'column',
        }),
        className,
      ])}
      style={style}
      {...restProps}
    >
      {children}
    </div>
  );
}
