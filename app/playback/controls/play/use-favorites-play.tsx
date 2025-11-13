import { vars } from '@iheartradio/web.accomplice';
import * as Playback from '@iheartradio/web.playback';
import { useCallback } from 'react';

import type { RegGateContext } from '~app/analytics/data';
import { useInAppMessage } from '~app/analytics/in-app-message';
import { addRegGateToast } from '~app/analytics/reg-gate-toast';
import { useUser } from '~app/contexts/user';
import { useLoginUrl, useSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import {
  ANALYTICS_LOCATION,
  ANALYTICS_ORIGIN,
  LIBRARY_AUTHENTICATION_MESSAGE,
  PAYLOAD_TRIGGER_TYPES,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';

import type { DoPlayProps } from './use-play';
import { usePlay } from './use-play';

export type UseFavoritesPlayProps = Omit<
  Playback.FavoritesStation,
  'type' | 'targeting' | 'seed'
>;

export function useFavoritesPlay(props: UseFavoritesPlayProps) {
  const { isAnonymous } = useUser();
  const { onInAppMessageExit, onInAppMessageOpen } = useInAppMessage();
  const pageName = useGetPageName();

  const play = usePlay({ ...props, type: Playback.StationType.Favorites });

  const regGateContext: RegGateContext = {
    trigger: PAYLOAD_TRIGGER_TYPES.FOLLOW,
    origin: ANALYTICS_ORIGIN.LISTEN,
    pageName,
    location: ANALYTICS_LOCATION.OVERFLOW_MENU,
  };

  const loginUrl = useLoginUrl({ context: regGateContext });
  const signUpUrl = useSignUpUrl({ context: regGateContext });

  const doPlay = useCallback(
    (doPlayProps?: DoPlayProps) => {
      if (!isAnonymous) {
        play.doPlay(doPlayProps);
        return;
      }
      addRegGateToast({
        kind: 'info',
        text: LIBRARY_AUTHENTICATION_MESSAGE,
        onInAppMessageOpen,
        onInAppMessageExit,
        messageType: REG_GATE_TOAST_MESSAGE_TYPE.FOLLOW,
        userTriggered: true,
        pageName,
        location: ANALYTICS_LOCATION.OVERFLOW_MENU,
        actions: [
          {
            kind: 'tertiary',
            size: { mobile: 'small', medium: 'large' },
            color: 'gray',
            textColor: vars.color.gray600,
            href: loginUrl.toString(),
            onPress: () => {
              onInAppMessageExit({
                messageType: REG_GATE_TOAST_MESSAGE_TYPE.FOLLOW,
                exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                pageName,
              });
            },
            content: 'Log in',
          },
          {
            kind: 'tertiary',
            size: { xsmall: 'small', medium: 'large' },
            color: 'gray',
            textColor: vars.color.gray600,
            href: signUpUrl.toString(),
            onPress: () => {
              onInAppMessageExit({
                messageType: REG_GATE_TOAST_MESSAGE_TYPE.FOLLOW,
                exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                pageName,
              });
            },
            content: 'Sign up',
          },
        ],
      });
    },
    [
      isAnonymous,
      loginUrl,
      onInAppMessageExit,
      onInAppMessageOpen,
      pageName,
      play,
      signUpUrl,
    ],
  );

  return { ...play, doPlay } as const;
}
