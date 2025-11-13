import { type ToastOptions, ToastQueue } from '@react-stately/toast';
import type { ReactNode } from 'react';
import { flushSync } from 'react-dom';

import type { NotificationProps } from '../notification/notification.js';

export type AddToastProps = Omit<NotificationProps, 'children'> & {
  text?: ReactNode;
  dataTest?: string;
} & Omit<ToastOptions, 'timeout'> & { timeout?: number | null };

/**
 * Global toast queue. Accessed through {@link addToast}
 */
export const GlobalToastQueue = new ToastQueue<NotificationProps>({
  maxVisibleToasts: 5,
  wrapUpdate(fn) {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => flushSync(fn));
    } else {
      fn();
    }
  },
});

/**
 * Adds a toast to the GlobalToastQueue
 *
 * @param params { text: string; ...rest: Omit<NotificationProps, 'children'> & { text: ReactNode; } & ToastOptions }
 * @returns a callback to remove the toast
 */
export const addToast = ({
  text,
  onClose,
  timeout,
  dataTest,
  ...rest
}: AddToastProps) => {
  const _timeout = timeout === null ? undefined : (timeout ?? 5000);
  const toastKey = GlobalToastQueue.add(
    {
      children: text,
      dataTest,
      ...rest,
    },
    { onClose, timeout: _timeout },
  );
  return () => GlobalToastQueue.close(toastKey);
};

export const removeAll = () => {
  GlobalToastQueue.visibleToasts = [];
};
