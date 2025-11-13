import type { IAS } from '../../../schemas/sdks/ias.js';

export const staging: IAS = {
  enabled: true,
  library: 'https://static.adsafeprotected.com/vans-adapter-google-ima.js',
  anID: 931_667,
};

export const production: IAS = {
  ...staging,
};
