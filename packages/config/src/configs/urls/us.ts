import type { Urls } from '../../schemas/urls.js';
import { base, prBase, stagingBase } from './base.js';

const productionUS: Urls = {
  ...base,
  adChoices: 'https://www.iheart.com/adchoices/',
  advertise: 'https://www.iheartmedia.com/advertise',
  apps: 'https://iheart.onelink.me/Ff5B/GetTheApp',
  appsAuto: 'https://www.iheart.com/apps/#auto',
  appsHome: 'https://www.iheart.com/apps/#home',
  appsMobile: 'https://iheart.onelink.me/Ff5B/GetTheApp',
  appsWear: 'https://www.iheart.com/apps/#wear',
  blog: 'https://blog.iheart.com/',
  contestrules: 'https://www.iheart.com/content/general-contesting-guidelines/',
  contests: 'https://news.iheart.com/contests/',
  customradio: '/artist/',
  events: 'https://www.iheart.com/content/iheartradio-events/',
  features: 'https://www.iheart.com/content/iheartradio-features/',
  forYou: '/for-you/',
  heroTheme:
    'https://leads.radioedit.iheart.com/api/cards?country=US&collection=collections/web-homescreen',
  holidayHat:
    'https://leads.radioedit.iheart.com/api/cards?country=US&collection=collections/holiday-hat&facets=devices/web',
  jobs: 'https://www.iheartmedia.com/careers/',
  news: 'https://www.iheart.com/news/',
  ondemand: 'https://ondemand.iheart.com/',
  photos: 'https://news.iheart.com/photo/',
  playlists: '/playlist/',
  subscriptionoptions: '/offers/',
  upgrade: '/upgrade/',
};

const stagingUS: Urls = {
  ...productionUS,
  ...stagingBase,
};

const prUS: Urls = {
  ...productionUS,
  ...stagingBase,
  ...prBase,
};

export { productionUS, prUS, stagingUS };
