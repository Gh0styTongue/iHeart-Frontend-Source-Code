import { clsx } from 'clsx/lite';
import type { ReactNode } from 'react';
import { omit, pick } from 'remeda';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { type BadgeVariants, badgeRecipe } from './badge.css.js';

export type BadgeProps = BadgeVariants & {
  children?: ReactNode;
  css?: RainbowSprinkles;
};

const badgeVariants = badgeRecipe.variants();

/**
 * The Badge component is used to highlight an item's status for quick recognition.
 */
export function Badge({ children, css, ...props }: BadgeProps) {
  const variantProps = pick(props, badgeVariants);
  const otherProps = omit(props, badgeVariants);
  const rs = css ? rainbowSprinkles(css) : undefined;
  const className = clsx(badgeRecipe(variantProps), rs?.className);

  return (
    <div
      className={className}
      data-test="badge"
      style={rs?.style}
      {...otherProps}
    >
      {children}
    </div>
  );
}
