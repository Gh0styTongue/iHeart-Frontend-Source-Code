import { breakpoints, vars } from '@iheartradio/web.accomplice';
import { Box } from '@iheartradio/web.accomplice/components/box';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { FullScreenContext } from '@iheartradio/web.accomplice/components/player';
import { Popover } from '@iheartradio/web.accomplice/components/popover';
import type { PresetCardSlideProps } from '@iheartradio/web.accomplice/components/preset-list';
import {
  PresetCardSlide,
  PresetList,
  PresetPlaceholderSlide,
} from '@iheartradio/web.accomplice/components/preset-list';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { addToast } from '@iheartradio/web.accomplice/components/toast';
import type { PresetsTypes } from '@iheartradio/web.api/amp';
import type { CatalogType } from '@iheartradio/web.assets';
import { MediaServerURL } from '@iheartradio/web.assets';
import type { User } from '@iheartradio/web.config';
import * as Playback from '@iheartradio/web.playback';
import type { RefObject } from 'react';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMatches, useNavigate } from 'react-router';
import type { Key, ListData } from 'react-stately';
import { useHydrated } from 'remix-utils/use-hydrated';
import { $path } from 'safe-routes';
import { useMediaQuery } from 'usehooks-ts';
import type { z } from 'zod';

import { analytics } from '~app/analytics/create-analytics';
import type { ContextLocation, RegGateContext } from '~app/analytics/data';
import type { InAppMessageHandler } from '~app/analytics/in-app-message';
import { useInAppMessage } from '~app/analytics/in-app-message';
import {
  addRegGateToast,
  setRegGateContext,
} from '~app/analytics/reg-gate-toast';
import type { TrackPresets } from '~app/analytics/track-presets';
import { useTrackPresets } from '~app/analytics/track-presets';
import type { ItemSelectedType } from '~app/analytics/use-item-selected';
import { useItemSelected } from '~app/analytics/use-item-selected';
import { useConfig } from '~app/contexts/config';
import {
  type PresetsAnalytics,
  usePresetsContext,
} from '~app/contexts/presets/presets';
import {
  type PresetCarouselId,
  PresetsDrawerContext,
} from '~app/contexts/presets/presets-drawer';
import type { PresetIndex } from '~app/contexts/presets/utils';
import {
  addPreset,
  ContentTypes,
  deletePreset,
  getAnalyticsLocation,
  getPresetsImage,
  hasAnalyticsData,
  movePreset,
} from '~app/contexts/presets/utils';
import { useUser } from '~app/contexts/user';
import { useLoginUrl, useSignUpUrl } from '~app/hooks/auth-urls';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { usePlay } from '~app/playback/controls/play/use-play';
import { playback } from '~app/playback/playback';
import {
  ADD_TO_PRESET_AUTHENTICATION_MESSAGE,
  ANALYTICS_LOCATION,
  ANALYTICS_ORIGIN,
  PAYLOAD_TRIGGER_TYPES,
  PRESETS_EVENTS,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
} from '~app/utilities/constants';
import { makeArtistSlug } from '~app/utilities/slugs/artist-slug';
import { makeLiveStationSlug } from '~app/utilities/slugs/get-live-profile-slug';
import { makePlaylistSlug } from '~app/utilities/slugs/get-playlist-profile-slug';
import { makePodcastSlug } from '~app/utilities/slugs/get-podcast-profile-slug';
import { isPremiumUser } from '~app/utilities/user';

export type Preset = {
  id: Key;
  imageUrl?: string;
  type?: z.infer<typeof PresetsTypes>;
  title?: string;
  index: PresetIndex;
};

export const PresetStationTypes = {
  playlist: 'COLLECTION',
  artist: 'ARTIST',
  album: 'ARTIST',
  'top-songs': 'ARTIST',
  'playlist-radio': 'COLLECTION',
  favorites: 'FAVORITES',
  live: 'LIVE',
  scan: 'LIVE',
  podcast: 'PODCAST',
} as const;

const StationTypes = {
  COLLECTION: 'playlist',
  COLLECTION_RADIO: 'playlist-radio',
  ARTIST: 'artist',
  FAVORITES: 'favorites',
  LIVE: 'live',
  PODCAST: 'podcast',
} as const;

