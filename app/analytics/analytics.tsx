import type { Analytics as AnalyticsPackage } from '@iheartradio/web.analytics';
import * as Playback from '@iheartradio/web.playback';
import { memo, useEffect, useMemo } from 'react';

import { useConfig } from '~app/contexts/config';
import { usePresetsContext } from '~app/contexts/presets/presets';
import { useUser } from '~app/contexts/user';
import { useRootLoaderData } from '~app/hooks/use-root-loader-data';
import { playback } from '~app/playback/playback';

import { Braze } from './braze';
import { Comscore } from './comscore';
import { useAnalytics } from './create-analytics';
import { Igloo } from './igloo';

export const Analytics = memo(function Analytics() {
  const { geolocation, appVersion } = useRootLoaderData();
  const analytics = useAnalytics();
  const config = useConfig();
  const playbackState = playback.useState();
  const user = useUser();
  const { presetsLength } = usePresetsContext();

  // If there are 0 presets, analytics requires that we pass `null`
  const numberPresets = useMemo(
    () => (presetsLength > 0 ? presetsLength : null),
    [presetsLength],
  );

  useEffect(() => {
    async function AnalyticsGlobalData() {
      if (!user?.profileId || analytics.initialized) return;

      const globalData: AnalyticsPackage.UncontrolledGlobalData = {
        // TODO: Most of the hardcoded values need to be updated at some point.
        device: {
          appVersion,
          lat: geolocation.lat ?? undefined,
          lng: geolocation.lng ?? undefined,
          host: config.environment.hosts.listen,
          isPlaying: playbackState.status === Playback.Status.Playing,
          referer: typeof window !== "undefined" ? window.document.referrer ?? undefined : undefined,
          volume: Math.round(playbackState.volume),
          env: 'listen',
        },
        user: {
          abTestGroup:
            user?.abTestGroups &&
            Object.entries(user?.abTestGroups).map(
              ([key, value]) => `${key}|${value}`,
            ),
          genreIsDefault: false,
          genreSelected: [],
          isTrialEligible: user?.subscription?.isTrialEligible ?? false,
          numberPresets,
          privacyOptOut: user?.privacy?.hasOptedOut ?? false,
          profileId: user?.profileId?.toString() ?? '',
          registration: {
            birthYear: user?.birthYear,
            country: user?.country ?? '',
            gender: user?.gender,
            type: user?.oauths?.[0]?.type ?? 'IHR',
            zip: user?.zipCode,
          },
          subscriptionTier: user?.subscription?.type ?? 'NONE',
          skuPromotionType: user?.subscription?.productId,
        },
      };

      if (user?.profileId && !analytics.initialized) {
        await analytics.initialize(globalData);
      } else if (analytics.initialized) {
        await analytics.setGlobalData(globalData);
      }
    }

    AnalyticsGlobalData().catch(() => {
      /* */
    });
  }, [
    analytics,
    appVersion,
    config.environment.hosts.listen,
    geolocation.lat,
    geolocation.lng,
    numberPresets,
    playbackState.status,
    playbackState.volume,
    user?.abTestGroups,
    user?.birthYear,
    user?.country,
    user?.gender,
    user?.oauths,
    user?.privacy?.hasOptedOut,
    user?.profileId,
    user?.subscription?.isTrialEligible,
    user?.subscription?.productId,
    user?.subscription?.type,
    user?.zipCode,
  ]);

  return (
    <>
      <Comscore />
      <Igloo />
      <Braze />
    </>
  );
});
