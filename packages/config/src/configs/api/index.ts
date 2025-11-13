import type { Api } from '../../schemas/api.js';
import type { PartialGlobalConfig } from '../../schemas/index.js';
import { prAU, productionAU, stagingAU } from './au.js';
import { prCA, productionCA, stagingCA } from './ca.js';
import { prMX, productionMX, stagingMX } from './mx.js';
import { prNZ, productionNZ, stagingNZ } from './nz.js';
import { productionUS, prUS, stagingUS } from './us.js';
import { productionWW, prWW, stagingWW } from './ww.js';

const GlobalApi: PartialGlobalConfig<Api> = {
  AU: {
    staging: stagingAU,
    pr: prAU,
    production: productionAU,
  },
  CA: {
    staging: stagingCA,
    pr: prCA,
    production: productionCA,
  },
  MX: {
    staging: stagingMX,
    pr: prMX,
    production: productionMX,
  },
  NZ: {
    staging: stagingNZ,
    pr: prNZ,
    production: productionNZ,
  },
  US: {
    staging: stagingUS,
    pr: prUS,
    production: productionUS,
  },
  WW: {
    staging: stagingWW,
    pr: prWW,
    production: productionWW,
  },
};

export { GlobalApi };
