import type { Urls } from '../../schemas/urls.js';
import { base, prBase, stagingBase } from './base.js';

const productionNZ: Urls = {
  ...base,
  advertise: 'https://www.iheartradio.net.nz/advertise/',
  apps: '/apps/',
  appsMobile: 'https://www.iheart.com/apps/',
  blog: 'https://blog.iheart.com/',
  contests: 'https://www.iheartradio.net.nz/win/',
  customradio: '/artist/',
  features: 'https://www.iheartradio.net.nz/whats-on',
  forYou: '/',
  heroTheme:
    'https://leads.radioedit.iheart.com/api/cards?country=NZ&collection=collections/web-homescreen',
  holidayHat:
    'https://leads.radioedit.iheart.com/api/cards?country=NZ&collection=collections/holiday-hat&facets=devices/web',
  news: 'https://www.iheart.com/news/',
  playlists: '/playlist/',
  upgrade: '/upgrade/',
};

const stagingNZ = {
  ...productionNZ,
  ...stagingBase,
};

const prNZ = {
  ...productionNZ,
  ...stagingBase,
  ...prBase,
};

export { prNZ, productionNZ, stagingNZ };
