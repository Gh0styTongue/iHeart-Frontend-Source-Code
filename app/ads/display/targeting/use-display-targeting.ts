import memoize from 'memoize';
import { useMemo, useRef } from 'react';
import { type UIMatch, useMatches, useSearchParams } from 'react-router';
import { isDefined } from 'remeda';

import { useIsMobile } from '~app/contexts/is-mobile';
import { useUser } from '~app/contexts/user';
import { useRequestInfo } from '~app/hooks/use-request-info';
import { playback } from '~app/playback/playback';

import { type DisplayTargetingParams, DisplayTargetingKeys } from './model';

export const getRouteTargetingParams = memoize(
  (matches: UIMatch[]): DisplayTargetingParams => {
    const targetingMap = new Map<keyof DisplayTargetingParams, unknown>();

    for (const match of matches) {
      if (match.data) {
        for (const [key, value] of Object.entries(match.data)) {
          if (
            DisplayTargetingKeys.includes(key as keyof DisplayTargetingParams)
          ) {
            targetingMap.set(key as keyof DisplayTargetingParams, value);
          }
        }
      }
    }

    return Object.fromEntries(targetingMap.entries());
  },
);

export const useDisplayTargeting = (): { [k: string]: unknown } => {
  const user = useRef(useUser());
  const routeTargetingParams = getRouteTargetingParams(useMatches());
  const playerState = playback.useState();
  const { locale } = useRequestInfo();
  const isMobile = useIsMobile();
  const [searchParams, _setSearchParams] = useSearchParams();

  const item = playerState.queue?.[0];

  const {
    playlistid,
    ihmgenre,
    playlisttype,
    seed: playlistSeed,
  } = useMemo(
    () => ({
      playlistid: routeTargetingParams['aw_0_1st.playlistid'],
      ihmgenre: routeTargetingParams['aw_0_1st.ihmgenre'],
      playlisttype: routeTargetingParams['aw_0_1st.playlisttype'],
      seed: routeTargetingParams['seed'],
    }),
    [routeTargetingParams],
  );

  return useMemo(() => {
    const playedFrom = playerState.station?.context.playedFrom ?? 0;
    const ccrcontent2 = playerState.station?.type?.toLowerCase();
    const ccrformat = item?.meta?.format;
    const ccrmarket = item?.meta?.market;

    const deviceType = isMobile ? 'mobile' : 'desktop';

    const profileId = user.current?.profileId;

    const childDirected =
      ((item?.meta?.childOriented || !!item?.meta?.ageLimit) &&
        user.current?.isAnonymous) ??
      false;

    const seed = playlistSeed ?? playerState.station?.seed;

    const targetingParams: Record<
      string,
      string | boolean | undefined | number
    > = {
      // UserDisplayTargetingKeys
      childDirected,
      deviceType,
      locale,
      profileId,
      visitNum: routeTargetingParams.visitNum,
      // StationDisplayTargetingKeys
      'aw_0_1st.playlistid': playlistid,
      'aw_0_1st.ihmgenre': ihmgenre,
      'aw_0_1st.playlisttype': playlisttype,
      ccrcontent2,
      pageformat: routeTargetingParams.pageformat,
      pagemarket: routeTargetingParams.pagemarket,
      ccrcontent3: routeTargetingParams.ccrcontent3,
      ccrformat,
      ccrmarket,
      section: routeTargetingParams.section,
      // PlaybackDisplayTargetingKeys
      playedFrom,
      provider: 'cc',
      seed,
      // GlobalDisplayTargetingKeys
      ccrcontent1: routeTargetingParams.ccrcontent1,
      env: searchParams.get('env') ?? 'listen',
    };

    return Object.fromEntries(
      Object.entries(targetingParams).reduce(
        (entries, [key, value]) => {
          if (isDefined(value)) {
            entries.push([key, value]);
          }
          return entries;
        },
        [] as [string, unknown][],
      ),
    );
  }, [
    ihmgenre,
    playlistid,
    playlisttype,
    isMobile,
    item?.meta?.format,
    item?.meta?.market,
    item?.meta?.childOriented,
    item?.meta?.ageLimit,
    playerState.station?.context,
    playerState.station?.type,
    playerState.station?.seed,
    playlistSeed,
    routeTargetingParams.ccrcontent1,
    routeTargetingParams.ccrcontent3,
    routeTargetingParams.section,
    routeTargetingParams.pageformat,
    routeTargetingParams.pagemarket,
    routeTargetingParams.visitNum,
    locale,
    searchParams,
  ]);
};
