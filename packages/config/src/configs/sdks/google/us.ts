import type {
  GoogleAnalytics,
  GoogleCast,
  GoogleFirebase,
  GooglePlus,
  GoogleRecaptcha,
} from '../../../schemas/sdks/google.js';

export const stagingUS: {
  googleAnalytics: GoogleAnalytics;
  googleCast: GoogleCast;
  googleFirebase: GoogleFirebase;
  googlePlus: GooglePlus;
  googleRecaptcha: GoogleRecaptcha;
} = {
  googleAnalytics: {
    account: 'UA-32316039-1',
    domain: 'iheart.com',
    enabled: true,
    threshold: 100,
  },
  googleCast: {
    appKey: '2A967391',
    enabled: true,
    threshold: 100,
  },
  googleFirebase: {
    account: 'G-441TYTQYC2',
  },
  googlePlus: {
    appKey:
      '884160514548-i6joibuah51bb7vn6oilf929i1pnk6je.apps.googleusercontent.com',
    token: 'Rn2kVwSbumXsAjkVuEKfo1DO',
    enabled: true,
    threshold: 100,
  },
  googleRecaptcha: {
    sitekey: '6LfX7h0hAAAAAAmgUJQklpiLcrSQjUPo4KDNIxzb',
    v3SiteKey: '6Lfwn9QoAAAAAEJw4pOL9-aCrFUCof7SNsNfCv9s',
    enterpriseRecaptchaApiKey: 'AIzaSyBNPvYyyXVkJLh1ASmsz92uBWiTb4h6u10',
  },
};

export const productionUS: {
  googleAnalytics: GoogleAnalytics;
  googleCast: GoogleCast;
  googleFirebase: GoogleFirebase;
  googlePlus: GooglePlus;
  googleRecaptcha: GoogleRecaptcha;
} = {
  googleAnalytics: {
    account: 'UA-32316039-1',
    domain: 'iheart.com',
    enabled: true,
    threshold: 100,
  },
  googleCast: {
    appKey: '7F8E0EF3',
    enabled: true,
    threshold: 100,
  },
  googleFirebase: {
    account: 'G-441TYTQYC2',
  },
  googlePlus: {
    appKey:
      '884160514548-4917aophkpafpbgh8r1lndhc3f128ouf.apps.googleusercontent.com',
    token: 'BzajEH6qKu44CgUUszHza2Yc',
    enabled: true,
    threshold: 100,
  },
  googleRecaptcha: {
    sitekey: '6LfX7h0hAAAAAAmgUJQklpiLcrSQjUPo4KDNIxzb',
    v3SiteKey: '6Lfwn9QoAAAAAEJw4pOL9-aCrFUCof7SNsNfCv9s',
    enterpriseRecaptchaApiKey: 'AIzaSyBNPvYyyXVkJLh1ASmsz92uBWiTb4h6u10',
  },
};
