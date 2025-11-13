import type { Ads } from '../../schemas/ads.js';
import type { PartialGlobalConfig } from '../../schemas/index.js';
import AU from './au.js';
import CA from './ca.js';
import MX from './mx.js';
import NZ from './nz.js';
import US from './us.js';
import WW from './ww.js';

const GlobalAds: PartialGlobalConfig<Ads> = {
  AU,
  CA,
  MX,
  NZ,
  US,
  WW,
};

export { GlobalAds };
