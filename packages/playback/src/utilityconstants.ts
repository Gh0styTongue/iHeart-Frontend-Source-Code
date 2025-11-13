import ms from 'ms';

export const GAM_VAST_BASE_URL =
  'https://securepubads.g.doubleclick.net/gampad/ads';
export const TRITON_VAST_BASE_URL =
  'https://crdl.tritondigital.com/api/ads/delivery';

export const DEFAULT_PREROLL_PARAMS = {
  ad_type: 'audio_video',
  ciu_szs: '300x250',
  env: 'instream',
  gdfp_req: '1',
  impl: 's',
  output: 'vast',
  plcmt: '1',
  sz: '640x480',
  unviewed_position_start: '1',
  url: 'referrer_url',
} as const;

export const CUSTOM_ADS_INTERVAL = ms('15m');
export const CUSTOM_ADS_DELAY = ms('10m');
export const LIVE_ADS_INTERVAL = ms('10m');

export const COMPANION_CLICK_THROUGH_URL_CLASS = 'companion-click-through-url';

export const MARK_AS_PLAYED_ACTION = 'MARK_AS_PLAYED_ACTION';
export const MARK_AS_UNPLAYED_ACTION = 'MARK_AS_UNPLAYED_ACTION';
