import {
  type ComponentProps,
  type ForwardedRef,
  type PropsWithChildren,
  forwardRef,
} from 'react';

import { homeAdStyles } from './home-ad.css.js';

export type HomeAdProps = PropsWithChildren<ComponentProps<'div'>> & {
  hasAdvert?: boolean;
};

function _HomeAdContainer(
  { children, hasAdvert = false, ...props }: HomeAdProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      className={homeAdStyles}
      data-has-advert={hasAdvert}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
}

export const HomeAdContainer = forwardRef(_HomeAdContainer);
