import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Link } from '@iheartradio/web.accomplice/components/link';
import {
  PlayerDescription,
  PlayerSubtitle,
  PlayerTitle,
} from '@iheartradio/web.accomplice/components/player';
import { isNullish } from 'remeda';

import { playback } from '../playback';

export function AdsMetadata() {
  const metadata = playback.useMetadata();

  if (isNullish(metadata)) {
    return null;
  }

  const { description, subtitle, title, link, iframe } = metadata.data;

  return (
    <>
      {iframe ?
        <iframe
          frameBorder={0}
          src={iframe}
          style={{
            border: '0px',
            verticalAlign: 'bottom',
            display: 'block',
            height: '0px',
            width: '0px',
          }}
          title="ad_viewability"
        />
      : null}
      <Flex direction="column" gap="$2" gridArea="text" minWidth="10rem">
        <PlayerSubtitle>{subtitle}</PlayerSubtitle>
        <PlayerTitle>
          {link ?
            <Link data-test="title-link" href={link} underline="hover">
              {title}
            </Link>
          : title}
        </PlayerTitle>
        <PlayerDescription>{description}</PlayerDescription>
      </Flex>
    </>
  );
}
