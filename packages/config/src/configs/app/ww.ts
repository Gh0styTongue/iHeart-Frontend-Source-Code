import type { App } from '../../schemas/app.js';
import { base } from './base.js';

const production: App = {
  ...base,
};

const staging: App = {
  ...base,
};

const pr: App = {
  ...base,
};

export default {
  production,
  staging,
  pr,
};
