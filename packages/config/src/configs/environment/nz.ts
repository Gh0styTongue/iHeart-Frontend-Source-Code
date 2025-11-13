import type { Environment } from '../../schemas/environment.js';
import {
  PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  SUPPORTED_COUNTRIES,
} from './constants.js';

export const stagingNZ: Environment = {
  countryCode: 'NZ',
  hostName: 'webapp.NZ',
  hosts: {
    account: 'account.web.nz',
    listen: 'listen.web.nz',
  },
  locale: 'en-NZ',
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
  terminalId: 162,
  territoryCode: 'NZ',
  websiteUrl: 'https://stage.iheart.com',
};

export const productionNZ: Environment = {
  ...stagingNZ,
  objectDbBucket: 'web.listen.prod',
  websiteUrl: 'https://www.iheart.com',
};

export const pullRequestNZ: Environment = {
  ...productionNZ,
  objectDbBucket: 'web.listen.staging',
};
