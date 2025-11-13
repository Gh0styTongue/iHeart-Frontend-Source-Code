import type { Station } from '@iheartradio/web.playback';

import { Presets } from '../actions/presets';
import { Back15 } from '../controls/back-15';
import { Forward30 } from '../controls/forward-30';
import { Next } from '../controls/next';
import { Play } from '../controls/play';
import { Previous } from '../controls/previous';
import { playback } from '../playback';

export function PodcastControls({ context }: { context: Station['context'] }) {
  // Pull the station off the state and add it to props here, so that the `useIsCurrentStation`
  // hook will behave correctly for the player controls
  const { station } = playback.useState();

  // Update `context` to have the correct values for the miniplayer before passing it to Play
  const playProps = {
    ...station,
    context,
  };

  return (
    <>
      <Previous isInMiniplayer />
      <Back15 isInMiniplayer />
      <Presets isHidden={{ mobile: false, 'container-medium': true }} />
      <Play {...playProps} />
      <Forward30 isInMiniplayer />
      <Next isInMiniplayer />
    </>
  );
}
