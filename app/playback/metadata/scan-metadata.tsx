import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Link } from '@iheartradio/web.accomplice/components/link';
import {
  PlayerDescription,
  PlayerSubtitle,
  PlayerTitle,
} from '@iheartradio/web.accomplice/components/player';
import { isEmpty, isNullish } from 'remeda';

import { useIsTouch } from '~app/hooks/use-is-touch';
import {
  buildArtistUrl,
  buildLiveUrl,
  buildSongUrl,
} from '~app/utilities/urls';

import { Thumbs } from '../controls/thumbs';
import { playback } from '../playback';

export function ScanMetadata() {
  const metadata = playback.useMetadata();
  const { station } = playback.useState();
  const isTouch = useIsTouch();

  if (isNullish(station) || isNullish(metadata)) {
    return null;
  }

  const {
    artistId,
    artistName,
    description,
    id,
    name,
    subtitle,
    title,
    trackId,
  } = metadata.data;

  const liveStationUrl =
    [id, name].every(v => !isEmpty(v)) ? buildLiveUrl({ id, name }) : null;
  const songUrl =
    [artistId, artistName, trackId, title].every(v => !isEmpty(v)) ?
      buildSongUrl({
        artist: { id: artistId, name: artistName },
        track: { id: trackId, name: title as string },
      })
    : null;
  const artistUrl =
    [artistId, artistName].every(v => !isEmpty(v)) ?
      buildArtistUrl({ id: artistId, name: artistName })
    : null;

  return (
    <>
      <Flex direction="column" gap="$2" gridArea="text" minWidth="10rem">
        <PlayerSubtitle>
          {!isTouch && songUrl ?
            <Link data-test="subtitle-link" href={songUrl} underline="hover">
              {title}
            </Link>
          : title}
        </PlayerSubtitle>
        <PlayerTitle>
          {!isTouch && liveStationUrl ?
            <Link
              data-test="title-link"
              href={liveStationUrl}
              underline="hover"
            >
              {subtitle}
            </Link>
          : subtitle}
        </PlayerTitle>

        <PlayerDescription>
          {!isTouch && artistUrl ?
            <Link
              data-test="description-link"
              href={artistUrl}
              underline="hover"
            >
              {description}
            </Link>
          : description}
        </PlayerDescription>
      </Flex>
      <Thumbs />
    </>
  );
}