type ItemSelected = ({
  action,
  pageName,
  section,
  context,
  assets,
  sectionPosition,
  itemPosition,
  row,
  tab,
  contentId,
  contentTitle,
}: ItemSelectedType) => void;

type PresetProps = {
  analyticsData?: PresetsAnalytics | null;
  analyticsLocation: ContextLocation;
  onItemSelected?: ItemSelected;
  pageName: string;
  station: Playback.Station;
};

type PresetPlaceholderActionProps = {
  signUpUrl: URL | string;
  loginUrl: URL | string;
  analyticsData: PresetProps['analyticsData'];
  analyticsLocation: PresetProps['analyticsLocation'];
  index: PresetIndex;
  metadata: Playback.Metadata;
  onItemSelected?: PresetProps['onItemSelected'];
  pageName: PresetProps['pageName'];
  presetListData: ListData<Preset>;
  queue: Playback.Queue;
  queueIndex: number;
  station: PresetProps['station'];
  trackAddPreset: ({ pageName, location, station, item }: TrackPresets) => void;
  user: User;
  onInAppMessageOpen: InAppMessageHandler;
  onInAppMessageExit: InAppMessageHandler;
};

type PresetCardProps = {
  analyticsData?: PresetProps['analyticsData'];
  analyticsLocation: PresetProps['analyticsLocation'];
  contentName?: string;
  id: Key;
  isInDrawer: boolean;
  isOpen?: boolean;
  isPremium: boolean;
  onItemSelected?: PresetProps['onItemSelected'];
  navigateOnAction?: boolean;
  pageName: PresetProps['pageName'];
  station: PresetProps['station'];
  type: Preset['type'];
};

const onAddPreset = ({
  signUpUrl,
  loginUrl,
  analyticsData,
  analyticsLocation,
  index,
  metadata,
  onItemSelected,
  pageName,
  presetListData,
  queue,
  queueIndex,
  station,
  trackAddPreset,
  user,
  onInAppMessageOpen,
  onInAppMessageExit,
}: PresetPlaceholderActionProps) => {
  const regGateContext = {
    trigger: PAYLOAD_TRIGGER_TYPES.PRESETS,
    origin: ANALYTICS_ORIGIN.LISTEN,
    pageName,
    location: analyticsLocation,
    ...(analyticsData?.preset_added ?
      {
        assetId: analyticsData.preset_added.view.station.id,
        assetName: analyticsData.preset_added.view.station.name,
      }
    : {}),
  } satisfies RegGateContext;

  loginUrl = setRegGateContext(loginUrl, regGateContext);
  signUpUrl = setRegGateContext(signUpUrl, regGateContext);

  const onRegGatePress = () => {
    onInAppMessageExit({
      messageType: REG_GATE_TOAST_MESSAGE_TYPE.PRESETS,
      exitType: REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
      pageName,
      location: analyticsLocation,
      ...(analyticsData?.preset_added ?
        {
          globalStation: analyticsData.preset_added.view.station,
        }
      : {}),
    });
  };

  // Prevent saving preset if user is anonymous
  if (user.isAnonymous) {
    addRegGateToast({
      kind: 'info',
      text: ADD_TO_PRESET_AUTHENTICATION_MESSAGE,
      location: analyticsLocation,
      ...(analyticsData?.preset_added ?
        {
          globalStation: analyticsData.preset_added.view.station,
        }
      : {}),
      actions: [
        {
          kind: 'tertiary',
          color: 'gray',
          textColor: vars.color.gray600,
          content: 'Log in',
          size: { xsmall: 'small', medium: 'large' },
          href: loginUrl.toString(),
          onPress: onRegGatePress,
        },
        {
          kind: 'tertiary',
          color: 'gray',
          textColor: vars.color.gray600,
          content: 'Sign up',
          size: { xsmall: 'small', medium: 'large' },
          href: signUpUrl.toString(),
          onPress: onRegGatePress,
        },
      ],
      onInAppMessageOpen,
      onInAppMessageExit,
      messageType: REG_GATE_TOAST_MESSAGE_TYPE.PRESETS,
      userTriggered: true,
      pageName,
    });

    return;
  }

  // If a station is loaded in the player...
  if (station) {
    const { type, meta, id: contentId, artistId } = station;
    const { title, image } = meta ?? {};
    const { artistName } = metadata?.data ?? {};

    // Majority of content types use this data
    let stationTitle = title;
    let stationId = contentId;

    // If "Scan" update the title and id
    if (type === Playback.StationType.Scan) {
      const scanStation = queue[queueIndex];
      stationTitle = scanStation.meta.name;
      stationId = scanStation.id;
    }

    // If "Album" update the title and id
    if (type === Playback.StationType.Album && artistId) {
      stationTitle = artistName;
      stationId = artistId;
    }

    // Map to correct "type" that AMP needs for Presets
    const stationType =
      PresetStationTypes[type as keyof typeof PresetStationTypes];

    // Generate image if none is provided on station object
    const stationImage =
      image ??
      MediaServerURL.fromCatalog({
        id: String(stationId),
        type: type.toLowerCase() as CatalogType,
      })
        .ratio(1, 1)
        .resize(150)
        .toString();

    if (stationType && stationId && stationTitle && stationImage) {
      // Attempt to add preset to memory storage and AMP
      addPreset({
        id: String(stationId),
        imageUrl: stationImage,
        position: index,
        presetListData,
        title: stationTitle,
        type: stationType,
        analyticsCallback: () => (
          trackAddPreset({
            pageName,
            location: analyticsLocation,
            station: {
              id: String(stationId),
              name: stationTitle,
            },
            item: {
              id: String(stationId),
              name: stationTitle,
            },
            ...(analyticsData?.preset_added ?
              {
                globalStation: analyticsData.preset_added.view.station,
              }
            : {}),
          }),
          onItemSelected?.({
            pageName,
            itemPosition: Number(index),
            location: analyticsLocation,
            context: PRESETS_EVENTS.PRESETS,
            assets: {
              asset: {
                id: String(stationId),
                name: stationTitle,
                subid: String(stationId),
                subname: stationTitle,
              },
            },
            ...(analyticsData?.preset_added ?
              {
                globalStation: analyticsData.preset_added.view.station,
              }
            : {}),
          })
        ),
      });
    } else {
      addToast({
        kind: 'error',
        text: `There was an issue adding ${title} to your presets. Please try again`,
      });
    }
  } else {
    addToast({
      kind: 'info',
      text: 'Start playing something to add it to your presets',
    });
  }
};

