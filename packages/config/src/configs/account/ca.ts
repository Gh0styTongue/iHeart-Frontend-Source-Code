import type { Account } from '../../schemas/account.js';
import {
  KEYBOARD_ALPHANUMERIC,
  OAUTH_FACEBOOK,
  OAUTH_GOOGLE,
} from './constants.js';

export const baseCA: Account = {
  phone: {
    callingCode: '1',
    format: '(ddd) ddd - dddd',
  },
  registration: {
    emailUpdatesDefaultUnchecked: true,
    genderAllowUnselected: false,
    genders: {
      male: { label: 'Male' },
      female: { label: 'Female' },
      unspecified: { label: 'Prefer not to say' },
    },
    oauths: [OAUTH_FACEBOOK, OAUTH_GOOGLE],
    showLoginInNav: true,
    usePostal: true,
    zipKeyboard: KEYBOARD_ALPHANUMERIC,
    zipRegex:
      '^(?!.*[DFIOQUdfioqu])[a-vxyA-VXY][0-9][a-zA-Z]([ ]?[0-9][a-zA-Z][0-9])?$',
    zipStringLength: 7,
  },
};
