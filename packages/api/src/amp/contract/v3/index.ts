import { initContract } from '@ts-rest/core';

import { abtestContract } from './abtest.js';
import { adsContract } from './ads.js';
import { artistsContract } from './artists.js';
import { catalogContract } from './catalog.js';
import { collectionContract } from './collection.js';
import { livemetaContract } from './livemeta.js';
import { locationContract } from './location.js';
import { oauthContract } from './oauth.js';
import { playbackContract } from './playback.js';
import { podcastContract } from './podcast.js';
import { privacyContract } from './privacy.js';
import { profilesContract } from './profiles.js';
import { recsContract } from './recs.js';
import { searchContract } from './search.js';
import { sessionContract } from './session.js';
import { subscriptionContract } from './subscription.js';

const c = initContract();

export const v3Contract = c.router(
  {
    abtest: abtestContract,
    ads: adsContract,
    artists: artistsContract,
    catalog: catalogContract,
    collection: collectionContract,
    livemeta: livemetaContract,
    location: locationContract,
    oauth: oauthContract,
    playback: playbackContract,
    podcast: podcastContract,
    privacy: privacyContract,
    profiles: profilesContract,
    recs: recsContract,
    search: searchContract,
    session: sessionContract,
    subscription: subscriptionContract,
  },
  {
    pathPrefix: '/api/v3',
  },
);
