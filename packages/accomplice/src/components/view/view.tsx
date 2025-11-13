import { clsx } from 'clsx/lite';
import type { CSSProperties, JSXElementConstructor, ReactNode } from 'react';
import { isPlainObject, mapValues } from 'remeda';
import type { Schema } from 'type-fest';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import type { ElementProps } from '../../types.js';

export interface ViewProps extends ElementProps<'div'> {
  children?: ReactNode;
  className?: string;
  display?: RainbowSprinkles['display'];
  elementType?: string | JSXElementConstructor<any>;
  gridArea?: RainbowSprinkles['gridArea'];
  isHidden?: Schema<RainbowSprinkles['display'], boolean>;
  style?: CSSProperties;
}

export function View(props: ViewProps) {
  const {
    children,
    className,
    isHidden,
    display = 'block',
    elementType: ElementType = 'div',
    style,
    gridArea,
    ...otherProps
  } = props;

  const rs = rainbowSprinkles({
    gridArea,
    display:
      isPlainObject(isHidden) ?
        mapValues(isHidden, (shouldHide, key) =>
          shouldHide ? 'none'
          : isPlainObject(display) ? display[key]
          : display,
        )
      : isHidden ? 'none'
      : display,
  });

  return (
    <ElementType
      {...otherProps}
      className={clsx(rs.className, className)}
      style={{ ...rs.style, ...style }}
    >
      {children}
    </ElementType>
  );
}
