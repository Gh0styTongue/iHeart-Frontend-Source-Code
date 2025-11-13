import { clsx } from 'clsx/lite';
import type {
  MenuItemProps as RACMenuItemProps,
  MenuProps as RACMenuProps,
  PopoverProps,
  SeparatorProps as RACSeparatorProps,
} from 'react-aria-components';
import {
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  Popover,
  Separator as RACSeparator,
} from 'react-aria-components';
import { isFunction } from 'remeda';

import { ChevronRight } from '../../icons/chevron-right.js';
import { lightDark } from '../../media.js';
import { rainbowSprinkles } from '../../rainbow-sprinkles.css.js';
import { vars } from '../../theme-contract.css.js';
import { preventDefaultTouchCallbackRef } from '../../utilities/touch.js';
import { Flex } from '../flex/index.js';
import { Text } from '../text/index.js';
import { menuContentStyles, menuItemStyles } from './menu.css.js';

export type {
  MenuTriggerProps,
  SubmenuTriggerProps,
} from 'react-aria-components';
export {
  Popover as MenuPopover,
  MenuTrigger,
  SubmenuTrigger,
} from 'react-aria-components';

export type MenuProps<T> = RACMenuProps<T>;
export function Menu<T extends object>({
  className,
  ...props
}: RACMenuProps<T>) {
  return (
    <RACMenu<T> {...props} className={clsx(menuContentStyles, className)} />
  );
}

export interface MenuContentProps<T>
  extends RACMenuProps<T>,
    Pick<PopoverProps, 'isOpen' | 'onOpenChange' | 'placement' | 'scrollRef'> {}
export function MenuContent<T extends object>({
  isOpen,
  onOpenChange,
  placement,
  scrollRef,
  ...props
}: MenuContentProps<T>) {
  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement={placement}
      scrollRef={scrollRef}
    >
      <Menu<T> {...props} />
    </Popover>
  );
}

export interface SubmenuContentProps<T>
  extends RACMenuProps<T>,
    Pick<PopoverProps, 'isOpen' | 'onOpenChange' | 'placement' | 'scrollRef'> {}
export function SubmenuContent<T extends object>({
  isOpen,
  onOpenChange,
  placement,
  scrollRef,
  ...props
}: SubmenuContentProps<T>) {
  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement={placement}
      scrollRef={scrollRef}
    >
      <Menu<T> {...props} />
    </Popover>
  );
}

export interface MenuItemProps extends RACMenuItemProps {
  // This prop is supported by the MenuItem it seems but is not included in the types for some reason
  closeOnSelect?: boolean;
}

export function MenuItem({ className, ...props }: MenuItemProps) {
  const textValue =
    props.textValue ||
    (typeof props.children === 'string' ? props.children : undefined);

  return (
    <RACMenuItem
      data-test="menu-item"
      {...props}
      className={clsx(menuItemStyles, className)}
      textValue={textValue}
    >
      {renderProps => {
        if (isFunction(props.children)) {
          return props.children(renderProps);
        }

        const { hasSubmenu } = renderProps;

        return (
          <Text
            as="div"
            css={{ width: '100%', display: 'flex', alignItems: 'center' }}
            kind={{ mobile: 'body-4', large: 'body-3' }}
            lines={1}
            ref={preventDefaultTouchCallbackRef()}
          >
            <Flex alignItems="center" gap="$8" width="100%">
              {props.children}
              {hasSubmenu ?
                <ChevronRight
                  style={{
                    maxHeight: '18px',
                    maxWidth: '18px',
                    marginLeft: 'auto',
                    justifySelf: 'end',
                  }}
                />
              : null}
            </Flex>
          </Text>
        );
      }}
    </RACMenuItem>
  );
}

export function MenuSeparator({
  className,
  style,
  ...props
}: RACSeparatorProps) {
  const baseStyles = rainbowSprinkles({
    backgroundColor: lightDark(vars.color.gray150, vars.color.gray500),
    height: '0.1rem',
    width: '100%',
  });

  return (
    <RACSeparator
      className={clsx(baseStyles.className, className)}
      style={{ ...baseStyles.style, ...style }}
      {...props}
    />
  );
}
