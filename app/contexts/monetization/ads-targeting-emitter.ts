import type { BaseConfig, User } from '@iheartradio/web.config';
import type { Playback } from '@iheartradio/web.playback';
import { CCPAUserPrivacy } from '@iheartradio/web.utilities';
import { createEmitter } from '@iheartradio/web.utilities/create-emitter';
import { createMemoryStorage } from '@iheartradio/web.utilities/create-storage';
import { useCallback } from 'react';

import { amp } from '~app/api/amp-client';
import { unwrapSettled } from '~app/api/utilities';

/**
 * This file attempts to solve a mildly unique problem when it comes to the availability of the
 * Triton partner ID's and Partner Token.
 *
 * Partner ID and Token sync can only happen on the client, and we *must* have those values
 * available and ready for player initialization. So we have created a memory storage bucket and an
 * emitter to populate it.
 *
 * The crucial bit of state is the `ready` state, which does not flip to true until all the Triton
 * sync business has been done. This is important in `app/playback/player.tsx`. We must pass the
 * values from here to `player.initialize` so that they are availble when `web.playback` creates
 * the stream urls.
 */

export type AdsTargeting = {
  partnerIds: Record<string, string | undefined>;
  partnerTokens: {
    coppa: string;
    nonCoppa: string;
  };
  ready: boolean;
  targetingParams: Playback.Targeting;
  lsid?: string;
};

const getDoNotTrack = () => {
  return Number.parseInt(globalThis.navigator.doNotTrack ?? '0', 10) === 1;
};

export const createAdsTargetingState = () =>
  createMemoryStorage<AdsTargeting>({
    partnerIds: {},
    partnerTokens: {
      coppa: '',
      nonCoppa: '',
    },
    ready: false,
    targetingParams: {
      InStream: {},
      Extra: {
        partnerTokens: {
          coppa: '',
          nonCoppa: '',
        },
      },
      PreRoll: {},
    },
    lsid: undefined,
  });

export const AdsTargetingState = createAdsTargetingState();

export const useTargetingReady = () => {
  return useCallback(() => {
    return AdsTargetingState.get('ready');
  }, []);
};

/**
 * Generates a deterministic value for `lsid` when the `triton-uid` value is unavailable.
 * Creates a hash from the browser's User-Agent string and the profile ID and then transforms it
 * into UUIDv4 format
 *
 * @param profileId The user object
 * @returns A deterministic UUID value
 */
export const generateDeterministicLSID = async (
  profileId: number | undefined,
): Promise<string> => {
  if (!window || !window.navigator || !window.crypto.subtle || !profileId) {
    throw new Error('Unable to generate deterministic LSID value');
  }

  const browserId = window.navigator.userAgent;
  const seed = `${browserId.replaceAll(' ', '')}${profileId}`;

  const msgUint8 = new TextEncoder().encode(seed);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const uuid = [
    hashHex.slice(0, 8),
    hashHex.slice(8, 12),
    `4${hashHex.slice(12, 15)}`,
    `8${hashHex.slice(15, 18)}`,
    hashHex.slice(18, 30),
  ].join('-');

  return uuid;
};

