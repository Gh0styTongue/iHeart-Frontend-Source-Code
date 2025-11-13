import { initContract } from '@ts-rest/core';

import { accountContract } from './account.js';
import { catalogContract } from './catalog.js';
import { liveRadioContract } from './live-radio.js';
import { profileContract } from './profile.js';
import { recsContract } from './recs.js';
import { subscriptionContract } from './subscription.js';
import { t3Contract } from './t3.js';

const c = initContract();

export const v1Contract = c.router(
  {
    account: accountContract,
    catalog: catalogContract,
    liveRadio: liveRadioContract,
    profile: profileContract,
    recs: recsContract,
    subscription: subscriptionContract,
    t3: t3Contract,
  },
  {
    pathPrefix: '/api/v1',
  },
);