const PresetCard = ({
  ...props
}: PresetCardSlideProps<PresetIndex> & PresetCardProps) => {
  const {
    analyticsData,
    analyticsLocation,
    contentName,
    id,
    isInDrawer,
    isOpen,
    isPremium,
    onItemSelected,
    navigateOnAction,
    pageName,
    position,
    station,
    title,
    type,
  } = props;

  const navigate = useNavigate();
  const { profileId: userId } = useUser();
  const { onInAppMessageOpen, onInAppMessageExit } = useInAppMessage();
  const { isScanning, status } = playback.useState();

  const isPlaying = status === Playback.Status.Playing;
  const stationId = type === 'COLLECTION' ? id : Number.parseInt(id as string);
  const stationType =
    type === PresetStationTypes.playlist && !isPremium ?
      'COLLECTION_RADIO'
    : type;

  const context = useMemo(
    () => ({
      pageName,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
      playedFrom:
        isOpen ? 1012
        : isInDrawer ? 1002
        : 1001,
    }),
    [isInDrawer, isOpen, pageName],
  );

  const { doPlay, isCurrent } = usePlay({
    id: stationId,
    type: StationTypes[stationType] as Playback.StationType,
    context,
  });

  const navigateToProfile = useCallback(() => {
    switch (type) {
      case 'PODCAST': {
        const podcastSlug = makePodcastSlug(contentName, id);
        if (podcastSlug) {
          navigate($path('/podcast/:podcastSlug', { podcastSlug }));
        }

        break;
      }
      case 'ARTIST': {
        const artistSlug = makeArtistSlug(contentName, id);
        if (artistSlug) {
          navigate(
            $path('/artist/:artistSlug/now-playing', {
              artistSlug,
            }),
          );
        }

        break;
      }
      case 'COLLECTION': {
        const playlistSlug = makePlaylistSlug({
          id: id as string,
          name: contentName,
          userId,
        });

        if (playlistSlug) {
          navigate(
            $path('/playlist/:playlistSlug/now-playing', {
              playlistSlug,
            }),
          );
        }

        break;
      }
      case 'FAVORITES': {
        navigate($path('/favorites/:userId?/now-playing', { userId }));

        break;
      }
      case 'LIVE': {
        const liveSlug = makeLiveStationSlug(contentName, id);
        if (liveSlug) {
          navigate($path('/live/:liveSlug/now-playing', { liveSlug }));
        }

        break;
      }
      default: {
        console.warn(`Content type "${type}" not supported in presets`);
      }
    }
  }, [contentName, id, navigate, type, userId]);

  return (
    <PresetCardSlide<PresetIndex>
      {...props}
      onAction={() => {
        if (type === PresetStationTypes.podcast) {
          // TODO: This is temporary
          // Expected behavior is podcast playback picks up from exactly where you left off.
          // Currently we don't support this, so product compromise is to navigate the user to the podcast's profile page. - Dylan M [03/14/2025]
          navigateToProfile();
        } else if (!isPlaying || !isCurrent) {
          if (isScanning) {
            analytics.track({
              type: 'scan_stopped',
              data: {
                view: {
                  pageName,
                },
                scan: {
                  stopType: 'preset_play',
                },
              },
            });
          }

          doPlay();

          if (navigateOnAction && isOpen) {
            navigateToProfile();
          }
        } else {
          addToast({
            kind: 'info',
            text: `${title} is currently playing`,
          });
        }

        onItemSelected?.({
          pageName,
          itemPosition: Number(position),
          location: analyticsLocation,
          context: PRESETS_EVENTS.PRESETS,
          assets: {
            asset: {
              id: String(stationId),
              name: title,
              subid: String(station.id),
              subname: station?.name ?? 'Station',
            },
          },
          ...(analyticsData?.preset_added ?
            {
              globalStation: analyticsData.preset_added.view.station,
            }
          : {}),
        });
      }}
      onModalCancel={() =>
        onInAppMessageExit({
          messageType: PRESETS_EVENTS.REMOVE_PRESETS,
          exitType: PRESETS_EVENTS.USER_DISMISS,
          pageName,
        })
      }
      onModalOpen={() =>
        onInAppMessageOpen({
          messageType: PRESETS_EVENTS.REMOVE_PRESETS,
          userTriggered: true,
          pageName,
        })
      }
    />
  );
};