export const createAdsTargetingEmitter = () =>
  createEmitter({
    async initialize({
      config,
      user,
      visitNumber,
      isMobile,
    }: {
      config: BaseConfig;
      user: User | null;
      visitNumber?: number;
      isMobile?: boolean;
    }) {
      // Get the partner ids here. The "sync" logic can be asynchronous (that takes place in
      // `packages/ads/src/scripts/playback-ads-scripts.tsx`), as it does not affect anything on our
      // side.
      try {
        const partnerIdsFetch = await globalThis.fetch(
          config.ads.customAds.partnerIds,
          { credentials: 'include' },
        );
        AdsTargetingState.set('partnerIds', await partnerIdsFetch.json());
      } catch {
        console.error('Unable to fetch partner ids, triton pixels unavailable');
      }

      // Once we have the partner ids (specifically the `triton-uid`),
      // we can get the two tokens from AMP
      const lsid =
        AdsTargetingState.get('partnerIds')?.['triton-uid'] ??
        (await generateDeterministicLSID(user?.profileId)
          // Prefix the uuid with `app:` according to the Triton ListenerID guidelines
          // https://help.tritondigital.com/docs/listener-id?highlight=listener%20id
          .then(uuid => `app:${uuid}`)
          .catch((error: unknown) => {
            console.warn(
              error instanceof Error ? error.message : JSON.stringify(error),
            );
            return undefined;
          }));
      if (lsid) {
        AdsTargetingState.set('lsid', lsid);
        const { coppa, nonCoppa } = await Promise.allSettled([
          amp.api.v3.oauth
            .postGenerateTritonToken({
              body: { lsid, coppa: 1 },
              throwOnErrorStatus: false,
            })
            .then(({ body }) => body.token),
          amp.api.v3.oauth
            .postGenerateTritonToken({
              body: { lsid, coppa: 0 },
              throwOnErrorStatus: false,
            })
            .then(({ body }) => body.token),
        ]).then(([coppaSettled, nonCoppaSettled]) => ({
          coppa: unwrapSettled(coppaSettled) ?? '',
          nonCoppa: unwrapSettled(nonCoppaSettled) ?? '',
        }));

        AdsTargetingState.set('partnerTokens', { coppa, nonCoppa });
      } else {
        console.error(
          'Could not fetch triton token, triton UID is unavailable',
        );
      }

      // Get the user's platform details, with high entropy if available - with fallback to low
      // entropy values
      const platformDetails: {
        platformVersion?: string | null;
        mobile?: boolean | null;
      } = {
        platformVersion: null,
        mobile: null,
      };
      try {
        const navigatorDetails =
          await globalThis.navigator?.userAgentData?.getHighEntropyValues([
            'platformVersion',
            'model',
          ]);

        platformDetails.platformVersion = navigatorDetails?.platformVersion;
      } catch {
        platformDetails.platformVersion =
          globalThis.navigator.userAgentData?.platform;
      }
      platformDetails.mobile = isMobile;

      // Package it all together nicely
      const targetingParams: Playback.Targeting = {
        InStream:
          config.ads.customAds.type === 'Triton' ?
            {
              clientType: 'web',
              'device-language': globalThis.navigator.language,
              'device-osv': platformDetails.platformVersion,
              devicename: platformDetails.mobile ? 'web-mobile' : 'web-desktop',
              dist: 'iheart',
              dnt: getDoNotTrack() ? '1' : '0',
              host: config.environment.hosts.listen,
              locale: globalThis.navigator.language,
              modTime: Math.floor(Date.now() / 1000),
              profileid: String(user?.profileId),
              sessionid: String(user?.sessionId),
              'site-url': `${globalThis.window.location.protocol}//${globalThis.window.location.host}`,
              terminalid: config.environment.terminalId,
              ua: globalThis.navigator.userAgent,
              us_privacy: CCPAUserPrivacy(user?.privacy?.usPrivacy ?? ''),
              zip: user?.zipCode,
              ...AdsTargetingState.get('partnerIds'),
            }
          : {},
        PreRoll: {
          profileId: String(user?.profileId),
          locale: globalThis.navigator.language,
          deviceType: platformDetails.mobile ? 'mobile' : 'desktop',
          env: 'listen',
          visitNum: visitNumber ?? 1,
        },
        Extra: {
          partnerTokens: AdsTargetingState.get('partnerTokens'),
        },
      } as const;

      // And set it in our state and flip `ready` to true
      // ...see player.tsx for the next step in this journey
      AdsTargetingState.set('targetingParams', targetingParams);
      AdsTargetingState.set('ready', true);
    },

    getLsid() {
      return AdsTargetingState.get('lsid') ?? '';
    },
  });

export const AdsTargetingEmitter = createAdsTargetingEmitter();
