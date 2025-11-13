import {
  type AriaToastProps,
  type AriaToastRegionProps,
  useToast,
  useToastRegion,
} from '@react-aria/toast';
import {
  type ToastState,
  type ToastStateProps,
  useToastQueue,
  useToastState,
} from '@react-stately/toast';
import {
  type FC,
  type ReactNode,
  type RefObject,
  useMemo,
  useRef,
} from 'react';
import { useId } from 'react-aria';
import { createPortal } from 'react-dom';

import {
  type NotificationProps,
  Notification,
} from '../notification/notification.js';
import {
  globalToastRegionStyles,
  localToastRegionStyles,
  toastStyles,
} from './toast.css.js';
import { GlobalToastQueue } from './utils.js';

interface ToastRegionProps<T extends NotificationProps>
  extends AriaToastRegionProps {
  id?: string;
  state: ToastState<T>;
  className?: string;
  dataTest?: string | undefined;
}

interface ToastProps<T extends NotificationProps> extends AriaToastProps<T> {
  state: ToastState<T>;
}

export function GlobalToastRegion<T extends NotificationProps>(
  props: Omit<ToastRegionProps<T>, 'state'>,
) {
  const state = useToastQueue(GlobalToastQueue);

  return createPortal(
    <ToastRegion id="global-toast-region" {...props} state={state} />,
    document.body,
  );
}

export function ToastProvider<T extends NotificationProps>({
  children,
  ...props
}: Omit<ToastRegionProps<T>, 'state'> & {
  children: (state: ToastState<T>) => ReactNode;
}) {
  const state = useToastState<T>({
    maxVisibleToasts: 5,
  });

  return (
    <>
      {children(state)}
      <ToastRegion
        className={localToastRegionStyles}
        {...props}
        state={state}
      />
    </>
  );
}

type UseToastProvider = {
  addToast: ReturnType<typeof useToastState>['add'];
  closeToast: ReturnType<typeof useToastState>['close'];
  Region: FC;
};

/**
 * To use scoped Toast methods outside of the rendered Provider.
 *
 * @param param ToastStateProps
 * @returns UseToastProvider
 */
export function useToastProvider(props?: ToastStateProps): UseToastProvider {
  const { maxVisibleToasts = 5 } = props ?? {};

  const state = useToastState<NotificationProps>({
    maxVisibleToasts,
  });

  return useMemo(
    () => ({
      addToast: (
        content: Parameters<typeof state.add>[0],
        options: Parameters<typeof state.add>[1],
      ) => {
        return state.add(content, { timeout: 5000, ...options });
      },
      closeToast: state.close,
      Region: function UseToastRegion() {
        return <ToastRegion className={localToastRegionStyles} state={state} />;
      },
    }),
    [state],
  );
}

function ToastRegion<T extends NotificationProps>({
  state,
  className = globalToastRegionStyles,
  id,
  dataTest,
  ...props
}: ToastRegionProps<T>) {
  const generatedId = useId();
  const ref = useRef<HTMLDivElement | null>(null);
  // Storing this value in a ref so it doesn't cause re-renders

  const { regionProps } = useToastRegion(
    {
      ...props,
      'aria-label':
        className === globalToastRegionStyles ?
          'Global Notifications'
        : 'Local Notifications',
    },
    state,
    ref,
  );

  return (
    <div
      {...regionProps}
      className={className}
      id={id ?? generatedId}
      ref={ref}
    >
      {state.visibleToasts.map(toast => (
        <Toast
          dataTest={dataTest}
          isGlobal={className === globalToastRegionStyles}
          key={toast.key}
          parentRef={ref}
          state={state}
          toast={toast}
        />
      ))}
    </div>
  );
}

export function Toast<T extends NotificationProps>({
  state,
  dataTest,
  ...props
}: ToastProps<T> & {
  isGlobal?: boolean;
  parentRef?: RefObject<HTMLDivElement | null>;
  dataTest?: string | undefined;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { toastProps, contentProps, titleProps, closeButtonProps } = useToast(
    props,
    state,
    ref,
  );

  // If any of the `action` passed have the `shouldDismiss: true` property, we don't want
  // to show the native close button.
  const hasDismissAction = (props.toast.content.actions ?? []).some(
    action => action.shouldDismiss,
  );
  const showClose = props.toast.content.showClose ?? !hasDismissAction;

  return (
    // A wrapper for `Notification` which handles the `entering`, `queued` and `exiting` animations
    <div
      className={toastStyles}
      data-test="toast-notification"
      ref={ref}
      style={{
        viewTransitionName: props.toast.key,
        viewTransitionClass: 'toast',
      }}
      {...toastProps}
    >
      <Notification
        actions={props.toast.content.actions}
        closeButtonProps={closeButtonProps}
        contentProps={contentProps}
        data-test={dataTest}
        kind={props.toast.content.kind}
        NotificationIcon={props.toast.content.NotificationIcon}
        showClose={showClose}
        title={props.toast.content.title}
        titleProps={titleProps}
      >
        {props.toast.content.children}
      </Notification>
    </div>
  );
}