function PresetPopover({
  triggerRef,
}: {
  triggerRef: RefObject<HTMLDivElement | null>;
}) {
  const isHydrated = useHydrated();
  const user = useUser();
  const isAnonymous = !isHydrated || user.isAnonymous;
  const isLargeScreen = useMediaQuery(breakpoints.large);
  const { environment } = useConfig();
  const { presetPopoverMaxTimesDismissed } = environment;
  const [timesDismissed, setTimesDismissed] = useState(0);
  const { onInAppMessageOpen, onInAppMessageExit } = useInAppMessage();

  const popoverCopy =
    isAnonymous ?
      'Log in first to add what’s currently playing to a Preset for easy access'
    : 'Select to add what’s currently playing for easy access';

  const context = {
    trigger: PAYLOAD_TRIGGER_TYPES.PRESETS_POPOVER,
    origin: ANALYTICS_ORIGIN.LISTEN,
    pageName: 'home',
    location: PRESETS_EVENTS.PRESETS_MENU,
  } satisfies RegGateContext;

  const loginUrl = useLoginUrl({ context });
  const signUpUrl = useSignUpUrl({ context });

  const onDismiss = useCallback(
    ({
      exitType = PRESETS_EVENTS.USER_DISMISS,
      selection,
    }: {
      exitType?: string;
      selection?: 'register' | 'login';
    }) => {
      onInAppMessageExit({
        messageType: PRESETS_EVENTS.PRESETS_LOGIN,
        pageName: 'home',
        location: PRESETS_EVENTS.PRESETS_MENU,
        type: 'tooltip',
        exitType,
        ...(exitType === PRESETS_EVENTS.CLICK_SUCCESS && selection ?
          { selection }
        : {}),
      });

      if (!timesDismissed || timesDismissed < presetPopoverMaxTimesDismissed) {
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(
              'preset_popover',
              JSON.stringify({
                timesDismissed: timesDismissed ? timesDismissed + 1 : 1,
                lastShown: Date.now(),
              }),
            );
          }
        } catch {
          return null;
        }
      }
    },
    [timesDismissed, presetPopoverMaxTimesDismissed, onInAppMessageExit],
  );

  useEffect(() => {
    onInAppMessageOpen({
      messageType: PRESETS_EVENTS.PRESETS_LOGIN,
      userTriggered: false,
      pageName: 'home',
      location: PRESETS_EVENTS.PRESETS_MENU,
      type: 'tooltip',
    });

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('preset_popover');
        if (stored) {
          const parsed = JSON.parse(stored);
          setTimesDismissed(parsed.timesDismissed || 0);
        }
      }
    } catch {
      setTimesDismissed(0);
    }
  }, [onInAppMessageOpen]);

  return (
    <Popover
      crossOffset={isLargeScreen ? 80 : 0}
      defaultOpen={true}
      onOpenChange={() => onDismiss({})}
      style={{
        textAlign: 'start',
        minWidth: isAnonymous ? '20rem' : '23.3rem',
        maxWidth: isLargeScreen ? '26.2rem' : '22rem',
        backgroundColor: vars.color.blue600,
        color: vars.color.brandWhite,
        zIndex: 100,
      }}
      triggerRef={triggerRef}
    >
      <Flex alignItems="center" direction="column" gap={vars.space[16]}>
        <Text as="p" kind={{ mobile: 'body-4', desktop: 'body-2' }}>
          {popoverCopy}
        </Text>
        {isAnonymous ?
          <Flex gap={vars.space[16]} justifyContent="center" width="100%">
            <Button
              color="white"
              href={loginUrl.toString()}
              kind="primary"
              onClick={() =>
                onDismiss({
                  exitType: PRESETS_EVENTS.CLICK_SUCCESS,
                  selection: 'login',
                })
              }
              size={{ mobile: 'small', desktop: 'large' }}
            >
              Log in
            </Button>
            <Button
              color="white"
              href={signUpUrl.toString()}
              kind="secondary"
              onClick={() =>
                onDismiss({
                  exitType: PRESETS_EVENTS.CLICK_SUCCESS,
                  selection: 'register',
                })
              }
              size={{ mobile: 'small', desktop: 'large' }}
            >
              Sign up
            </Button>
          </Flex>
        : null}
      </Flex>
    </Popover>
  );
}

