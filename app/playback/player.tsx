import {
  breakpoints,
  slideUpDesktop,
  slideUpMobile,
} from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import {
  PlayerMetadataLayout,
  PlayerProgressProvider,
  PlayerRoot,
  PlayerSection,
  useFullScreenPlayer,
} from '@iheartradio/web.accomplice/components/player';
import { StationType } from '@iheartradio/web.playback';
import { useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ClientOnly } from 'remix-utils/client-only';
import { useMediaQuery } from 'usehooks-ts';

import { useGetPageName } from '~app/hooks/use-get-page-name';
import { ANALYTICS_LOCATION } from '~app/utilities/constants';

import { Actions } from './actions';
import {
  PlayerStatusProvider,
  usePlayerStatus,
} from './contexts/player-status';
import { ControlSet } from './control-set';
import { Time } from './controls/time';
import { buildNowPlayingUrl } from './helpers';
import { useInitializePlayer } from './hooks/use-initialize-player';
import { useLoadInitialStation } from './hooks/use-load-initial-station';
import { usePlayerErrorToast } from './hooks/use-player-error-toast';
import { usePlayerMessageToast } from './hooks/use-player-message-toast';
import { useReloadOnLogout } from './hooks/use-reload-on-logout';
import { Metadata } from './metadata/metadata';
import { playback } from './playback';
import { VideoPlayer } from './video-player';

export function Player() {
  return (
    <PlayerStatusProvider>
      <PlayerInner />
    </PlayerStatusProvider>
  );
}

function PlayerInner() {
  const { station } = playback.useState();
  const metadata = playback.useMetadata();
  const [playerStatus] = usePlayerStatus();

  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const playerBarRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const pageName = useGetPageName();

  const { adBreak, type } = playback.useAds();
  const showVideoPlayer = useMemo(
    () => adBreak && (type === 'video' || type === 'script'),
    [adBreak, type],
  );

  const context = useMemo(
    () => ({
      pageName,
      playedFrom: 6,
      eventLocation: ANALYTICS_LOCATION.MINIPLAYER_BUTTON,
    }),
    [pageName],
  );

  usePlayerErrorToast();
  usePlayerMessageToast();
  useInitializePlayer();
  useLoadInitialStation();
  useReloadOnLogout();

  const time = playback.useTime();
  const isLiveStation = useMemo(
    () => station?.type === StationType.Live,
    [station?.type],
  );
  const { isOpen: isFullScreen } = useFullScreenPlayer();
  const isLargeScreen = useMediaQuery(breakpoints.large);
  const nowPlayingUrl = buildNowPlayingUrl({ station, metadata });

  const navigateToNowPlaying = useCallback(
    (isLargeScreen: boolean) => {
      if (isLargeScreen && nowPlayingUrl) {
        navigate(nowPlayingUrl);
      }
    },
    [navigate, nowPlayingUrl],
  );

  return (
    <Box
      alignSelf="end"
      animationDuration="350ms"
      animationFillMode="forwards"
      animationName={
        playerStatus.loaded && !isFullScreen ?
          { mobile: `${slideUpMobile}`, large: `${slideUpDesktop}` }
        : undefined
      }
      animationTimingFunction="ease-out"
      bottom="0"
      data-fullscreen-route={isFullScreen ? true : null}
      gridArea="player"
      height="min-content"
      position="fixed"
      ref={playerBarRef}
      transform="translateY(100%)"
      width="100%"
      zIndex={{ mobile: '$3', large: '$10' }}
    >
      <ClientOnly>
        {() => (
          <PlayerProgressProvider
            duration={time.duration}
            position={isLiveStation && !adBreak ? 0 : time.position}
          >
            <PlayerRoot>
              <VideoPlayer
                ref={videoPlayerRef}
                showVideoPlayer={showVideoPlayer}
              />
              {/* On Mobile -> Medium breakpoints, this Box allows Metadata section to be clicked and navigate to "Now Playing" */}
              <Box
                cursor={{ mobile: 'pointer', large: 'default' }}
                onClick={() => navigateToNowPlaying(!isLargeScreen)}
                onTouchStart={() => navigateToNowPlaying(!isLargeScreen)}
                pointerEvents={{ mobile: 'auto', large: 'none' }}
              >
                <PlayerMetadataLayout>
                  {/* On Large+ breakpoints, clicking the album artwork will navigate to "Now Playing" */}
                  <Metadata
                    onClick={() => navigateToNowPlaying(isLargeScreen)}
                  />
                </PlayerMetadataLayout>
              </Box>
              <PlayerSection
                alignItems="center"
                flexDirection="column"
                gap="$8"
                gridArea="controls"
                justifyContent="center"
                maxWidth={{
                  'container-large': '30rem',
                  'container-xlarge': '60rem',
                }}
              >
                <ControlSet context={context} />
                <Box
                  alignSelf="stretch"
                  display={{ mobile: 'none', 'container-large': 'block' }}
                >
                  <Time />
                </Box>
              </PlayerSection>
              <Actions metadata={metadata} station={station} />
            </PlayerRoot>
          </PlayerProgressProvider>
        )}
      </ClientOnly>
    </Box>
  );
}
