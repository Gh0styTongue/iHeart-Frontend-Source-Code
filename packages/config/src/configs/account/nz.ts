import type { Account } from '../../schemas/account.js';
import { KEYBOARD_NUMERIC, OAUTH_FACEBOOK, OAUTH_GOOGLE } from './constants.js';

export const baseNZ: Account = {
  phone: {
    callingCode: '64',
    digitRange: [8, 11],
  },
  registration: {
    genderAllowUnselected: false,
    genders: {
      male: { label: 'Male' },
      female: { label: 'Female' },
      unspecified: { label: 'Prefer not to say' },
    },
    oauths: [OAUTH_FACEBOOK, OAUTH_GOOGLE],
    showLoginInNav: true,
    usePostal: true,
    zipKeyboard: KEYBOARD_NUMERIC,
    zipRegex: '^\\d{4}$',
    zipStringLength: 4,
  },
};
