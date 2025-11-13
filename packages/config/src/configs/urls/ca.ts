import type { Urls } from '../../schemas/urls.js';
import { base, prBase, stagingBase } from './base.js';

const productionCA: Urls = {
  ...base,
  apps: '/apps/',
  appsMobile: 'https://www.iheartradio.ca/en/download-the-app.html',
  // // once we implement internationalization, use this:
  // appsMobile: {
  //   en: 'https://www.iheartradio.ca/en/download-the-app.html',
  //   fr: 'https://www.iheartradio.ca/fr/telechargez-l-app.html',
  // },
  contests: 'https://www.iheartradio.ca/en/contests.html',
  customradio: '/artist/',
  events: 'https://www.iheartradio.ca/en/events.html',
  features: 'https://www.iheartradio.ca/en/features.html',
  forYou: '/',
  helpVerifyingEmail: 'https://www.iheartradio.com/help-verifying-email',
  heroTheme:
    'https://leads.radioedit.iheart.com/api/cards?country=CA&collection=collections/web-homescreen',
  holidayHat:
    'https://leads.radioedit.iheart.com/api/cards?country=CA&collection=collections/holiday-hat&facets=devices/web',
  news: 'https://www.iheartradio.ca/en/music-news.html',
  playlists: '/playlist/',
};

const stagingCA: Urls = {
  ...productionCA,
  ...stagingBase,
};

const prCA: Urls = {
  ...productionCA,
  ...stagingBase,
  ...prBase,
};

export { prCA, productionCA, stagingCA };
