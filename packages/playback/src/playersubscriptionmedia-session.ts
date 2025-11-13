import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';
import { isNullish } from 'remeda';

import * as Playback from './player:types.js';

export function createMediaSessionSubscription<
  Resolvers extends Playback.Resolvers<any>,
  Station extends Playback.Station,
>({
  player,
  resolvers,
}: {
  player: Playback.Player<Station>;
  resolvers: Resolvers;
}): CreateEmitter.Emitter<
  CreateEmitter.Subscription<Playback.Player<Station>>
> {
  function initialize({
    index,
    queue,
    station,
  }: Playback.PlayerState<Station>) {
    if (isNullish(navigator.mediaSession) || isNullish(station)) {
      return;
    }

    const queueItem = queue[index];

    const isEpisode = queueItem.type === Playback.QueueItemType.Episode;

    const isStream = queueItem.type === Playback.QueueItemType.Stream;

    const resolver = resolvers[station.type];

    navigator.mediaSession.setActionHandler('play', () => player.play());

    if (isStream) {
      navigator.mediaSession.setActionHandler('stop', () => player.stop);
    } else {
      navigator.mediaSession.setActionHandler('pause', player.pause);

      if (resolver.next !== undefined) {
        navigator.mediaSession.setActionHandler('nexttrack', () =>
          player.next(false),
        );
      }

      if (resolver.previous !== undefined) {
        navigator.mediaSession.setActionHandler('previoustrack', () =>
          player.previous(false),
        );
      }

      if (isEpisode) {
        navigator.mediaSession.setActionHandler('seekbackward', () =>
          player.rewind(15),
        );
        navigator.mediaSession.setActionHandler('seekforward', () =>
          player.fastForward(30),
        );
      }
    }
  }

  const subscription = createEmitter<
    CreateEmitter.Subscription<Playback.Player<Station>>
  >({
    initialize,

    load: initialize,

    setMetadata(metadata) {
      if (isNullish(navigator.mediaSession) || isNullish(metadata)) {
        return null;
      }

      navigator.mediaSession.metadata = new MediaMetadata({
        album: metadata.data.subtitle,
        artist: metadata.data.description,
        title: metadata.data.title,
        artwork: [{ src: metadata.data.image ?? '' }],
      });
    },
  });

  return subscription;
}
