import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Link } from '@iheartradio/web.accomplice/components/link';
import {
  PlayerDescription,
  PlayerTitle,
} from '@iheartradio/web.accomplice/components/player';
import { isTruthy } from 'remeda';

import { useIsTouch } from '~app/hooks/use-is-touch';
import { buildPodcastEpisodeUrl, buildPodcastUrl } from '~app/utilities/urls';

import { playback } from '../playback';

export function PodcastMetadata() {
  const metadata = playback.useMetadata();
  const { station } = playback.useState();
  const isTouch = useIsTouch();

  if (!station || !metadata) {
    return null;
  }

  const { description, id, podcastId, podcastSlug, subtitle } = metadata.data;

  const episodeUrl =
    (
      isTruthy(podcastId) &&
      isTruthy(podcastSlug) &&
      isTruthy(id) &&
      isTruthy(description)
    ) ?
      buildPodcastEpisodeUrl({
        podcastId,
        podcastSlug,
        episodeId: id,
        episodeName: description,
      })
    : undefined;

  const podcastUrl =
    isTruthy(podcastId) && isTruthy(podcastSlug) ?
      buildPodcastUrl({ podcastId, slug: podcastSlug })
    : undefined;

  return (
    <Flex direction="column" gap="$2" gridArea="text" minWidth="10rem">
      <PlayerTitle>
        {isTouch || !podcastUrl ?
          subtitle
        : <Link
            data-test="subtitle-link"
            href={episodeUrl ?? podcastUrl}
            underline="hover"
          >
            {subtitle}
          </Link>
        }
      </PlayerTitle>
      <PlayerDescription>
        {isTouch || !episodeUrl ?
          description
        : <Link
            data-test="description-link"
            href={podcastUrl ?? episodeUrl}
            underline="hover"
          >
            {description}
          </Link>
        }
      </PlayerDescription>
    </Flex>
  );
}
