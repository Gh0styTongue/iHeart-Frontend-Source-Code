import type { IndexExchange } from '../../../schemas/sdks/index-exchange.js';

export const stagingCA: IndexExchange = {
  en: 'https://js-sec.indexww.com/ht/p/183816-76277476224988.js',
  fr: 'https://js-sec.indexww.com/ht/p/183816-232410431242455.js',
};

export const productionCA: IndexExchange = {
  ...stagingCA,
};
