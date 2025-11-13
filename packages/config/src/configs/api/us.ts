import type { Api } from '../../schemas/api.js';
import { ampMapping } from './amp-mapping.js';
import { radioEditMapping } from './radioedit-mapping.js';

export const stagingUS: Api = {
  apiUrl: ampMapping.staging.US.clientEndpoint,
  amp: ampMapping.staging.US,
  radioEdit: radioEditMapping.staging.US,
};

export const prUS: Api = {
  apiUrl: ampMapping.pr.US.clientEndpoint,
  amp: ampMapping.pr.US,
  radioEdit: radioEditMapping.pr.US,
};

export const productionUS: Api = {
  apiUrl: ampMapping.production.US.clientEndpoint,
  amp: ampMapping.production.US,
  radioEdit: radioEditMapping.production.US,
};
