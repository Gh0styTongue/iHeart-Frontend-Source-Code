import { Button } from '@iheartradio/web.accomplice/components/button';
import { DialogContainer } from '@iheartradio/web.accomplice/components/dialog';
import type { IconProps } from '@iheartradio/web.accomplice/components/icon';
import {
  MenuContent,
  MenuTrigger,
} from '@iheartradio/web.accomplice/components/menu';
import { PlayerTooltip } from '@iheartradio/web.accomplice/components/player';
import { getAuthCTAToastProps } from '@iheartradio/web.accomplice/components/toast';
import { View } from '@iheartradio/web.accomplice/components/view';
import { SavedPlaylist } from '@iheartradio/web.accomplice/icons/saved-playlist';
import { useCallback, useState } from 'react';
import { useLocation } from 'react-router';
import { isNullish } from 'remeda';

import type { RegGateContext } from '~app/analytics/data';
import { useInAppMessage } from '~app/analytics/in-app-message';
import { addRegGateToast } from '~app/analytics/reg-gate-toast';
import { CreatePlaylistDialog } from '~app/components/dialogs/create-playlist-dialog';
import { AddToPlaylistSubMenu } from '~app/components/menu-items/add-to-playlist-sub-menu';
import { useUser } from '~app/contexts/user';
import { useLoginUrl, useSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import {
  ADD_TO_PLAYLIST_AUTHENTICATION_MESSAGE,
  ANALYTICS_LOCATION,
  ANALYTICS_ORIGIN,
  PAYLOAD_TRIGGER_TYPES,
  PlaylistDialogActions,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';

import { playback } from '../playback';

export function AddToPlaylist({
  isForAllBreakpoints = false,
  size = 32,
  isDisabled,
  triggerText,
}: {
  isDisabled?: boolean;
  isForAllBreakpoints?: boolean;
  size?: IconProps['size'];
  triggerText?: string;
}) {
  const user = useUser();
  const { station } = playback.useState();
  const location = useLocation();
  const metadata = playback.useMetadata();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<PlaylistDialogActions | null>(null);
  const { onInAppMessageExit, onInAppMessageOpen } = useInAppMessage();
  const pageName = useGetPageName();

  const { trackId, id, title } = metadata?.data ?? {};

  const isInProfilePlayer = location?.pathname.includes('now-playing');
  const analyticsLocation =
    isInProfilePlayer ?
      ANALYTICS_LOCATION.NOW_PLAYING
    : ANALYTICS_LOCATION.MINIPLAYER_BUTTON;

  const regGateContext: RegGateContext = {
    trigger: PAYLOAD_TRIGGER_TYPES.ADD_TO_PLAYLIST,
    origin: ANALYTICS_ORIGIN.LISTEN,
    pageName,
    location: analyticsLocation,
    assetId: String(trackId ?? id),
    assetName: title,
  };

  const loginUrl = useLoginUrl({ context: regGateContext });
  const signUpUrl = useSignUpUrl({ context: regGateContext });

  const onPressHandler = useCallback(() => {
    if (user?.isAnonymous) {
      const {
        actionContent,
        actionColor,
        actionKind,
        actionTextColor,
        ...authCTAProps
      } = getAuthCTAToastProps();
      addRegGateToast({
        location: analyticsLocation,
        messageType: REG_GATE_TOAST_MESSAGE_TYPE.ADD_TO_PLAYLIST,
        onInAppMessageExit,
        onInAppMessageOpen,
        pageName,
        userTriggered: true,
        ...authCTAProps,
        text: ADD_TO_PLAYLIST_AUTHENTICATION_MESSAGE,
        ...(isInProfilePlayer && station?.id && station?.name ?
          {
            globalStation: {
              id: station.id.toString(),
              name: station.name,
            },
          }
        : {}),
        actions: [
          {
            color: actionColor,
            content: actionContent[0],
            kind: actionKind,
            size: { xsmall: 'small', medium: 'large' },
            textColor: actionTextColor,
            href: loginUrl.toString(),
            onPress: () => {
              onInAppMessageExit({
                messageType: REG_GATE_TOAST_MESSAGE_TYPE.ADD_TO_PLAYLIST,
                exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                pageName,
              });
            },
          },
          {
            color: actionColor,
            content: actionContent[1],
            kind: actionKind,
            size: { xsmall: 'small', medium: 'large' },
            textColor: actionTextColor,
            href: signUpUrl.toString(),
            onPress: () => {
              onInAppMessageExit({
                messageType: REG_GATE_TOAST_MESSAGE_TYPE.ADD_TO_PLAYLIST,
                exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                pageName,
              });
            },
          },
        ],
      });
    }
  }, [
    analyticsLocation,
    isInProfilePlayer,
    loginUrl,
    onInAppMessageExit,
    onInAppMessageOpen,
    pageName,
    signUpUrl,
    station.id,
    station.name,
    user?.isAnonymous,
  ]);

  if (isNullish(station) || isNullish(metadata)) {
    return null;
  }

  return (
    <View isHidden={{ mobile: !isForAllBreakpoints, large: false }}>
      <MenuTrigger
        isOpen={user?.isAnonymous ? false : menuOpen}
        onOpenChange={setMenuOpen}
      >
        <PlayerTooltip content="Add to playlist">
          <Button
            color="default"
            data-test={
              user?.isAnonymous ?
                'add-to-playlist-button'
              : 'add-to-playlist-menu-trigger'
            }
            isDisabled={isDisabled}
            kind="tertiary"
            onPress={onPressHandler}
            size="icon"
          >
            <SavedPlaylist size={size} />
          </Button>
        </PlayerTooltip>

        <MenuContent
          data-test="add-to-playlist-menu"
          style={{
            maxHeight: '40dvh',
          }}
        >
          <AddToPlaylistSubMenu
            setDialog={setDialog}
            tracks={[Number(trackId ?? id)]}
            triggerText={triggerText}
          />
        </MenuContent>
      </MenuTrigger>
      <DialogContainer onDismiss={() => setDialog(null)}>
        {dialog === PlaylistDialogActions.Create && (
          <CreatePlaylistDialog tracks={[Number(trackId ?? id)]} />
        )}
      </DialogContainer>
    </View>
  );
}
