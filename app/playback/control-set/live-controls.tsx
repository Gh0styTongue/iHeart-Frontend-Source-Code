import { breakpoints } from '@iheartradio/web.accomplice';
import type { Station } from '@iheartradio/web.playback';
import { MetadataType } from '@iheartradio/web.playback';
import { useMediaQuery } from 'usehooks-ts';

import { Presets } from '../actions/presets';
import { AddToPlaylist } from '../controls/add-to-playlist';
import { Play } from '../controls/play';
import { playback } from '../playback';

export function LiveControls({ context }: { context: Station['context'] }) {
  // Pull the station off the state and add it to props here, so that the `useIsCurrentStation`
  // hook will behave correctly for the player controls
  const { station } = playback.useState();
  const { adBreak } = playback.useAds();
  const metadata = playback.useMetadata();
  const isLargeScreen = useMediaQuery(breakpoints.large);
  const { trackId } = metadata?.data ?? {};
  const showStationNowPlaying =
    metadata && metadata.type !== MetadataType.Station;

  // Update `context` to have the correct values for the miniplayer before passing it to Play
  const playProps = {
    ...station,
    context,
  };

  return (
    <>
      <Presets isHidden={{ mobile: false, 'container-medium': true }} />
      {Number(trackId) > 0 && showStationNowPlaying ?
        <AddToPlaylist />
      : null}
      <Play {...playProps} />
      {isLargeScreen && Number(trackId) > 0 && !adBreak ?
        <div style={{ width: '4.1rem' }} />
      : null}
    </>
  );
}
