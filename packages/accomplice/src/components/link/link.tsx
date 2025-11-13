import { clsx } from 'clsx/lite';
import type { Ref } from 'react';
import type { LinkProps as RACLinkProps } from 'react-aria-components';
import { Link as RACLink } from 'react-aria-components';
import { omit, pick } from 'remeda';

import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { type LinkVariants, linkStyles } from './link.css.js';

export type LinkProps = LinkVariants &
  RACLinkProps & {
    ref?: Ref<HTMLAnchorElement>;
    css?: RainbowSprinkles;
  };

const variants = linkStyles.variants();

export function Link(props: LinkProps) {
  const { children, css, className, style, slot, ref, ...restProps } = props;

  const variantProps = pick(restProps, variants);
  const otherProps = omit(restProps, variants);

  // If there's no `css` prop passed, we don't need to run `rainbowSprinkles()`
  const rs = css ? rainbowSprinkles(css) : undefined;

  return (
    <RACLink
      data-test="link"
      {...otherProps}
      className={clsx(linkStyles(variantProps), rs?.className, className)}
      ref={ref}
      slot={slot || undefined}
      style={{ ...rs?.style, ...style }}
    >
      {children}
    </RACLink>
  );
}
