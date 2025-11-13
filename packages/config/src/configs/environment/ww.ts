import type { Environment } from '../../schemas/environment.js';
import {
  PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  SUPPORTED_COUNTRIES,
} from './constants.js';

export const stagingWW: Environment = {
  countryCode: 'WW',
  hostName: 'webapp.WW',
  hosts: {
    account: 'account.web.ww',
    listen: 'listen.web.ww',
  },
  locale: 'en-US',
  markPlayedThreshold: 30,
  minimumAgeToJoin: Number.MAX_SAFE_INTEGER, // Because we don't allow sign-ups from WW
  objectDbBucket: 'web.listen.staging',
  presetPopoverDisplayFrequency: PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  presetPopoverMaxTimesDismissed: 3,
  supportedCountries: SUPPORTED_COUNTRIES,
  terminalId: 165,
  territoryCode: 'WW',
  websiteUrl: 'https://stage.iheart.com',
};

export const productionWW: Environment = {
  ...stagingWW,
  objectDbBucket: 'web.listen.prod',
  websiteUrl: 'https://www.iheart.com',
};

export const pullRequestWW: Environment = {
  ...productionWW,
  objectDbBucket: 'web.listen.staging',
};
