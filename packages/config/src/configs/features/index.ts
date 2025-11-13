import type { Features } from '../../schemas/features.js';
import type { PartialGlobalConfig } from '../../schemas/index.js';
import { featuresBase } from './base.js';

export const GlobalFeatures: PartialGlobalConfig<Features> = {
  AU: {
    staging: featuresBase,
    pr: featuresBase,
    production: { ...featuresBase, showRankers: false },
  },
  CA: {
    staging: featuresBase,
    pr: featuresBase,
    production: { ...featuresBase, showRankers: false },
  },
  MX: {
    staging: featuresBase,
    pr: featuresBase,
    production: { ...featuresBase, showRankers: false },
  },
  NZ: {
    staging: featuresBase,
    pr: featuresBase,
    production: { ...featuresBase, showRankers: false },
  },
  US: {
    staging: featuresBase,
    pr: featuresBase,
    production: { ...featuresBase, showRankers: false },
  },
  WW: {
    staging: featuresBase,
    pr: featuresBase,
    production: { ...featuresBase, showRankers: false },
  },
};
