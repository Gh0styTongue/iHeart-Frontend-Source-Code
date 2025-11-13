import { vars } from '@iheartradio/web.accomplice';
import { MenuItem } from '@iheartradio/web.accomplice/components/menu';
import { MinusFilled } from '@iheartradio/web.accomplice/icons/minus-filled';
import { Preset } from '@iheartradio/web.accomplice/icons/preset';
import { UserType } from '@iheartradio/web.config';
import { useCallback } from 'react';
import { useMatches } from 'react-router';

import type { ContextLocation, RegGateContext } from '~app/analytics/data';
import { useInAppMessage } from '~app/analytics/in-app-message';
import { addRegGateToast } from '~app/analytics/reg-gate-toast';
import { useTrackPresets } from '~app/analytics/track-presets';
import { usePresetsContext } from '~app/contexts/presets/presets';
import {
  addPreset,
  deletePreset,
  getPresetsImage,
  hasAnalyticsData,
} from '~app/contexts/presets/utils';
import { useUser } from '~app/contexts/user';
import { useLoginUrl, useSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { playback } from '~app/playback/playback';
import type { Preset as PresetType } from '~app/routes/_app/_index/components/presets-carousel';
import {
  ADD_TO_PRESET_AUTHENTICATION_MESSAGE,
  ANALYTICS_ORIGIN,
  PAYLOAD_TRIGGER_TYPES,
  PRESETS_EVENTS,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';

type AddToPresetMenuItemProps = {
  icon?: boolean;
  isPremiumPlaylist?: boolean;
  station: { id: number | string; title: string; imageUrl?: string };
  stationType: PresetType['type'];
  location?: ContextLocation;
};

export function PresetMenuItem({
  icon,
  isPremiumPlaylist = false,
  station: presetStation,
  stationType,
  location = PRESETS_EVENTS.OVERFLOW_MENU,
}: AddToPresetMenuItemProps) {
  const user = useUser();
  const { onInAppMessageOpen, onInAppMessageExit } = useInAppMessage();
  const { trackAddPreset, trackRemovePreset } = useTrackPresets();
  const pageName = useGetPageName();
  const { presetListData } = usePresetsContext();
  const { id, title, imageUrl } = presetStation;
  const playerState = playback.useState();
  const { station } = playerState;

  // Grab routes
  const routes = useMatches().reverse();

  // Find the closest route that has loader data returned
  const loaderData =
    routes?.map(route => route.data).find(hasAnalyticsData) ?? null;

  const savedPreset = presetListData.items.find(
    preset => preset.id === id.toString(),
  );

  const image = getPresetsImage({
    id,
    type: stationType,
    imageUrl,
  });

  const triggerText = savedPreset ? 'Remove from Presets' : 'Add to Presets';

  const context = {
    trigger: PAYLOAD_TRIGGER_TYPES.PRESETS,
    origin: ANALYTICS_ORIGIN.LISTEN,
    pageName,
    location,
    ...(loaderData?.analytics?.preset_removed ?
      {
        assetId: loaderData?.analytics.preset_removed.view.station.id,
        assetName: loaderData?.analytics.preset_removed.view.station.name,
      }
    : {}),
  } satisfies RegGateContext;

  const loginUrl = useLoginUrl({ context });
  const signUpUrl = useSignUpUrl({ context });

  const onRegGatePress = useCallback(() => {
    onInAppMessageExit({
      messageType: REG_GATE_TOAST_MESSAGE_TYPE.PRESETS,
      exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
      pageName,
      location,
      ...(loaderData?.analytics?.preset_removed ?
        {
          globalStation: loaderData.analytics.preset_removed.view.station,
        }
      : {}),
    });
  }, [loaderData?.analytics, pageName, onInAppMessageExit, location]);

  if (isPremiumPlaylist && user?.subscription?.type !== UserType.Premium) {
    return null;
  }

  return user?.isAnonymous ?
      <MenuItem
        data-test="anonymous-add-preset-menu-item"
        onAction={() => {
          addRegGateToast({
            kind: 'info',
            text: ADD_TO_PRESET_AUTHENTICATION_MESSAGE,
            location,
            ...(loaderData?.analytics?.preset_removed ?
              {
                globalStation: loaderData.analytics.preset_removed.view.station,
              }
            : {}),
            actions: [
              {
                kind: 'tertiary',
                color: 'gray',
                textColor: vars.color.gray600,
                content: 'Log in',
                size: { xsmall: 'small', medium: 'large' },
                href: loginUrl.toString(),
                onPress: onRegGatePress,
              },
              {
                kind: 'tertiary',
                color: 'gray',
                textColor: vars.color.gray600,
                content: 'Sign up',
                size: { xsmall: 'small', medium: 'large' },
                href: signUpUrl.toString(),
                onPress: onRegGatePress,
              },
            ],
            onInAppMessageOpen,
            onInAppMessageExit,
            messageType: REG_GATE_TOAST_MESSAGE_TYPE.PRESETS,
            userTriggered: true,
            pageName,
          });
        }}
      >
        {icon ?
          <Preset size={18} />
        : null}
        {triggerText}
      </MenuItem>
    : <MenuItem
        data-test="add-preset-menu-item"
        onAction={() => {
          if (savedPreset) {
            deletePreset({
              title,
              position: savedPreset.index,
              presetListData,
              id: savedPreset.id,
              analyticsCallback: () =>
                trackRemovePreset({
                  pageName,
                  location: PRESETS_EVENTS.OVERFLOW_MENU,
                  station: { id: String(savedPreset.id), name: title },
                  item: {
                    id: String(station.id),
                    name: station?.name ?? 'Station',
                  },
                  ...(loaderData?.analytics?.preset_removed ?
                    {
                      globalStation:
                        loaderData.analytics.preset_removed.view.station,
                    }
                  : {}),
                }),
            });
          } else {
            addPreset({
              id: id.toString(),
              title,
              type: stationType!,
              presetListData,
              imageUrl: image,
              analyticsCallback: () =>
                trackAddPreset({
                  pageName,
                  location: PRESETS_EVENTS.OVERFLOW_MENU,
                  station: { id: String(id), name: title },
                  item: {
                    id: String(station.id),
                    name: station?.name ?? 'Station',
                  },
                  ...(loaderData?.analytics?.preset_added ?
                    {
                      globalStation:
                        loaderData.analytics.preset_added.view.station,
                    }
                  : {}),
                }),
            });
          }
        }}
      >
        {icon ?
          savedPreset ?
            <MinusFilled size={18} />
          : <Preset size={18} />
        : null}
        {triggerText}
      </MenuItem>;
}
