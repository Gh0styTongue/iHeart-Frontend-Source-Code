import {
  type ComponentType,
  type ReactNode,
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useState,
} from 'react';
import type { AriaButtonProps, PressEvent } from 'react-aria';
import { useId } from 'react-aria';
import { isNonNullish, isString, omit } from 'remeda';

import { Cancel } from '../../icons/cancel.js';
import { CheckFilled } from '../../icons/check-filled.js';
import { ErrorFilled } from '../../icons/error-filled.js';
import { InfoFilled } from '../../icons/info-filled.js';
import { WarningFilled } from '../../icons/warning-filled.js';
import { vars } from '../../theme-contract.css.js';
import type { DOMAttributes } from '../../types.js';
import { Box } from '../box/box.js';
import { type ButtonProps, Button } from '../button/index.js';
import { Flex } from '../flex/flex.js';
import { Grid } from '../grid/grid.js';
import type { IconProps } from '../icon/icon.js';
import {
  cancelIconStyles,
  copyStyles,
  iconStyles,
  rootStyles,
  titleStyles,
} from './notification.css.js';

export type NotificationKind =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export interface NotificationAction extends ButtonProps {
  content?: ReactNode;
  Icon?: ComponentType<Omit<IconProps, 'children'>>;
  iconPosition?: 'before' | 'after';
  shouldDismiss?: boolean;
  dataTest?: string;
}

export type NotificationProps = {
  actions?: NotificationAction[];
  children?: ReactNode;
  dataTest?: string;
  title?: string;
  kind?: NotificationKind;
  onDismiss?: () => void;
  icon?: boolean;
  NotificationIcon?: ReactNode;
  showClose?: boolean;
} & DOMAttributes;

const actionButtonColorMap: Map<
  NotificationKind,
  { color: ButtonProps['color']; inverted: boolean }
> = new Map([
  ['neutral', { color: 'gray', inverted: true }],
  ['info', { color: 'blue', inverted: false }],
  ['success', { color: 'green', inverted: false }],
  ['warning', { color: 'yellow', inverted: false }],
  ['error', { color: 'red', inverted: false }],
]);

const IconMap = ({ kind }: { kind: NotificationKind }) => {
  let Icon = null;
  switch (kind) {
    case 'error': {
      Icon = ErrorFilled;
      break;
    }
    case 'info': {
      Icon = InfoFilled;
      break;
    }
    case 'success': {
      Icon = CheckFilled;
      break;
    }
    case 'warning': {
      Icon = WarningFilled;
      break;
    }
  }
  return Icon ? <Icon className={iconStyles} /> : null;
};

export const Notification = forwardRef<
  HTMLDivElement,
  NotificationProps & {
    contentProps?: DOMAttributes;
    titleProps?: DOMAttributes;
    closeButtonProps?: AriaButtonProps;
    showIcon?: boolean;
  }
>(function Notification(
  {
    actions = [],
    children,
    closeButtonProps: _closeButtonProps,
    contentProps = {},
    title,
    showIcon = true,
    NotificationIcon,
    kind = 'neutral',
    onDismiss,
    showClose = false,
    titleProps = {},
    ...rest
  },
  ref,
) {
  const closeButtonProps = _closeButtonProps ?? {};

  const id = useId();
  const [showNotification, setShowNotification] = useState(true);

  const isDismissable = showClose || onDismiss;

  if (!showNotification) {
    return null;
  }

  return (
    <Grid
      className={rootStyles}
      data-kind={kind}
      data-test={`notification-${kind}`}
      key={id}
      ref={ref}
      {...rest}
    >
      <Grid
        alignItems="center"
        columnGap="$8"
        gridTemplateColumns={`${kind === 'neutral' || !showIcon ? '' : 'auto '}1fr`}
      >
        {showIcon && kind !== 'neutral' ?
          <Box alignSelf="start" data-test="notification-icon">
            {NotificationIcon ?? <IconMap kind={kind} />}
          </Box>
        : null}
        <Flex
          direction="column"
          gap={isNonNullish(children) || isNonNullish(actions) ? '$2' : '$0'}
        >
          <Grid
            alignItems="start"
            columnGap="$8"
            gridTemplateColumns={`1fr${isDismissable ? ' auto' : ''}`}
          >
            <Flex direction="column" gap="$2">
              {title ?
                <span
                  className={titleStyles}
                  data-test="notification-title"
                  {...titleProps}
                >
                  {title}
                </span>
              : null}
              {isNonNullish(children) ?
                Children.map(children, child =>
                  isString(child) ?
                    <span
                      className={copyStyles}
                      data-test="notification-description"
                      style={{ lineHeight: '2.4rem' }} // INFO: override, since we don't have a variant with a big enough line height on mobile
                      {...contentProps}
                    >
                      {child}
                    </span>
                  : isValidElement(child) ? cloneElement(child, contentProps)
                  : null,
                )
              : null}
            </Flex>
            {isDismissable ?
              <Box alignSelf="start">
                <Button
                  color="gray"
                  css={{ position: 'relative', top: '-0.3rem' }}
                  data-test="notification-close-button"
                  kind="tertiary"
                  onPress={event => {
                    // If we're not in a "Toast" context...
                    if (_closeButtonProps === undefined) {
                      // Default onClick behavior dismisses the notification
                      setShowNotification(false);
                    } else if (closeButtonProps.onPress) {
                      closeButtonProps.onPress(event);
                    }
                    // Any additional functionality needed when dismissing can be passed in the onDismiss prop, and called here
                    onDismiss?.();
                  }}
                  size="icon"
                  textColor={vars.color.gray600}
                  {...omit(closeButtonProps, ['onPress'])}
                >
                  <Cancel className={cancelIconStyles} size={24} />
                </Button>
              </Box>
            : null}
          </Grid>
          {actions.length > 0 ?
            <Flex
              columnGap="$8"
              data-test="notification-actions"
              justifyContent="end"
              paddingTop="$8"
            >
              {actions.map((action, index) => {
                const { color: _color, inverted } =
                  actionButtonColorMap.get(kind)!;
                const {
                  kind: buttonKind,
                  color,
                  content,
                  dataTest,
                  iconPosition = 'before',
                  Icon,
                  onPress,
                  shouldDismiss,
                  ...rest
                } = action;

                const onPressProps: Record<
                  string,
                  (event: PressEvent) => void
                > = {};
                if (onPress || shouldDismiss) {
                  onPressProps['onPress'] = event => {
                    onPress?.(event);
                    if (shouldDismiss) {
                      if (_closeButtonProps === undefined) {
                        setShowNotification(false);
                      } else if (closeButtonProps.onPress) {
                        closeButtonProps.onPress(event);
                      }
                      onDismiss?.();
                    }
                  };
                }

                return (
                  <Flex
                    alignItems="center"
                    flexDirection="row"
                    gap="$8"
                    justifyContent="flex-end"
                    key={`action${id}${index}`}
                  >
                    <Button
                      color={color ?? _color}
                      data-test={
                        dataTest ?? `notification-action-${buttonKind}`
                      }
                      inverted={inverted}
                      kind={buttonKind}
                      {...rest}
                      {...onPressProps}
                    >
                      {Icon && iconPosition === 'before' ?
                        <Icon />
                      : null}
                      {content}
                      {Icon && iconPosition === 'after' ?
                        <Icon />
                      : null}
                    </Button>
                  </Flex>
                );
              })}
            </Flex>
          : null}
        </Flex>
      </Grid>
    </Grid>
  );
});
