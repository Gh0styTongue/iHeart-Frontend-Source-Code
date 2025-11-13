import { clsx } from 'clsx/lite';
import type { PropsWithChildren, Ref } from 'react';
import { omit, pick } from 'remeda';

import type { RainbowSprinkles } from '#src/rainbow-sprinkles.css.js';
import { rainbowSprinkles } from '#src/rainbow-sprinkles.css.js';
import type { ElementProps } from '#src/types.js';

import { type LogoFill, type LogoSizes, logoRecipe } from './logo.css.js';

export type LogoProps = PropsWithChildren<{
  'aria-label'?: string;
  css?: RainbowSprinkles;
  id?: string;
  fill?: LogoFill;
  size?: LogoSizes;
  media?: string;
  ref?: Ref<SVGSVGElement>;
  mode?: 'light' | 'dark';
}> &
  ElementProps<'svg'>;

const logoVariants = logoRecipe.variants();

export function Logo({
  'aria-label': ariaLabel,
  children,
  css,
  id,
  ref,
  ...props
}: LogoProps) {
  const variantProps = pick(props, logoVariants);
  const otherProps = omit(props, logoVariants);
  const rs = rainbowSprinkles({ width: 'auto', ...css });
  const className = clsx(logoRecipe(variantProps), rs.className);

  return (
    <svg
      aria-labelledby={id}
      className={className}
      ref={ref}
      role="img"
      style={rs.style}
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <title id={id}>{ariaLabel}</title>
      {children}
    </svg>
  );
}
