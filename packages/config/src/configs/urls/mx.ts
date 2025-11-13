import type { Urls } from '../../schemas/urls.js';
import { base, prBase, stagingBase } from './base.js';

const productionMX: Urls = {
  ...base,
  advertise: 'https://www.iheartradio.mx/advertise-with-us/',
  apps: 'https://www.iheart.com/apps/',
  appsAuto: 'https://www.iheartradio.mx/apps-auto/',
  appsMobile: 'https://www.iheart.com/apps/',
  contestrules: 'https://www.iheartradio.mx/competition-terms-conditions/',
  contests: 'https://www.iheartradio.mx/contests/',
  events: 'https://www.iheartradio.mx/events/',
  forYou: '/',
  heroTheme:
    'https://leads.radioedit.iheart.com/api/cards?country=MX&collection=collections/web-homescreen',
  holidayHat:
    'https://leads.radioedit.iheart.com/api/cards?country=MX&collection=collections/holiday-hat&facets=devices/web',
  jobs: 'https://grupoacir.com.mx/trabaja/',
  news: 'https://www.iheartradio.mx/news',
};

const stagingMX: Urls = {
  ...productionMX,
  ...stagingBase,
};

const prMX: Urls = {
  ...productionMX,
  ...stagingBase,
  ...prBase,
};

export { prMX, productionMX, stagingMX };
