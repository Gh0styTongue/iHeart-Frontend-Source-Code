import type { Environment } from '../../schemas/environment.js';
import {
  PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  SUPPORTED_COUNTRIES,
} from './constants.js';

export const stagingAU: Environment = {
  countryCode: 'AU',
  hostName: 'webapp.AU',
  hosts: {
    account: 'account.web.au',
    listen: 'listen.web.au',
  },
  locale: 'en-AU',
  markPlayedThreshold: 30,
  minimumAgeToJoin: 0, // TODO: Check what this should actually be
  objectDbBucket: 'web.listen.staging',
  presetPopoverDisplayFrequency: PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  presetPopoverMaxTimesDismissed: 3,
  registrationOptions: {
    zipRegex: '^\\d{4}$',
    usePostal: true,
    zipKeyboard: 'numeric',
  },
  supportedCountries: SUPPORTED_COUNTRIES,
  terminalId: 161,
  territoryCode: 'AU',
  websiteUrl: 'https://stage.iheart.com',
};

export const productionAU: Environment = {
  ...stagingAU,
  objectDbBucket: 'web.listen.prod',
  websiteUrl: 'https://www.iheart.com',
};

export const pullRequestAU: Environment = {
  ...productionAU,
  objectDbBucket: 'web.listen.staging',
};
