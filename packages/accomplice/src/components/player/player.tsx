import { Loading } from '@iheartradio/web.accomplice/icons/loading';
import { formatDuration } from '@iheartradio/web.utilities/time/duration';
import { clsx } from 'clsx/lite';
import {
  type ForwardedRef,
  type ReactNode,
  type RefObject,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { isNonNullish, isNullish, isNumber } from 'remeda';
import type { SetRequired } from 'type-fest';

import { Logomark } from '../../icons/logomark.js';
import { Play } from '../../icons/play.js';
import { Shuffle } from '../../icons/shuffle.js';
import { VolumeHigh } from '../../icons/volume-high.js';
import { VolumeLow } from '../../icons/volume-low.js';
import { VolumeMute } from '../../icons/volume-mute.js';
import { VolumeOff } from '../../icons/volume-off.js';
import { lightDark } from '../../media.js';
import { vars } from '../../theme-contract.css.js';
import type { ElementProps } from '../../types.js';
import { Box } from '../box/index.js';
import { type ButtonProps, Button } from '../button/index.js';
import { type FlexProps, Flex } from '../flex/index.js';
import { Marquee } from '../marquee/index.js';
import { type ProgressBarProps, ProgressBar } from '../progress-bar/index.js';
import { type SliderProps, Slider } from '../slider/index.js';
import { Text } from '../text/index.js';
import { Tooltip, TooltipTrigger } from '../tooltip/index.js';
import { View } from '../view/index.js';
import { usePlayerProgress } from './contexts.js';
import {
  playerArtworkContainerStyles,
  playerArtworkPlaceholderStyles,
  playerArtworkStyles,
  playerDescriptionStyles,
  playerLayoutStyles,
  playerMetadataLayoutStyles,
  playerRootStyles,
  playerSubtitleStyles,
  videoPlayerInnerStyles,
  videoPlayerOuterStyles,
} from './player.css.js';

export interface PlayerRootProps {
  children?: ReactNode;
}

export const PlayerRoot = forwardRef(function PlayerRoot(
  { children }: PlayerRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div className={playerRootStyles}>
      <div className={playerLayoutStyles} ref={ref}>
        {children}
      </div>
      <View isHidden={{ mobile: false, 'container-large': true }}>
        <PlayerProgressBar />
      </View>
    </div>
  );
});

export type PlayerGridAreas = 'metadata' | 'controls' | 'actions';

export function PlayerSection({ ...props }: FlexProps) {
  return (
    <Flex
      alignItems="center"
      flexDirection="row"
      gap="$16"
      justifyContent="center"
      {...props}
    />
  );
}

export interface PlayerMetadataLayoutProps {
  children: ReactNode;
}

export function PlayerMetadataLayout({ children }: PlayerMetadataLayoutProps) {
  return <div className={clsx(playerMetadataLayoutStyles)}>{children}</div>;
}

export function PlayerArtwork({
  alt,
  ...props
}: SetRequired<ElementProps<'img'>, 'alt'>) {
  /**
   * By default we want to show this image.
   * This ensures the server render is consistent with the initial client render and the image is
   * only hidden if it fails to load.
   */
  const [showImg, setShowImg] = useState(true);

  return (
    <div className={playerArtworkContainerStyles}>
      <div
        className={playerArtworkPlaceholderStyles}
        style={{
          display: showImg ? 'none' : undefined,
        }}
      >
        <Logomark size={24} />
      </div>
      {/* TODO: Replace with Image component */}
      <img
        {...props}
        alt={alt}
        className={playerArtworkStyles}
        onError={() => {
          setShowImg(false);
        }}
        style={{
          display: showImg ? undefined : 'none',
        }}
      />
    </div>
  );
}

export function PlayerSubtitle({ children }: { children: ReactNode }) {
  return (
    <div className={playerSubtitleStyles}>
      <Marquee gap="24">{children}</Marquee>
    </div>
  );
}

export function PlayerTitle({ children }: { children: ReactNode }) {
  return (
    <Text css={{ pointerEvents: 'auto' }} kind="caption-1">
      <Marquee gap="24">{children}</Marquee>
    </Text>
  );
}

export function PlayerDescription({ children }: { children: ReactNode }) {
  return (
    <div className={playerDescriptionStyles}>
      <Marquee gap="24">{children}</Marquee>
    </div>
  );
}

export function PlayerProgressBar({ ...props }: ProgressBarProps) {
  /**
   * If PlayerProgressContext is used, some props can be computed based on that value.
   * Any props directly passed to this component will override those from the context.
   */
  const playerProgress = usePlayerProgress();
  const propsFromContext: ProgressBarProps = {
    isIndeterminate:
      isNullish(playerProgress) || isNullish(playerProgress.position),
    value:
      isNumber(playerProgress?.duration) && isNumber(playerProgress?.position) ?
        (playerProgress.position / playerProgress.duration) * 100
      : undefined,
  };

  return (
    <ProgressBar
      aria-label="Player progress bar"
      {...propsFromContext}
      {...props}
    />
  );
}

export interface PlayerTimeControlProps {
  position?: number;
  duration?: number;
  isDisabled?: boolean;

  interactive?: SliderProps['interactive'];
  onChange?: SliderProps['onChange'];
  onChangeEnd?: SliderProps['onChangeEnd'];
}

function isNonNullishFiniteNumber(value: number | undefined): value is number {
  return isNonNullish(value) && !Number.isNaN(value) && Number.isFinite(value);
}

