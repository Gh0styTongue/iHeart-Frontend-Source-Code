import type { Account } from '../../schemas/account.js';
import { KEYBOARD_NUMERIC, OAUTH_FACEBOOK, OAUTH_GOOGLE } from './constants.js';

export const baseUS: Account = {
  phone: {
    callingCode: '1',
    format: '(ddd) ddd - dddd',
  },
  registration: {
    emailUpdatesDefaultUnchecked: false,
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
    zipRegex: '^\\d{5}$',
    zipStringLength: 5,
  },
};
