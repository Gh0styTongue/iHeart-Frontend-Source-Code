import type { Environment } from '../../schemas/environment.js';
import {
  PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  SUPPORTED_COUNTRIES,
} from './constants.js';

export const stagingCA: Environment = {
  countryCode: 'CA',
  hostName: 'webapp.CA',
  hosts: {
    account: 'account.web.ca',
    listen: 'listen.web.ca',
  },
  locale: 'en-CA',
  markPlayedThreshold: 30,
  minimumAgeToJoin: 15,
  objectDbBucket: 'web.listen.staging',
  presetPopoverDisplayFrequency: PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  presetPopoverMaxTimesDismissed: 3,
  registrationOptions: {
    zipRegex:
      '^(?!.*[DFIOQUdfioqu])[a-vxyA-VXY][0-9][a-zA-Z]([ ]?[0-9][a-zA-Z][0-9])?$',
    zipKeyboard: 'alphanumeric',
    usePostal: true,
  },
  supportedCountries: SUPPORTED_COUNTRIES,
  terminalId: 163,
  territoryCode: 'CA',
  websiteUrl: 'https://stage.iheart.com',
};

export const productionCA: Environment = {
  ...stagingCA,
  objectDbBucket: 'web.listen.prod',
  websiteUrl: 'https://www.iheart.com',
};

export const pullRequestCA: Environment = {
  ...productionCA,
  objectDbBucket: 'web.listen.staging',
};
