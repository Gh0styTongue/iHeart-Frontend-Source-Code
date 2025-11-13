import { Box } from '@iheartradio/web.accomplice/components/box';
import { Link } from '@iheartradio/web.accomplice/components/link';
import { VideoPlayerContainer } from '@iheartradio/web.accomplice/components/player';
import { Text } from '@iheartradio/web.accomplice/components/text';
import type { RefObject } from 'react';
import { useEffect, useMemo } from 'react';

import { useConfig } from '~app/contexts/config';
import { useIsMobileBreakpoint } from '~app/hooks/use-is-mobile-breakpoint';

export type VideoPlayerProps = {
  ref: RefObject<HTMLDivElement | null>;
  showVideoPlayer: boolean;
};

export function VideoPlayer({ ref, showVideoPlayer }: VideoPlayerProps) {
  const config = useConfig();
  const isMobileBreakpoint = useIsMobileBreakpoint();

  const subscribeLink = `${config.urls.account}/subscribe`;

  useEffect(() => {
    if (showVideoPlayer) {
      document.documentElement.dataset.videoplayer =
        isMobileBreakpoint ? 'mobile' : 'desktop';
    }

    return () => {
      delete document.documentElement.dataset.videoplayer;
    };
  }, [showVideoPlayer, isMobileBreakpoint]);

  return useMemo(
    () => (
      <VideoPlayerContainer ref={ref} showPlayer={showVideoPlayer}>
        <Box
          aspectRatio="16 / 9"
          display={showVideoPlayer ? 'block' : 'none'}
          id="jw-player"
          overflow="visible"
        />
        <Box
          display={showVideoPlayer ? 'flex' : 'none'}
          flexDirection="row"
          justifyContent="flex-end"
          marginBottom="-2rem"
          marginRight="4rem"
          marginTop="2rem"
          width="100%"
        >
          <Text
            as="div"
            css={{
              color: '$brandWhite',
            }}
            kind={{ mobile: 'subtitle-4', xsmall: 'subtitle-5' }}
          >
            <Link href={subscribeLink} target="_blank" underline="hover">
              Try Ad-free Experience
            </Link>
          </Text>
        </Box>
      </VideoPlayerContainer>
    ),
    [ref, showVideoPlayer, subscribeLink],
  );
}
