import type { Environment } from '../../schemas/environment.js';
import type { PartialGlobalConfig } from '../../schemas/index.js';
import { productionAU, pullRequestAU, stagingAU } from './au.js';
import { productionCA, pullRequestCA, stagingCA } from './ca.js';
import { productionMX, pullRequestMX, stagingMX } from './mx.js';
import { productionNZ, pullRequestNZ, stagingNZ } from './nz.js';
import { productionUS, pullRequestUS, stagingUS } from './us.js';
import { productionWW, pullRequestWW, stagingWW } from './ww.js';

const GlobalEnvironment: PartialGlobalConfig<Environment> = {
  AU: {
    staging: stagingAU,
    pr: pullRequestAU,
    production: productionAU,
  },
  CA: {
    staging: stagingCA,
    pr: pullRequestCA,
    production: productionCA,
  },
  MX: {
    staging: stagingMX,
    pr: pullRequestMX,
    production: productionMX,
  },
  NZ: {
    staging: stagingNZ,
    pr: pullRequestNZ,
    production: productionNZ,
  },
  US: {
    staging: stagingUS,
    pr: pullRequestUS,
    production: productionUS,
  },
  WW: {
    staging: stagingWW,
    pr: pullRequestWW,
    production: productionWW,
  },
};

export { GlobalEnvironment };
