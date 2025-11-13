import type { Account } from '../../schemas/account.js';
import type { PartialGlobalConfig } from '../../schemas/index.js';
import { baseAU } from './au.js';
import { baseCA } from './ca.js';
import { baseMX } from './mx.js';
import { baseNZ } from './nz.js';
import { baseUS } from './us.js';
import { baseWW } from './ww.js';

export const GlobalAccount: PartialGlobalConfig<Account> = {
  AU: {
    staging: baseAU,
    pr: baseAU,
    production: baseAU,
  },
  CA: {
    staging: baseCA,
    pr: baseCA,
    production: baseCA,
  },
  MX: {
    staging: baseMX,
    pr: baseMX,
    production: baseMX,
  },
  NZ: {
    staging: baseNZ,
    pr: baseNZ,
    production: baseNZ,
  },
  US: {
    staging: baseUS,
    pr: baseUS,
    production: baseUS,
  },
  WW: {
    staging: baseWW,
    pr: baseWW,
    production: baseWW,
  },
};
