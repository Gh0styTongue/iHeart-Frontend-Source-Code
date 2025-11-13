import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Link } from '@iheartradio/web.accomplice/components/link';
import {
  PlayerDescription,
  PlayerSubtitle,
  PlayerTitle,
} from '@iheartradio/web.accomplice/components/player';
import { MetadataType } from '@iheartradio/web.playback';
import { isNullish } from 'remeda';

import { useIsTouch } from '~app/hooks/use-is-touch';
import {
  buildArtistUrl,
  buildLiveUrl,
  buildSongUrl,
} from '~app/utilities/urls';

import { Thumbs } from '../controls/thumbs';
import { buildNowPlayingUrl } from '../helpers';
import { playback } from '../playback';

export function LiveMetadata() {
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

  const showStationNowPlaying = metadata.type !== MetadataType.Station;

  const nowPlayingUrl = buildNowPlayingUrl({ station, metadata });
  const liveStationUrl = buildLiveUrl({ id, name });
  const songUrl =
    trackId && artistId ?
      buildSongUrl({
        artist: { id: artistId, name: artistName ?? '' },
        track: { id: trackId, name: title ?? '' },
      })
    : undefined;
  const artistUrl =
    artistId ?
      buildArtistUrl({
        id: artistId,
        name: artistName ?? '',
      })
    : undefined;

  return (
    <>
      <Flex direction="column" gap="$2" gridArea="text" minWidth="10rem">
        <PlayerSubtitle>
          {!isTouch && nowPlayingUrl ?
            <Link
              data-test="subtitle-link"
              href={nowPlayingUrl}
              underline="hover"
            >
              {subtitle}
            </Link>
          : subtitle}
        </PlayerSubtitle>
        {showStationNowPlaying ?
          <PlayerTitle>
            {!isTouch && songUrl ?
              <Link data-test="title-link" href={songUrl} underline="hover">
                {title}
              </Link>
            : title}
          </PlayerTitle>
        : null}
        <PlayerDescription>
          {isTouch ?
            description
          : <Link
              data-test="description-link"
              href={showStationNowPlaying ? artistUrl : liveStationUrl}
              underline="hover"
            >
              {description}
            </Link>
          }
        </PlayerDescription>
      </Flex>
      <Thumbs />
    </>
  );
}
