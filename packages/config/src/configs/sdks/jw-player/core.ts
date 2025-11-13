import type { JWP } from '../../../schemas/sdks/jw-player.js';

export const staging: JWP = {
  script: 'https://cdn.jwplayer.com/libraries/torYVEgE.js',
};

export const production: JWP = {
  ...staging,
};
