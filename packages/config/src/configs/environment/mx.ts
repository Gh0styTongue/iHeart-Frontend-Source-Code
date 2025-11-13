import type { Environment } from '../../schemas/environment.js';
import {
  PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  SUPPORTED_COUNTRIES,
} from './constants.js';

export const stagingMX: Environment = {
  countryCode: 'MX',
  hostName: 'webapp.MX',
  hosts: {
    account: 'account.web.mx',
    listen: 'listen.web.mx',
  },
  locale: 'es-MX',
  markPlayedThreshold: 30,
  minimumAgeToJoin: 0, // TODO: Check what this should actually be
  objectDbBucket: 'web.listen.staging',
  presetPopoverDisplayFrequency: PRESET_POPOVER_DISPLAY_FREQUENCY_DAYS,
  presetPopoverMaxTimesDismissed: 3,
  registrationOptions: {
    zipRegex: '^\\d{5}$',
    zipKeyboard: 'numeric',
    usePostal: true,
  },
  supportedCountries: SUPPORTED_COUNTRIES,
  terminalId: 164,
  territoryCode: 'MX',
  websiteUrl: 'https://stage.iheart.com',
};

export const productionMX: Environment = {
  ...stagingMX,
  objectDbBucket: 'web.listen.prod',
  websiteUrl: 'https://www.iheart.com',
};

export const pullRequestMX: Environment = {
  ...productionMX,
  objectDbBucket: 'web.listen.staging',
};
