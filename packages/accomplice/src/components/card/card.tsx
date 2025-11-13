/* eslint-disable prefer-const */

import { type SlotProps, Slot } from '@radix-ui/react-slot';
import {
  filterDOMProps,
  useRouter,
  useSyntheticLinkProps,
} from '@react-aria/utils';
import type { LinkDOMProps } from '@react-types/shared';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { clsx } from 'clsx/lite';
import {
  type ForwardedRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useRef,
} from 'react';
import {
  type FocusVisibleProps,
  type FocusWithinProps,
  type HoverProps,
  type PressProps,
  mergeProps,
  useFocusRing,
  useHover,
  usePress,
} from 'react-aria';
import { isFunction, isNonNullish, omit, pick } from 'remeda';

import type { ElementProps, ValueOrBreakpointObject } from '../../types.js';
import {
  getResponsiveVar,
  variantsToDataAttrs,
} from '../../utilities/internal.js';
import { type ImageProps, Image } from '../image/index.js';
import {
  type CardPreviewVariants,
  type CardVariantProps,
  cardBodyStyles,
  cardPreviewOverlayButtonContainerStyles,
  cardPreviewOverlayStyles,
  cardPreviewRecipe,
  cardRecipe,
  cardSubtitleStyles,
  cardTitleStyles,
  DEFAULT_CARD_ORIENTATION,
  linesVarMap,
} from './card.css.js';

export type LinesToShowProp = Partial<ValueOrBreakpointObject<1 | 2 | 3>>;

type CardContextProps = {
  isHovered: boolean;
  isActive: boolean;
  orientation: 'vertical' | 'horizontal';
  isFocused: boolean;
};

const CardContext = createContext<CardContextProps | null>(null);

function useCardContext() {
  const context = useContext(CardContext);

  if (!context) {
    throw new Error(`useCardContext() must be used within a <Card />`);
  }

  return context;
}

export type CardProps = ElementProps<'div', 'title'> &
  LinkDOMProps &
  PressProps &
  HoverProps &
  FocusVisibleProps &
  FocusWithinProps &
  CardVariantProps & {
    children?: ReactNode;
    /** @default false */
    isActive?: boolean | undefined;
    isHovered?: boolean | undefined;
    isFocused?: boolean | undefined;
    'data-test'?: string;
    onNavigation?: () => void;
  };
export function Card(props: CardProps) {
  let {
    children,
    className,
    isActive = false,
    isFocused: _isFocused,
    isHovered: _isHovered,
    isPressed: _isPressed,
    onClick: deprecatedOnClick,
    'data-test': dataTest,
    routerOptions,
    href,
    onNavigation,
    ...otherProps
  } = props;

  const ref = useRef(null);
  const variantProps = pick(otherProps, cardRecipe.variants());
  otherProps = omit(otherProps, cardRecipe.variants());

  const router = useRouter();
  const syntheticLinkProps = useSyntheticLinkProps(props);
  const { isHovered, hoverProps } = useHover(otherProps);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    within: true,
  });

  const { isPressed, pressProps } = usePress({
    ...otherProps,
    ref,
    onPress: event => {
      otherProps?.onPress?.(event);

      if (ref.current && href) {
        onNavigation?.();
        router.open(ref.current, event, href, routerOptions);
      }
    },
  });

  const DOMProps = filterDOMProps(otherProps);
  const orientation = variantProps.orientation ?? DEFAULT_CARD_ORIENTATION;

  const contextValue = useMemo(() => {
    return {
      isActive,
      isFocused: _isFocused ?? isFocused,
      isHovered: _isHovered ?? isHovered,
      orientation,
    };
  }, [_isHovered, isHovered, isActive, _isFocused, orientation, isFocused]);

  const allProps = mergeProps(
    syntheticLinkProps,
    pressProps,
    hoverProps,
    focusProps,
    {
      onClick: (e: MouseEvent<HTMLDivElement>) => {
        if (deprecatedOnClick) {
          deprecatedOnClick(e);
          console.warn('onClick is deprecated, please use onPress');
        }
      },
    },
  );

  return (
    <CardContext.Provider value={contextValue}>
      <article
        {...DOMProps}
        {...allProps}
        {...variantsToDataAttrs(variantProps)}
        className={clsx(cardRecipe(variantProps), className)}
        data-active={isActive || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-focus-within={isFocused || undefined}
        data-focused={_isFocused || isFocused || undefined}
        data-hovered={_isHovered || isHovered || undefined}
        data-orientation={orientation}
        data-pressed={_isPressed || isPressed || undefined}
        data-test={dataTest}
        ref={ref}
        role={isNonNullish(href) ? 'link' : undefined}
      >
        {children}
      </article>
    </CardContext.Provider>
  );
}

