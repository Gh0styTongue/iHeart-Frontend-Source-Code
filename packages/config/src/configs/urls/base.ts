import type { Urls } from '../../schemas/urls.js';

export const base: Urls = {
  about: '/about/',
  account: 'https://account.iheart.com',
  adChoices: 'https://www.iheart.com/adchoices',
  advertise: 'https://www.iheartmedia.com/advertise',
  brand: 'https://brand.iheart.com/',
  content: 'https://www.iheart.com/content/',
  embeddedNews: 'https://news.iheart.com',
  getTheAppLink: 'https://iheart.onelink.me/Ff5B/GetTheApp',
  help: 'https://www.iheart.com/help',
  helpResettingPassword: 'https://www.iheartradio.com/help-resetting-password',
  helpSkipLimit: 'https://www.iheartradio.com/help-skip-limit',
  helpSocialSignIn: 'https://www.iheartradio.com/help-social-sign-in',
  home: '/',
  iglooUrl: 'https://us-events.api.iheart.com/events',
  listen: 'https://www.iheart.com',
  liveradio: '/live/',
  mymusic: '/my/music/',
  mystations: '/my/stations/',
  playlistDirectoryMain: 'https://leads.radioedit.iheart.com/api/cards?',
  podcasts: '/podcast/',
  privacy: 'https://www.iheart.com/privacy/',
  terms: 'https://www.iheart.com/terms/',
  optout: 'https://privacy.iheart.com/',
  social: {
    facebook: 'https://www.facebook.com/iheartradio',
    twitter: 'https://x.com/iHeartRadio',
    instagram: 'https://www.instagram.com/iHeartRadio/',
    threads: 'https://www.threads.com/iHeartRadio/',
    tiktok: 'https://www.tiktok.com/@iheartradio?lang=en',
    youtube: 'https://www.youtube.com/user/iHeartRadio',
  },
  tlnkApps:
    'https://iheartradio.tlnk.io/serve?action=click&campaign_id_android=390639&campaign_id_ios=390625&campaign_id_web=430712&destination_id_android=305483&destination_id_ios=305471&my_campaign=GetTheApp&publisher_id=351677&site_id_android=112521&site_id_ios=112517&site_id_web=136022&url_web=https://www.iheart.com/apps',
  yourLibrary: '/your-library/',
};

export const stagingBase: Urls = {
  account: 'https://staging.account.iheart.com',
  listen: 'https://staging.listen.iheart.com',
  iglooUrl: 'https://us-stg-events.api.iheart.com/events',
};

export const prBase: Urls = {};
