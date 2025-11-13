import type { AddToastProps } from '@iheartradio/web.accomplice/components/toast';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import type { Analytics } from '@iheartradio/web.analytics';
import { toURL } from '@iheartradio/web.utilities';

import type {
  RegGateToastExitType,
  RegGateToastMessageType,
} from '~app/utilities/constants';
import { REG_GATE_TOAST_EXIT_TYPE } from '~app/utilities/constants';

import { type RegGateContext, analyticsContextCodec } from './data';
import type { InAppMessageHandler } from './in-app-message';

export const addRegGateToast = ({
  globalStation,
  location,
  messageType,
  onInAppMessageExit,
  onInAppMessageOpen,
  pageName,
  timeout,
  userTriggered,
  ...rest
}: AddToastProps & {
  globalStation?: Analytics.GlobalStationType;
  location?: string;
  messageType: RegGateToastMessageType;
  onInAppMessageExit: InAppMessageHandler;
  onInAppMessageOpen: InAppMessageHandler;
  pageName: string;
  userTriggered?: boolean;
}) => {
  let exitType: RegGateToastExitType = REG_GATE_TOAST_EXIT_TYPE.USER_DISMISS;

  // Use the `timeout` value that is passed, if none, default to 5 seconds (Default toast timeout duration)
  const exitTypeTimeOut = timeout ?? 5000;

  //  When this timeout finishes, the toast will also be dismissed, which means the toast dismissed itself and was not dismissed by the user
  setTimeout(() => {
    exitType = REG_GATE_TOAST_EXIT_TYPE.AUTO_DISMISS;
  }, exitTypeTimeOut);

  onInAppMessageOpen({
    globalStation,
    location,
    messageType,
    pageName,
    userTriggered,
  });

  addToast({
    ...rest,
    timeout,
    onClose: () =>
      onInAppMessageExit({
        exitType,
        globalStation,
        location,
        messageType,
        pageName,
      }),
  });
};

export function makeLoginUrl(
  accountUrl: string | URL = 'https://account.iheart.com',
  params?: { redirectUrl?: string | URL; context?: RegGateContext },
) {
  const url = new URL('/login', accountUrl);
  const { redirectUrl, context } = params ?? {};

  if (redirectUrl) {
    url.searchParams.set('redirectUrl', redirectUrl.toString());
  }

  if (context) {
    url.searchParams.set('context', analyticsContextCodec.encode(context));
  }

  return url;
}

export function makeSignUpUrl(
  accountUrl: string | URL = 'https://account.iheart.com',
  params?: { redirectUrl?: string | URL; context?: RegGateContext },
) {
  const url = new URL('/sign-up', accountUrl);
  const { redirectUrl, context } = params ?? {};

  if (redirectUrl) {
    url.searchParams.set('redirectUrl', redirectUrl.toString());
  }

  if (context) {
    url.searchParams.set('context', analyticsContextCodec.encode(context));
  }

  return url;
}

export function makeSubscribeUrl(
  accountUrl: string | URL = 'https://account.iheart.com',
  params?: { redirectUrl?: string | URL; context?: RegGateContext },
) {
  const url = new URL('/subscribe', accountUrl);
  const { redirectUrl, context } = params ?? {};

  if (redirectUrl) {
    url.searchParams.set('redirectUrl', redirectUrl.toString());
  }

  if (context) {
    url.searchParams.set('context', analyticsContextCodec.encode(context));
  }

  return url;
}

export function setRegGateContext(url: URL | string, context: RegGateContext) {
  url = url instanceof URL ? url : toURL(url);
  url.searchParams.set('context', analyticsContextCodec.encode(context));
  return url;
}
