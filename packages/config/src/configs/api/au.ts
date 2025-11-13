import type { Api } from '../../schemas/api.js';
import { ampMapping } from './amp-mapping.js';
import { radioEditMapping } from './radioedit-mapping.js';

export const stagingAU: Api = {
  apiUrl: ampMapping.staging.AU.clientEndpoint,
  amp: ampMapping.staging.AU,
  radioEdit: radioEditMapping.staging.AU,
};

export const productionAU: Api = {
  apiUrl: ampMapping.production.AU.clientEndpoint,
  amp: ampMapping.production.AU,
  radioEdit: radioEditMapping.production.AU,
};

export const prAU: Api = {
  apiUrl: ampMapping.pr.AU.clientEndpoint,
  amp: ampMapping.pr.AU,
  radioEdit: radioEditMapping.pr.AU,
};
