import {
  base64UrlCodec,
  jsonCodec,
  pipeCodecs,
  stringNormalizeCodec,
  uriCodec,
} from '@iheartradio/web.utilities/codec';

import type {
  AnalyticsLocationType,
  PRESETS_EVENTS,
} from '~app/utilities/constants';

export type ContextLocation =
  | (typeof PRESETS_EVENTS)[keyof typeof PRESETS_EVENTS]
  | AnalyticsLocationType
  | 'header'
  | 'reg_button'
  | 'edit_icon'
  | 'library'
  | 'lyrics'
  | 'favorites_radio';

interface BaseAnalyticsContext {
  pageName: string;
  trigger: string;
  location?: ContextLocation;
  origin: string;
}

interface ContextWithAsset extends BaseAnalyticsContext {
  assetId: string;
  assetName: string;
  stationId?: string;
  stationName?: string;
  stationSubId?: string;
  stationSubName?: string;
}

export type RegGateContext = BaseAnalyticsContext | ContextWithAsset;

export const analyticsContextCodec = pipeCodecs<RegGateContext>(
  jsonCodec,
  stringNormalizeCodec,
  base64UrlCodec,
  uriCodec,
);
