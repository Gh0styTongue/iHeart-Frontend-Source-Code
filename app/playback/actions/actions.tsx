import { vars } from '@iheartradio/web.accomplice';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import {
  PlayerSection,
  PlayerTooltip,
} from '@iheartradio/web.accomplice/components/player';
import { ChevronRight } from '@iheartradio/web.accomplice/icons/chevron-right';
import type { Playback } from '@iheartradio/web.playback';
import { useNavigate } from 'react-router';

import { buildNowPlayingUrl } from '../helpers';
import { Menu } from './menu';
import { PlaybackSpeed } from './playback-speed';
import { Presets } from './presets';
import { Volume } from './volume';

export function Actions({
  station,
  metadata,
}: {
  station: Playback.Station;
  metadata: Playback.Metadata;
}) {
  const nowPlayingUrl = buildNowPlayingUrl({ station, metadata });
  const navigate = useNavigate();

  return (
    <PlayerSection
      gridArea="actions"
      isHidden={{ mobile: true, 'container-medium': false }}
      justifyContent="end"
      paddingRight={vars.space[16]}
    >
      <PlaybackSpeed isInMiniPlayer />
      <Presets isHidden={{ mobile: true, 'container-medium': false }} />
      <Volume />
      <Menu />
      <Flex isHidden={{ mobile: true, 'container-large': false }}>
        <PlayerTooltip content="Go to Player View">
          <Button
            color="default"
            kind="tertiary"
            onPress={() => (nowPlayingUrl ? navigate(nowPlayingUrl) : {})}
            size="icon"
          >
            <ChevronRight size={32} />
          </Button>
        </PlayerTooltip>
      </Flex>
    </PlayerSection>
  );
}
