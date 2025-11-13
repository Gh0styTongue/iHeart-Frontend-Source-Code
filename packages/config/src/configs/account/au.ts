import type { Account } from '../../schemas/account.js';
import { KEYBOARD_NUMERIC, OAUTH_FACEBOOK, OAUTH_GOOGLE } from './constants.js';

export const baseAU: Account = {
  phone: {
    callingCode: '61',
    format: '(d) dddd - dddd',
  },
  registration: {
    genderAllowUnselected: false,
    genders: {
      male: { label: 'Male' },
      female: { label: 'Female' },
      unspecified: { label: 'Prefer not to say' },
    },
    oauths: [OAUTH_GOOGLE, OAUTH_FACEBOOK],
    showLoginInNav: true,
    usePostal: true,
    zipKeyboard: KEYBOARD_NUMERIC,
    zipRegex: '^\\d{4}$',
    zipStringLength: 4,
  },
};
