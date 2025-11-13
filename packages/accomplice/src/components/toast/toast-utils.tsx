import { vars } from '../../theme-contract.css.js';
import type { NotificationAction } from '../notification/index.js';
import type { AddToastProps } from './utils.js';

export function UpgradeCTANotification({
  path,
  size,
  text = 'Want to listen to anything, anytime?',
  title,
}: {
  path: string;
  size: NotificationAction['size'];
  text?: string;
  title?: string;
}): AddToastProps {
  return {
    kind: 'info',
    text,
    title,
    actions: [
      {
        color: 'gray',
        kind: 'tertiary',
        textColor: vars.color.gray600,
        size,
        content: 'Listen with iHeart All Access',
        href: path,
        target: '_blank',
      },
    ],
  };
}

export function AuthenticateCTANotification({
  text,
  size,
  paths,
}: {
  trigger: string;
  text: string;
  size: NotificationAction['size'];
  paths: [string, string] | [URL, URL];
}): AddToastProps {
  return {
    kind: 'info',
    text,
    actions: [
      {
        kind: 'tertiary',
        color: 'gray',
        textColor: vars.color.gray600,
        content: 'Log in',
        size,
        href: typeof paths[0] === 'string' ? paths[0] : paths[0].toString(),
      },
      {
        kind: 'tertiary',
        color: 'gray',
        textColor: vars.color.gray600,
        content: 'Sign up',
        size,
        href: typeof paths[1] === 'string' ? paths[1] : paths[1].toString(),
      },
    ],
  };
}

type AuthCTAToastProps = {
  kind: 'info';
  actionKind: 'tertiary';
  actionColor: 'gray';
  actionTextColor: typeof vars.color.gray600;
  actionContent: ['Log in', 'Sign up'];
};

// this is to replace AuthenticateCTANotification
// this function returns props to pass to addToast() or addRegGateToast()
export function getAuthCTAToastProps(): AuthCTAToastProps {
  return {
    kind: 'info',
    actionKind: 'tertiary',
    actionColor: 'gray',
    actionTextColor: vars.color.gray600,
    actionContent: ['Log in', 'Sign up'],
  };
}

export function LyricsNotification({
  size,
}: {
  size: NotificationAction['size'];
}): AddToastProps {
  return {
    kind: 'info',
    text: 'Lyrics not available',
    actions: [
      {
        kind: 'tertiary',
        color: 'gray',
        textColor: vars.color.gray600,
        content: 'Cancel',
        shouldDismiss: true,
        size,
      },
      {
        kind: 'tertiary',
        color: 'gray',
        textColor: vars.color.gray600,
        content: 'Request Lyrics',
        size,
        onPress: () => {
          // pending
        },
      },
    ],
  };
}