export function PresetsCarousel({
  isInDrawer = false,
  navigateOnAction,
  type,
}: {
  type: PresetCarouselId;
  isInDrawer?: boolean;
  navigateOnAction?: boolean;
}) {
  const player = playback.usePlayer();
  const playerState = player.getState();
  const station = playerState.get('station');
  const user = useUser();
  const userIsPremium = isPremiumUser(user);
  const pageName = useGetPageName();
  const { presetListData, hasFetchedPresets, presetsLength } =
    usePresetsContext();
  const profilePlayer = useContext(FullScreenContext);
  const { isEditing, setIsEditing } = useContext(PresetsDrawerContext);
  const { trackAddPreset, trackRemovePreset } = useTrackPresets();
  const { onItemSelected } = useItemSelected();
  const { onInAppMessageOpen, onInAppMessageExit } = useInAppMessage();
  const loginUrl = useLoginUrl();
  const signUpUrl = useSignUpUrl();
  const isHydrated = useHydrated();
  const triggerRef = useRef(null);
  const [shouldShowPopover, setShouldShowPopover] = useState<boolean>(false);
  const { environment } = useConfig();
  const { presetPopoverMaxTimesDismissed, presetPopoverDisplayFrequency } =
    environment;

  // The carousel can be rendered on the home page, in the miniplayer drawer, or in the profile player drawer
  const analyticsLocation = getAnalyticsLocation({
    isInDrawer,
    isOpen: profilePlayer?.isOpen ?? false,
  });

  // Grab routes
  const routes = useMatches().reverse();

  // Find the closest route that has loader data returned
  const loaderData =
    routes?.map(route => route.data).find(hasAnalyticsData) ?? null;

  useEffect(() => {
    let timesDismissed, lastShown;
    if (
      typeof window !== 'undefined' &&
      window.localStorage !== undefined &&
      isHydrated
    ) {
      try {
        const popoverData = JSON.parse(
          window.localStorage.getItem('preset_popover') || '{}',
        );
        timesDismissed = popoverData.timesDismissed;
        lastShown = popoverData.lastShown;
      } catch {
        timesDismissed = undefined;
        lastShown = undefined;
      }
    }

    if (!timesDismissed || !lastShown) {
      setShouldShowPopover(true);
    } else {
      // How many days until the popover resurfaces: days * hours * minutes * seconds * milliseconds
      const DAYS_IN_MS = presetPopoverDisplayFrequency * 24 * 60 * 60 * 1000;
      const hasExpired = Date.now() - lastShown > DAYS_IN_MS;

      // The popover will be displayed if it has been dismissed less than `presetPopoverMaxTimesDismissed` (number) times
      // and has not been displayed in the past `presetPopoverDisplayFrequency` (number) days.
      const shouldShow =
        timesDismissed < presetPopoverMaxTimesDismissed && hasExpired;

      setShouldShowPopover(shouldShow);
    }
  }, [
    isHydrated,
    presetPopoverMaxTimesDismissed,
    presetPopoverDisplayFrequency,
  ]);

  return (
    <Box
      data-presets-carousel="true"
      data-show-carousel-controls={type === isEditing ? true : undefined}
      paddingY={
        isInDrawer ? 0 : { mobile: vars.space[16], large: vars.space[32] }
      }
    >
      <PresetList<Preset>
        isAnonymous={!isHydrated || user.isAnonymous}
        isEditing={type === isEditing}
        isInDrawer={isInDrawer}
        onEdit={() => {
          setIsEditing(type === isEditing ? null : type);
        }}
        onMove={presetsData => movePreset(presetsData)}
        presetData={presetListData}
      >
        {item => {
          const { id, type, imageUrl, index, title } = item;
          const imageSrc = getPresetsImage({ id, type, imageUrl });

          return id && imageSrc && type ?
              <PresetCard
                analyticsData={loaderData?.analytics ?? null}
                analyticsLocation={analyticsLocation}
                contentName={title}
                id={id}
                isInDrawer={isInDrawer}
                isOpen={profilePlayer?.isOpen ?? false}
                isPremium={userIsPremium}
                key={`${id}-${isInDrawer}`}
                navigateOnAction={navigateOnAction}
                onDeleteAction={({ title, position }) => {
                  deletePreset({
                    title,
                    position,
                    presetListData,
                    id,
                    analyticsCallback: () =>
                      trackRemovePreset({
                        pageName,
                        location: analyticsLocation,
                        station: { id: String(id), name: title },
                        item: {
                          id: String(station.id),
                          name: station.name ?? 'station',
                        },
                        ...(loaderData?.analytics?.preset_removed ?
                          {
                            globalStation:
                              loaderData.analytics.preset_removed.view.station,
                          }
                        : {}),
                      }),
                  });
                }}
                onItemSelected={onItemSelected}
                pageName={pageName}
                position={index}
                src={imageSrc}
                station={station}
                title={title ?? ContentTypes[type]}
                type={type}
              />
            : <PresetPlaceholderSlide
                key={`${id}-${isInDrawer}`}
                onAction={() => {
                  const {
                    station,
                    metadata,
                    queue,
                    index: queueIndex,
                  } = playerState.deserialize();

                  onAddPreset({
                    loginUrl,
                    signUpUrl,
                    analyticsData: loaderData?.analytics ?? null,
                    analyticsLocation,
                    index,
                    metadata,
                    onItemSelected,
                    presetListData,
                    station,
                    queue,
                    queueIndex,
                    user,
                    trackAddPreset,
                    pageName,
                    onInAppMessageOpen,
                    onInAppMessageExit,
                  });
                }}
                ref={index === '0' ? triggerRef : null}
              />;
        }}
      </PresetList>
      {(
        !isInDrawer &&
        triggerRef.current &&
        presetsLength === 0 &&
        hasFetchedPresets &&
        shouldShowPopover &&
        isHydrated
      ) ?
        <PresetPopover triggerRef={triggerRef} />
      : null}
    </Box>
  );
}
