import type { Api } from '../../schemas/api.js';
import { ampMapping } from './amp-mapping.js';
import { radioEditMapping } from './radioedit-mapping.js';

export const stagingCA: Api = {
  apiUrl: ampMapping.staging.CA.clientEndpoint,
  amp: ampMapping.staging.CA,
  radioEdit: radioEditMapping.staging.CA,
};

export const prCA: Api = {
  apiUrl: ampMapping.pr.CA.clientEndpoint,
  amp: ampMapping.pr.CA,
  radioEdit: radioEditMapping.pr.CA,
};

export const productionCA: Api = {
  apiUrl: ampMapping.production.CA.clientEndpoint,
  amp: ampMapping.production.CA,
  radioEdit: radioEditMapping.production.CA,
};
