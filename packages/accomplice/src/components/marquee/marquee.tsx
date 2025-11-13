import { clsx } from 'clsx/lite';
import type { ReactNode } from 'react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { isFunction } from 'remeda';

import { slide } from '../../animation.css.js';
import { usePrefersReducedMotion } from '../../hooks/use-prefers-reduced-motion.js';
import { rainbowSprinkles } from '../../rainbow-sprinkles.css.js';
import { type Sprinkles, sprinkles } from '../../sprinkles.css.js';
import { joinClassnames } from '../../utilities/internal.js';
import { marqueeAnimationStyles, marqueeRootRecipe } from './marquee.css.js';

export interface MarqueeProps {
  auto?: boolean;
  children: ReactNode;
  delay?: number;
  duration?: number;
  gap?: Sprinkles['gap'];
}

/**
 * @link Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/marquee_role
 *
 * @remarks The {@link Marquee \<Marquee \/\>} component is used to animate text that
 * is too long for the container in which it placed. There are two ways in which it can be used:
 *   1. If `auto` is set to true, then the animation will kick in automatically if the text is too
 *      long.
 *   2. If `auto` is set to false, and the user hovers over the text, it will begin to animate - it
 *      will stop once the user stops hovering over the text.
 * In both cases, the animation will not take place if the text doesn't overflow outside of its
 * container.
 *
 * @props
 *
 * {@link MarqueeProps.auto MarqueeProps.auto} When this is set to true, the animation will play
 * infinitely if the text overflows outside of the container.
 *
 * {@link MarqueeProps.children MarqueeProps.children} This is the text string you would like to
 * pass into the marquee. If the text overflows outside of the bounds of the container, then it is
 * animatable; otherwise, it will appear as static text.
 *
 * {@link MarqueeProps.delay delay} This is the amount of time it takes before the animation begins.
 *
 * {@link MarqueeProps.duration MarqueeProps.duration} This can be thought of as the minimum
 * duration an animation cycle could take in seconds. The duration of the animation is adjusted
 * based on the content container width in concert with this value.
 *
 * {@link MarqueeProps["gap"] MarqueeProps.gap} This is the gap between content after each animation
 * cycle.
 *
 * @example
 *
 * ```tsx
 * <Marquee auto duration={10} gap="64">
 *   This is a really really really really really really really really long string of text.
 * </Marquee>
 * ```
 */

export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(
  function Marquee(
    { auto = false, children, delay = 0, duration = 5, gap = '48', ...props },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [animate, setAnimate] = useState({
      duration,
      ready: auto,
    });

    const prefersReducedMotion = usePrefersReducedMotion();

    const endAnimation = useCallback(() => {
      setAnimate(state => ({ ...state, ready: false }));
    }, []);

    const shouldAnimate = useCallback(() => {
      const container = ((!isFunction(ref) && ref?.current) ||
        containerRef.current) as HTMLDivElement;

      const content = contentRef.current;

      if (!container) return;

      const scrollWidth = content?.scrollWidth ?? container.scrollWidth;

      if (container.clientWidth >= scrollWidth) {
        endAnimation();
        return;
      }

      setAnimate(state => ({
        ...state,
        duration: Math.round((scrollWidth / container.clientWidth) * duration),
        ready: true,
      }));
    }, [duration, endAnimation, ref]);

    useEffect(() => {
      if (!auto && !prefersReducedMotion) return;

      endAnimation();
    }, [prefersReducedMotion, auto, children, endAnimation]);

    useEffect(() => {
      if (!auto || prefersReducedMotion) return () => {};

      const observer = new ResizeObserver(shouldAnimate);

      const observable = ((!isFunction(ref) && ref?.current) ||
        containerRef.current) as HTMLDivElement;

      observer.observe(observable);

      return () => observer.disconnect();
    }, [prefersReducedMotion, auto, children, duration, ref, shouldAnimate]);

    const ready = animate.ready && !prefersReducedMotion;
    const { className: animationClass, style } = rainbowSprinkles({
      animation: `${slide} linear infinite`,
      animationDelay: `${delay}s`,
      animationDuration: `${animate.duration}s`,
    });

    return (
      <div
        {...props}
        className={clsx(marqueeRootRecipe({ ready }))}
        onMouseEnter={auto || prefersReducedMotion ? undefined : shouldAnimate}
        onMouseLeave={auto || prefersReducedMotion ? undefined : endAnimation}
        ref={ref ?? containerRef}
      >
        {ready ?
          <div
            className={joinClassnames([marqueeAnimationStyles, animationClass])}
            data-test="marquee-container"
            style={style}
          >
            <div ref={contentRef}>{children}</div>
            <div className={sprinkles({ paddingX: gap })}>{children}</div>
          </div>
        : <>{children}</>}
      </div>
    );
  },
);