export type CardAnchorProps = SlotProps & {
  asChild?: boolean | undefined;
  href?: HTMLAnchorElement['href'];
};
export function CardAnchor({ asChild, href, ...props }: CardAnchorProps) {
  const Component = asChild ? Slot : 'a';
  return <Component href={href} {...props} />;
}

export type CardBodyProps = ElementProps<'article'> & {
  asChild?: boolean | undefined;
};
export const CardBody = forwardRef(function CardBody(
  props: CardBodyProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { className, ...otherProps } = props;
  const { orientation } = useCardContext();

  return (
    <div
      {...otherProps}
      className={clsx(cardBodyStyles, className)}
      data-orientation={orientation}
      ref={ref}
    />
  );
});

export type CardTitleProps = ElementProps<'h4'> & {
  asChild?: boolean;
  lines?: LinesToShowProp;
};
export const CardTitle = forwardRef(function CardTitle(
  { asChild, className, lines, ...props }: CardTitleProps,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  const Component = asChild ? Slot : 'h4';
  const linesVars = getResponsiveVar(lines, linesVarMap);

  return (
    <Component
      className={clsx(cardTitleStyles, className)}
      {...props}
      ref={ref}
      slot="title"
      style={assignInlineVars({ ...linesVars })}
    />
  );
});

export type CardSubtitleProps = ElementProps<'p'> & {
  asChild?: boolean;
  lines?: LinesToShowProp;
};
export const CardSubtitle = forwardRef(function CardSubtitle(
  { asChild, className, lines, ...props }: CardSubtitleProps,
  ref: ForwardedRef<HTMLParagraphElement>,
) {
  const Component = asChild ? Slot : 'p';
  const linesVars = getResponsiveVar(lines, linesVarMap);

  return (
    <Component
      className={clsx(cardSubtitleStyles, className)}
      {...props}
      ref={ref}
      slot="description"
      style={assignInlineVars({ ...linesVars })}
    />
  );
});

export type CardPreviewProps = Omit<ElementProps<'div'>, 'children'> &
  CardPreviewVariants & {
    asChild?: boolean | undefined;
    children: ReactNode | ((props: CardContextProps) => ReactElement);
  };

export function CardPreview({
  asChild,
  className,
  children,
  shape,
  ...props
}: CardPreviewProps) {
  const Component = asChild && !isFunction(children) ? Slot : 'div';
  const cardContextValue = useCardContext();
  return (
    <Component
      {...props}
      className={clsx(
        cardPreviewRecipe({ shape, orientation: cardContextValue.orientation }),
        className,
      )}
      data-orientation={cardContextValue.orientation}
    >
      <CardPreviewOverlay />
      {isFunction(children) ? children(cardContextValue) : children}
    </Component>
  );
}

export type CardImageProps = ImageProps;
export function CardImage(props: CardImageProps) {
  return <Image {...props} css={{ gridArea: 'container' }} />;
}

export function CardPreviewOverlay({
  className,
  ...props
}: ElementProps<'div'>) {
  return (
    <div {...props} className={clsx(cardPreviewOverlayStyles, className)} />
  );
}

export type CardPreviewOverlayButtonContainerProps = ElementProps<'div'> & {
  buttonPosition?: 'center' | 'bottomRight';
};
export function CardPreviewOverlayButtonContainer({
  className,
  buttonPosition = 'bottomRight',
  ...props
}: CardPreviewOverlayButtonContainerProps) {
  return (
    <div
      {...props}
      className={clsx(
        cardPreviewOverlayButtonContainerStyles({ buttonPosition }),
        className,
      )}
    />
  );
}
