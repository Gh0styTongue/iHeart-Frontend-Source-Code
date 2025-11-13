import type { Urls } from '../../schemas/urls.js';
import { prBase, stagingBase } from './base.js';

const productionWW: Urls = {
  about: 'https://news.iheart.com/about/',
  content: 'https://www.iheart.com/content/',
  getTheAppLink: 'https://iheart.onelink.me/Ff5B/GetTheApp',
  help: '/help/',
  heroTheme:
    'https://leads.radioedit.iheart.com/api/cards?country=WW&collection=collections/web-homescreen',
  holidayHat:
    'https://leads.radioedit.iheart.com/api/cards?country=WW&collection=collections/holiday-hat&facets=devices/web',
  iglooUrl: 'https://us-events.api.iheart.com',
  news: 'https://www.iheart.com/news/',
  podcasts: '/podcast/',
  privacy: '/privacy/',
  terms: '/terms/',
  tlnkApps:
    'https://iheartradio.tlnk.io/serve?action=click&campaign_id_android=390639&campaign_id_ios=390625&campaign_id_web=430712&destination_id_android=305483&destination_id_ios=305471&my_campaign=GetTheApp&publisher_id=351677&site_id_android=112521&site_id_ios=112517&site_id_web=136022&url_web=https://www.iheart.com/apps',
  yourLibrary: '/your-library/',
};

const stagingWW: Urls = {
  ...productionWW,
  ...stagingBase,
};

const prWW: Urls = {
  ...productionWW,
  ...stagingBase,
  ...prBase,
};

export { productionWW, prWW, stagingWW };
