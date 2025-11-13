import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx/lite';
import type { CSSProperties } from 'react';
import {
  type HoverProps,
  type PressProps,
  useHover,
  usePress,
} from 'react-aria';

import type { ElementProps } from '../../types.js';
import {
  navigationHeaderStyles,
  navigationItemStyles,
  navigationListStyles,
  navigationLogoStyles,
  navigationStyles,
  navigationWrapperStyles,
} from './navigation.css.js';

export function Navigation({ className, ...props }: ElementProps<'nav'>) {
  return (
    <nav
      className={clsx(navigationStyles, className)}
      role="navigation"
      {...props}
    />
  );
}

export function NavigationWrapper({
  className,
  ...props
}: ElementProps<'div'>) {
  return (
    <div
      className={clsx(navigationWrapperStyles, className)}
      data-test="navigation-wrapper"
      {...props}
    />
  );
}

export function NavigationHeader({
  className,
  navProfile,
  ...props
}: ElementProps<'div'> & { navProfile?: boolean; style?: CSSProperties }) {
  return (
    <div
      className={clsx(
        navigationHeaderStyles[navProfile ? 'profile' : 'default'],
        className,
      )}
      data-test="navigation-header"
      {...props}
    />
  );
}

export function NavigationLogo({ className, ...props }: ElementProps<'div'>) {
  return <div className={clsx(navigationLogoStyles, className)} {...props} />;
}

export function NavigationList({ className, ...props }: ElementProps<'div'>) {
  return <div className={clsx(navigationListStyles, className)} {...props} />;
}

export type NavigationItemProps = ElementProps<'div'> & {
  isActive?: boolean;
  asChild?: boolean;
  className?: string;
  onHover?: HoverProps['onHoverStart'];
  onPress?: PressProps['onPress'];
};

export function NavigationItem({
  asChild,
  isActive,
  className,
  onHover,
  onPress,
  ...props
}: NavigationItemProps) {
  const Component = asChild ? Slot : 'div';

  const { hoverProps } = useHover({
    onHoverStart: onHover,
  });

  const { pressProps } = usePress({
    onPress,
  });

  return (
    <Component
      {...hoverProps}
      {...pressProps}
      {...props}
      className={clsx(className, navigationItemStyles)}
      data-active={isActive || undefined}
    />
  );
}
