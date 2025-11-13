import type { App } from '../../schemas/app.js';
import type { PartialGlobalConfig } from '../../schemas/index.js';
import AU from './au.js';
import CA from './ca.js';
import MX from './mx.js';
import NZ from './nz.js';
import US from './us.js';
import WW from './ww.js';

const GlobalApp: PartialGlobalConfig<App> = {
  AU,
  CA,
  MX,
  NZ,
  US,
  WW,
};

export { GlobalApp };