export function PlayerTimeControl({
  isDisabled,
  onChange,
  onChangeEnd,
  interactive,
  ...props
}: PlayerTimeControlProps) {
  const playerProgress = usePlayerProgress();

  const position = playerProgress?.position ?? props?.position;
  const duration = playerProgress?.duration ?? props?.duration;

  const showSlider =
    isNonNullishFiniteNumber(position) &&
    isNonNullishFiniteNumber(duration) &&
    duration > 1;

  return (
    <Flex
      color={lightDark(vars.color.gray600, vars.color.brandWhite)}
      gap="$12"
      height="1.6rem"
      width={{
        mobile: '100%',
        'container-large': '30rem',
        'container-xlarge': '60rem',
      }}
    >
      {showSlider ?
        <>
          <Text css={{ textAlign: 'left' }} kind="caption-4">
            {formatDuration(position)}
          </Text>
          <Slider
            aria-label="Adjust Playback Progress"
            data-test="progress-bar-player-control"
            interactive={interactive}
            isDisabled={isDisabled}
            maxValue={duration}
            minValue={0}
            onChange={onChange}
            onChangeEnd={onChangeEnd}
            step={1}
            value={Math.floor(position)}
          />
          <Text css={{ textAlign: 'right' }} kind="caption-4">
            {formatDuration(duration)}
          </Text>
        </>
      : null}
    </Flex>
  );
}

export interface PlayerVolumeProps extends Omit<FlexProps, 'onChange'> {
  muted?: boolean;
  volume?: SliderProps['value'];
  onChange?: SliderProps['onChange'];
  onChangeEnd?: SliderProps['onChangeEnd'];
  defaultValue?: SliderProps['defaultValue'];
  onMutedChange?: (isMuted: boolean) => void;
}

export function PlayerVolume({
  volume,
  onChangeEnd,
  onChange,
  muted,
  defaultValue,
  onMutedChange,
  ...props
}: PlayerVolumeProps) {
  const finalVolume = volume ?? defaultValue ?? 50;

  const VolumeIcon =
    muted ? VolumeOff
    : finalVolume === 0 ? VolumeMute
    : finalVolume > 0 && finalVolume <= 50 ? VolumeLow
    : VolumeHigh;

  return (
    <Flex
      flexDirection="row"
      gap="$4"
      gridArea="volume"
      width="16rem"
      {...props}
    >
      <PlayerTooltip content="Mute / Unmute">
        <Button
          color="defaultInverted"
          kind="tertiary"
          onPress={() => {
            onMutedChange?.(!muted);
          }}
          size="icon"
        >
          <VolumeIcon size={32} />
        </Button>
      </PlayerTooltip>
      <Slider
        aria-label="volume"
        defaultValue={defaultValue ?? 50}
        maxValue={100}
        minValue={0}
        onChange={onChange}
        onChangeEnd={onChangeEnd}
        value={volume}
      />
    </Flex>
  );
}

export function PlayerTooltip({
  children,
  content,
  offset,
}: {
  children: ReactNode;
  content: ReactNode;
  offset?: number;
}) {
  return (
    <TooltipTrigger delay={500}>
      {children}
      <Tooltip offset={offset} placement="top">
        {content}
      </Tooltip>
    </TooltipTrigger>
  );
}

export interface PlayButtonProps extends ButtonProps {
  isPending?: boolean;
  shuffle?: boolean;
  tooltip?: ReactNode;
}

export function PlayButton({
  children,
  color,
  css,
  isDisabled,
  isPending,
  onPress,
  shuffle,
  tooltip,
  ...props
}: PlayButtonProps) {
  return (
    <PlayerTooltip content={tooltip ?? 'Play'}>
      <Button
        {...props}
        color={color ?? 'defaultInverted'}
        css={{
          boxShadow: vars.shadow.elevation1,
          position: 'relative',
          ...css,
        }}
        isDisabled={isDisabled}
        isPending={isPending}
        kind="primary"
        loader={<Loading stroke={vars.color.gray300} />}
        onPress={onPress}
        size="icon"
      >
        {children ?? <Play size={40} />}
        {shuffle ?
          <Box
            alignItems="center"
            backgroundColor={vars.color.brandWhite}
            borderRadius={vars.radius[999]}
            bottom="0"
            boxShadow={vars.shadow.elevation1}
            display="flex"
            height={{ mobile: '2rem', medium: '2.4rem' }}
            justifyContent="center"
            position="absolute"
            right="-0.2rem"
            transition="all 200ms ease"
            width={{ mobile: '2rem', medium: '2.4rem' }}
            zIndex="1000"
          >
            <Shuffle color={vars.color.blue500} size={16} />
          </Box>
        : null}
      </Button>
    </PlayerTooltip>
  );
}

export interface VideoPlayerContainerProps {
  showPlayer?: boolean;
  children?: ReactNode;
  ref?: RefObject<HTMLDivElement | null>;
}

export function VideoPlayerContainer(props: VideoPlayerContainerProps) {
  const { showPlayer, children, ref } = props;

  useEffect(() => {
    const elem = ref?.current;
    const abortController = new AbortController();

    if (showPlayer && elem) {
      window.addEventListener(
        'scroll',
        () => {
          elem.dataset.scrolled = '1';
        },
        { signal: abortController.signal, once: true, passive: true },
      );
    }

    return () => {
      if (elem) {
        elem.dataset.scrolled = '0';
      }
      abortController.abort();
    };
  }, [ref, showPlayer]);

  return (
    <div
      className={videoPlayerOuterStyles}
      data-test="video-player-positioning-context"
    >
      <div
        className={videoPlayerInnerStyles}
        data-scrolled="0"
        id="iheart-player-container"
        ref={ref}
      >
        {children}
      </div>
    </div>
  );
}
