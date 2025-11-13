import type { ButtonProps } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import type { IconProps } from '@iheartradio/web.accomplice/components/icon';
import * as Playback from '@iheartradio/web.playback';
import { useContext } from 'react';

import { useInAppMessage } from '~app/analytics/in-app-message';
import { ThumbsContext, ThumbStatus } from '~app/contexts/thumbs/thumbs';
import { useLoginUrl, useSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';

import { addThumbToast } from '../helpers';
import { ThumbsDown } from './thumbs-down';
import { ThumbsUp } from './thumbs-up';

export type ThumbsProps = {
  css?: ButtonProps['css'];
  size?: IconProps['size'];
  isInProfilePlayer?: boolean;
};

export type ThumbsControlProps = {
  css?: ButtonProps['css'];
  onPress: (thumbType: ThumbStatus) => void;
  isPressed: boolean;
  isDisabled?: boolean;
  size: ThumbsProps['size'];
};

export const Thumbs = ({
  css,
  size = 32,
  isInProfilePlayer = false,
}: ThumbsProps) => {
  const {
    isAnonymous,
    metadata,
    resetThumbTrack,
    station,
    thumbStatus,
    thumbTrack,
  } = useContext(ThumbsContext);
  const { onInAppMessageExit, onInAppMessageOpen } = useInAppMessage();
  const pageName = useGetPageName();
  const loginUrl = useLoginUrl().toString();
  const signUpUrl = useSignUpUrl().toString();

  const { type, data } = metadata ?? {};
  const { trackId, id } = data ?? {};
  const { type: stationType } = station ?? {};

  const isPodcast = stationType === Playback.StationType.Podcast;
  const isLiveStation = stationType === Playback.StationType.Live;
  const isScanning = stationType === Playback.StationType.Scan;
  const showStationNowPlaying = type !== Playback.MetadataType.Station;

  if (isPodcast) {
    return null;
  }

  // Thumbs disabled if user is scanning live stations or a song is not actively playing
  const isDisabled =
    isScanning ? true
    : isLiveStation ? Number(trackId) <= 0 || !showStationNowPlaying
    : Number(id) <= 0;

  const onPress = (thumbType: ThumbStatus) => {
    // If anonymous, pop reg-gate toast
    if (isAnonymous) {
      addThumbToast({
        isLiveStation,
        thumbType,
        loginUrl,
        signUpUrl,
        onInAppMessageOpen,
        onInAppMessageExit,
        pageName,
        isInProfilePlayer,
        station,
      });
    } else if (thumbStatus === thumbType) {
      // Reset thumb status if already active - i.e. un-thumbing a track that is currently thumbsed up
      resetThumbTrack();
    } else {
      // Thumbs up/down the track
      thumbTrack({
        thumbType,
      });
    }
  };

  return (
    <Flex
      gap="$4"
      isHidden={
        isInProfilePlayer ? false : { mobile: true, 'container-medium': false }
      }
    >
      <ThumbsDown
        css={css}
        isDisabled={isDisabled}
        isPressed={thumbStatus === ThumbStatus.Down}
        onPress={(thumbType: ThumbStatus) => onPress(thumbType)}
        size={size}
      />
      <ThumbsUp
        css={css}
        isDisabled={isDisabled}
        isPressed={thumbStatus === ThumbStatus.Up}
        onPress={(thumbType: ThumbStatus) => onPress(thumbType)}
        size={size}
      />
    </Flex>
  );
};
