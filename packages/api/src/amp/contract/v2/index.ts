import { initContract } from '@ts-rest/core';

import { contentContract } from './content.js';
import { playbackContract } from './playback.js';
import { playlistsContract } from './playlists.js';
import { profileContract } from './profile.js';
import { recsContract } from './recs.js';
import { tasteContract } from './taste.js';

const c = initContract();

export const v2Contract = c.router(
  {
    content: contentContract,
    playback: playbackContract,
    playlists: playlistsContract,
    profile: profileContract,
    recs: recsContract,
    taste: tasteContract,
  },
  {
    pathPrefix: '/api/v2',
  },
);
