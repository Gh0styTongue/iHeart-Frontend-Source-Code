import { clsx } from 'clsx/lite';
import type { ForwardedRef, ReactElement, ReactNode } from 'react';
import { forwardRef } from 'react';
import type {
  DialogProps,
  DialogTriggerProps,
  PopoverProps as PrimitiveProps,
} from 'react-aria-components';
import {
  Dialog,
  DialogTrigger,
  Heading,
  OverlayArrow,
  Popover as Primitive,
  Text,
} from 'react-aria-components';

import { lightDark } from '#src/media.js';
import { vars } from '#src/theme-contract.css.js';

import type { PopoverVariants } from './popover.css.js';
import {
  dialogStyles,
  overlayArrowStyles,
  popoverRecipe,
  textStyles,
  titleStyles,
} from './popover.css.js';

export type PopoverProps = Omit<PrimitiveProps, 'children' | 'trigger'> &
  PopoverVariants & {
    backgroundColor?: keyof typeof vars.color;
    children: DialogProps['children'];
    defaultOpen?: DialogTriggerProps['defaultOpen'];
    fixed?: boolean;
    name?: string;
    textColor?: keyof typeof vars.color;
    trigger?: ReactElement;
  };

export function PopoverTitle({ children }: { children: ReactNode }) {
  return (
    <Heading className={titleStyles} data-test="popover-title" slot="title">
      {children}
    </Heading>
  );
}

export function PopoverText({ children }: { children: ReactNode }) {
  return (
    <Text className={textStyles} data-test="popover-text">
      {children}
    </Text>
  );
}

function Popover(
  {
    children,
    defaultOpen,
    fixed = false,
    isOpen,
    name,
    placement,
    shouldFlip,
    trigger,
    onOpenChange,
    style,
    ...props
  }: PopoverProps,
  ref: ForwardedRef<HTMLElement>,
) {
  let popoverStyles = {} as React.CSSProperties;

  if (typeof style === 'object' && style !== null) {
    popoverStyles = style;
  }

  return (
    <DialogTrigger
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {trigger}
      <Primitive
        className={clsx(popoverRecipe({ fixed, placement }))}
        data-test={`popover${name ? `-${name}` : ''}`}
        placement={placement}
        shouldFlip={shouldFlip}
        style={{
          ...popoverStyles,
          backgroundColor:
            popoverStyles.backgroundColor ??
            lightDark(vars.color.gray600, vars.color.brandWhite),
          color:
            popoverStyles.color ??
            lightDark(vars.color.brandWhite, vars.color.gray600),
        }}
        {...props}
      >
        <OverlayArrow
          data-test="popover-arrow"
          style={{
            fill:
              popoverStyles.backgroundColor ??
              lightDark(vars.color.gray600, vars.color.brandWhite),
            stroke:
              popoverStyles.backgroundColor ??
              lightDark(vars.color.gray600, vars.color.brandWhite),
          }}
        >
          <svg className={overlayArrowStyles}>
            <path d="M0 0 L8 8 L16 0" />
          </svg>
        </OverlayArrow>
        <Dialog className={dialogStyles} data-test="popover-content" ref={ref}>
          {children}
        </Dialog>
      </Primitive>
    </DialogTrigger>
  );
}
const _Popover = forwardRef(Popover);

export { _Popover as Popover };
