import { breakpoints } from '@iheartradio/web.accomplice';
import type { Station } from '@iheartradio/web.playback';
import { useMediaQuery } from 'usehooks-ts';

import { Presets } from '../actions/presets';
import { AddToPlaylist } from '../controls/add-to-playlist';
import { Next } from '../controls/next';
import { Play } from '../controls/play';
import { Previous } from '../controls/previous';
import { playback } from '../playback';

export function TopSongsControls({ context }: { context: Station['context'] }) {
  // Pull the station off the state and add it to props here, so that the `useIsCurrentStation`
  // hook will behave correctly for the player controls
  const { station } = playback.useState();
  const { adBreak } = playback.useAds();
  const isLargeScreen = useMediaQuery(breakpoints.large);
  const metadata = playback.useMetadata();
  const { id } = metadata?.data ?? {};

  // Update `context` to have the correct values for the miniplayer before passing it to Play
  const playProps = {
    ...station,
    context,
  };

  return (
    <>
      {Number(id) > 0 ?
        <AddToPlaylist />
      : null}
      <Previous isInMiniplayer />
      <Presets isHidden={{ mobile: false, 'container-medium': true }} />
      <Play {...playProps} isControlSet />
      <Next isInMiniplayer />
      {isLargeScreen && !adBreak ?
        <div style={{ width: '4.1rem' }} />
      : null}
    </>
  );
}
