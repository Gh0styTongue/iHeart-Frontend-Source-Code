import type { Api } from '../../schemas/api.js';
import { ampMapping } from './amp-mapping.js';
import { radioEditMapping } from './radioedit-mapping.js';

export const stagingMX: Api = {
  apiUrl: ampMapping.staging.MX.clientEndpoint,
  amp: ampMapping.staging.MX,
  radioEdit: radioEditMapping.staging.MX,
};

export const prMX: Api = {
  apiUrl: ampMapping.pr.MX.clientEndpoint,
  amp: ampMapping.pr.MX,
  radioEdit: radioEditMapping.pr.MX,
};

export const productionMX: Api = {
  apiUrl: ampMapping.production.MX.clientEndpoint,
  amp: ampMapping.production.MX,
  radioEdit: radioEditMapping.production.MX,
};
