import type { Api } from '../../schemas/api.js';
import { ampMapping } from './amp-mapping.js';
import { radioEditMapping } from './radioedit-mapping.js';

export const stagingNZ: Api = {
  apiUrl: ampMapping.staging.NZ.clientEndpoint,
  amp: ampMapping.staging.NZ,
  radioEdit: radioEditMapping.staging.NZ,
};

export const prNZ: Api = {
  apiUrl: ampMapping.pr.NZ.clientEndpoint,
  amp: ampMapping.pr.NZ,
  radioEdit: radioEditMapping.pr.NZ,
};

export const productionNZ: Api = {
  apiUrl: ampMapping.production.NZ.clientEndpoint,
  amp: ampMapping.production.NZ,
  radioEdit: radioEditMapping.production.NZ,
};
