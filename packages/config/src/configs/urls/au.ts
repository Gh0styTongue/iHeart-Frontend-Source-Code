import type { Urls } from '../../schemas/urls.js';
import { base, prBase, stagingBase } from './base.js';

const productionAU: Urls = {
  ...base,
  advertise: 'https://www.iheart.com/content/advertise-en-au/',
  apps: '/apps/',
  appsMobile: 'https://www.iheart.com/apps/',
  blog: 'https://blog.iheart.com/',
  contestrules: 'https://www.iheart.com/content/contest-rules-en-au/',
  contests: 'https://www.iheartradio.com.au/competition/',
  customradio: '/artist/',
  events: 'https://www.iheart.com/content/iheartradio-events/',
  features: 'https://www.iheart.com/content/iheartradio-features/',
  forYou: '/',
  heroTheme:
    'https://leads.radioedit.iheart.com/api/cards?country=AU&collection=collections/web-homescreen',
  holidayHat:
    'https://leads.radioedit.iheart.com/api/cards?country=AU&collection=collections/holiday-hat&facets=devices/web',
  jobs: 'http://www.arn.com.au/careers/',
  news: 'https://www.iheart.com/news/',
  playlists: '/playlist/',
  upgrade: '/upgrade/',
};

const stagingAU: Urls = {
  ...productionAU,
  ...stagingBase,
};

const prAU: Urls = {
  ...productionAU,
  ...stagingBase,
  ...prBase,
};

export { prAU, productionAU, stagingAU };
