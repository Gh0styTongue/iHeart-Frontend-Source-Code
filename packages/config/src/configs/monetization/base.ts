import type { Ads } from '../../schemas/ads.js';

export const base: Ads = {
  flags: {
    display: true,
    playback: true,
  },
  customAds: {
    enabled: true,
    partnerIds: 'https://yield-op-idsync.live.streamtheworld.com/partnerIds',
    tritonScript:
      'https://playerservices.live.streamtheworld.com/api/idsync.js?stationId=339593',
  },
  adInterval: 60_000,
  headerBidding: {
    enabledBidders: ['moat'],
  },
};
