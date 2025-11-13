import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Link } from '@iheartradio/web.accomplice/components/link';
import {
  PlayerDescription,
  PlayerSubtitle,
  PlayerTitle,
} from '@iheartradio/web.accomplice/components/player';
import { isNullish } from 'remeda';

import { useIsTouch } from '~app/hooks/use-is-touch';
import { buildArtistUrl, buildSongUrl } from '~app/utilities/urls';

import { Thumbs } from '../controls/thumbs';
import { buildNowPlayingUrl } from '../helpers';
import { playback } from '../playback';

export function PlaylistMetadata() {
  const metadata = playback.useMetadata();
  const { station } = playback.useState();
  const isTouch = useIsTouch();

  if (isNullish(station) || isNullish(metadata)) {
    return null;
  }

  const { artistId, description, id, subtitle, title } = metadata.data;

  const nowPlayingUrl = buildNowPlayingUrl({ station, metadata });

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
        <PlayerTitle>
          {!isTouch && id && artistId ?
            <Link
              data-test="title-link"
              href={buildSongUrl({
                artist: { id: artistId, name: title ?? '' },
                track: { id, name: subtitle ?? '' },
              })}
              underline="hover"
            >
              {title}
            </Link>
          : title}
        </PlayerTitle>
        <PlayerDescription>
          {!isTouch && artistId ?
            <Link
              data-test="description-link"
              href={buildArtistUrl({
                id: artistId,
                name: description ?? '',
              })}
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
