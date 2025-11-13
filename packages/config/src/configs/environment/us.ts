import type { Environment } from '../../schemas/environment.js';
import {
  PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  SUPPORTED_COUNTRIES,
} from './constants.js';

export const stagingUS: Environment = {
  countryCode: 'US',
  hostName: 'webapp.US',
  hosts: {
    account: 'account.web.us',
    listen: 'listen.web.us',
  },
  locale: 'en-US',
  markPlayedThreshold: 30,
  minimumAgeToJoin: 14,
  objectDbBucket: 'web.listen.staging',
  presetPopoverDisplayFrequency: PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  presetPopoverMaxTimesDismissed: 3,
  registrationOptions: {
    zipRegex: '^\\d{5}$',
    zipKeyboard: 'numeric',
  },
  supportedCountries: SUPPORTED_COUNTRIES,
  terminalId: 159,
  territoryCode: 'US',
  websiteUrl: 'https://stage.iheart.com',
};

export const productionUS: Environment = {
  ...stagingUS,
  objectDbBucket: 'web.listen.prod',
  websiteUrl: 'https://www.iheart.com',
};

export const pullRequestUS: Environment = {
  ...productionUS,
  objectDbBucket: 'web.listen.staging',
};
