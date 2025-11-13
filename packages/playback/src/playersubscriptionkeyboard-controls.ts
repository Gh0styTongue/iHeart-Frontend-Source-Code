import {
  type CreateEmitter,
  createEmitter,
} from '@iheartradio/web.utilities/create-emitter';

import * as Playback from './player:types.js';

export function createKeyboardControlsSubscription<
  Station extends Playback.Station,
>(
  player: Playback.Player<Station>,
): CreateEmitter.Emitter<CreateEmitter.Subscription<Playback.Player<Station>>> {
  const subscription = createEmitter<
    CreateEmitter.Subscription<Playback.Player<Station>>
  >({
    initialize() {
      document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (
          event.target !== document.body ||
          !Object.values(Playback.Keyboard).includes(
            event.key as Playback.Keyboard,
          ) ||
          (event.key !== Playback.Keyboard.Space && !event.metaKey)
        ) {
          return;
        }

        event.preventDefault();

        const volume = player.getState().get('volume');

        switch (event.key) {
          case Playback.Keyboard.ArrowDown: {
            if (event.shiftKey) {
              player.setVolume(0);
              break;
            }

            player.setVolume(Math.max(0, volume - 10));
            break;
          }
          case Playback.Keyboard.ArrowLeft: {
            if (event.shiftKey) {
              player.rewind(15);
              break;
            }

            player.previous();
            break;
          }
          case Playback.Keyboard.ArrowRight: {
            if (event.shiftKey) {
              player.fastForward(30);
              break;
            }

            player.next();
            break;
          }
          case Playback.Keyboard.ArrowUp: {
            if (event.shiftKey) {
              player.setVolume(100);
              break;
            }

            player.setVolume(Math.min(100, volume + 10));
            break;
          }
          case Playback.Keyboard.M: {
            player.setMute();
            break;
          }
          case Playback.Keyboard.S: {
            player.setShuffle();
            break;
          }
          case Playback.Keyboard.Space: {
            player.play();
            break;
          }
          default: {
            break;
          }
        }
      });
    },
  });

  return subscription;
}
