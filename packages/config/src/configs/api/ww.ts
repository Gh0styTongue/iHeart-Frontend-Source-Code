import type { Api } from '../../schemas/api.js';
import { ampMapping } from './amp-mapping.js';
import { radioEditMapping } from './radioedit-mapping.js';

export const stagingWW: Api = {
  apiUrl: ampMapping.staging.WW.clientEndpoint,
  amp: ampMapping.staging.WW,
  radioEdit: radioEditMapping.staging.WW,
};

export const prWW: Api = {
  apiUrl: ampMapping.pr.WW.clientEndpoint,
  amp: ampMapping.pr.WW,
  radioEdit: radioEditMapping.pr.WW,
};

export const productionWW: Api = {
  apiUrl: ampMapping.production.WW.clientEndpoint,
  amp: ampMapping.production.WW,
  radioEdit: radioEditMapping.production.WW,
};
