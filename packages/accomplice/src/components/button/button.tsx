import { Loading } from '@iheartradio/web.accomplice/icons/loading';
import { filterDOMProps } from '@react-aria/utils';
import type { LinkDOMProps } from '@react-types/shared';
import { clsx } from 'clsx/lite';
import {
  type ForwardedRef,
  type PropsWithChildren,
  type ReactNode,
  forwardRef,
} from 'react';
import {
  type AriaButtonProps,
  type HoverProps,
  mergeProps,
  useButton,
  useFocusRing,
  useHover,
  useLink,
} from 'react-aria';
import {
  type ButtonProps as RACButtonProps,
  ButtonContext,
  useContextProps,
} from 'react-aria-components';
import { isNonNullish } from 'remeda';

import { useMapMediaProp } from '../../hooks/use-mapmedia-prop.js';
import {
  type RainbowSprinkles,
  rainbowSprinkles,
} from '../../rainbow-sprinkles.css.js';
import { vars } from '../../theme-contract.css.js';
import type { DOMAttributes } from '../../types.js';
import type { MediaValue } from '../../types/index.js';
import type { ThemeVariant } from '../../utilities/internal.js';
import { Box } from '../box/index.js';
import {
  type ButtonVariants,
  buttonRecipe,
  hideOutlineOnFocusStyle,
} from './button.css.js';
import { type Size, sizes } from './size.js';

const additionalButtonHTMLAttributes = new Set([
  'form',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',
  'name',
  'value',
]);

interface ButtonContextValue extends RACButtonProps {
  isPressed?: boolean;
}

export type ButtonProps = Omit<ButtonVariants, 'color'> &
  DOMAttributes &
  LinkDOMProps &
  AriaButtonProps &
  HoverProps & {
    color?: ButtonVariants['color'];
    continuePropagation?: boolean;
    css?: RainbowSprinkles;
    hideOutlineOnFocus?: boolean;
    isPending?: boolean;
    loader?: ReactNode;
    size?: Size | MediaValue<Size>;
    textColor?: ThemeVariant<NonNullable<RainbowSprinkles['color']>>;
    title?: string;
  };

function Button(
  props: PropsWithChildren<ButtonProps>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  [props, ref] = useContextProps(props, ref, ButtonContext);
  props = disablePendingProps(props);
  const ctx = props as ButtonContextValue;

  const {
    children,
    className,
    color = 'red',
    css,
    elementType,
    hideOutlineOnFocus,
    inline,
    inverted = false,
    isDisabled,
    isPending,
    kind = 'primary',
    loader,
    size = 'small',
    textColor,
    ...restProps
  } = props;

  if (isNonNullish(props.onClick) && isNonNullish(props.onPress)) {
    throw new Error(
      'The web.accomplice Button accepts either native events (onClick, onKeyDown, onPointerDown, etc.) or RAC events (onPress, etc.), not both.',
    );
  }

  const ElementType = elementType ?? (props?.href ? 'a' : 'button');

  const { buttonProps, isPressed } = useButton(
    {
      ...props,
      elementType: ElementType,
      preventFocusOnPress: true,
    },
    ref,
  );
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);
  const { isHovered, hoverProps } = useHover({
    ...props,
    isDisabled: isDisabled || isPending,
  });

  const { linkProps, isPressed: linkIsPressed } = useLink(
    {
      ...props,
      elementType: props.href && !isDisabled ? 'a' : 'span',
    },
    ref,
  );

  const sizeCSS = useMapMediaProp(
    size,
    (value: keyof typeof sizes) => sizes[value],
  );

  const rs = rainbowSprinkles({ ...sizeCSS, ...css });
  const isLink = ElementType === 'a';

  const classNames = clsx(
    buttonRecipe({
      inline,
      inverted,
      color,
      kind,
    }),
    rs?.className,
    className,
    hideOutlineOnFocus && hideOutlineOnFocusStyle,
  );

  const styles = {
    ...rs.style,
    color: textColor,
  };

  const loaderContent = loader ?? <Loading stroke="currentcolor" />;

  return (
    <ElementType
      {...(ElementType === 'button' ?
        filterDOMProps(props, { propNames: additionalButtonHTMLAttributes })
      : {})}
      {...mergeProps(isLink ? linkProps : buttonProps, focusProps, hoverProps)}
      aria-disabled={isPending ? 'true' : buttonProps['aria-disabled']}
      className={classNames}
      data-color={color}
      data-disabled={isDisabled || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-focused={isFocused || undefined}
      data-hovered={isHovered || undefined}
      data-pending={isPending || undefined}
      data-pressed={
        ((ctx.isPressed || isPressed || linkIsPressed) && !isPending) ||
        undefined
      }
      data-text-color={textColor}
      href={restProps?.href}
      ref={ref}
      role={restProps?.href ? 'link' : 'button'}
      style={styles}
      type={
        buttonProps.type === 'submit' && isPending ? 'button' : buttonProps.type
      }
    >
      {children}
      {isPending ?
        size === 'icon' ?
          <Box
            asChild
            height="100%"
            left="0"
            pointerEvents="none"
            position="absolute"
            top="0"
            width="100%"
            zIndex={vars.zIndex[1]}
          >
            {loaderContent}
          </Box>
        : <Box
            alignItems="center"
            asChild
            display="flex"
            height="100%"
            justifyContent="center"
            position="absolute"
            width="100%"
          >
            <span
              style={{
                background: 'inherit',
                backgroundColor: 'inherit',
                borderRadius: 'inherit',
              }}
            >
              {loaderContent}
            </span>
          </Box>

      : null}
    </ElementType>
  );
}

export const _Button = forwardRef(Button);
export { _Button as Button };

function disablePendingProps(props: ButtonProps) {
  // Don't allow interaction while isPending is true
  if (props.isPending) {
    props.onPress = undefined;
    props.onPressStart = undefined;
    props.onPressEnd = undefined;
    props.onPressChange = undefined;
    props.onPressUp = undefined;
    props.onKeyDown = undefined;
    props.onKeyUp = undefined;
    props.onClick = undefined;
    props.href = undefined;
  }
  return props;
}
