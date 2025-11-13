import { lightDark, vars } from '@iheartradio/web.accomplice';
import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import { Text } from '@iheartradio/web.accomplice/components/text';
import { Pencil } from '@iheartradio/web.accomplice/icons/pencil';
import { StationEnum } from '@iheartradio/web.api/amp';
import { MediaServerURL } from '@iheartradio/web.assets';
import * as Playback from '@iheartradio/web.playback';
import { useTheme } from '@iheartradio/web.remix-shared/react/theme.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { isEmpty, isNonNullish } from 'remeda';
import { $path } from 'safe-routes';

import type { RegGateContext } from '~app/analytics/data';
import { useInAppMessage } from '~app/analytics/in-app-message';
import { playlistAnalyticsData } from '~app/analytics/playlist-analytics-helper';
import { addRegGateToast } from '~app/analytics/reg-gate-toast';
import { searchOpen } from '~app/analytics/search-open';
import { trackClick } from '~app/analytics/track-click';
import { useItemSelected } from '~app/analytics/use-item-selected';
import type { RecentlyPlayedResults } from '~app/api/types';
import {
  CardCarousel,
  CardCarouselSlide,
} from '~app/components/card-carousel/card-carousel';
import {
  ContentCard,
  ContentCardImage,
} from '~app/components/content-card/content-card';
import { useIsMobile } from '~app/contexts/is-mobile';
import { useSearchSessionContext } from '~app/contexts/search-session';
import { useUser } from '~app/contexts/user';
import { useLoginUrl, useSignUpUrl } from '~app/hooks/auth-urls';
import { Play } from '~app/playback/controls/play';
import type { UseLivePlayProps } from '~app/playback/controls/play/use-live-play';
import { playback } from '~app/playback/playback';
import {
  usePrefetchRecentlyPlayed,
  useQueryRecentlyPlayedStations,
} from '~app/queries/recently-played';
import {
  ANALYTICS_LOCATION,
  ANALYTICS_ORIGIN,
  AnalyticsContext,
  PAYLOAD_TRIGGER_TYPES,
  RECENTLY_PLAYED_MESSAGE,
  REG_GATE_TOAST_EXIT_TYPE,
  REG_GATE_TOAST_MESSAGE_TYPE,
  Routes,
} from '~app/utilities/constants';
import { makeArtistSlug } from '~app/utilities/slugs/artist-slug';
import { makeLiveStationSlug } from '~app/utilities/slugs/get-live-profile-slug';
import { makePlaylistSlug } from '~app/utilities/slugs/get-playlist-profile-slug';
import { makePodcastSlug } from '~app/utilities/slugs/get-podcast-profile-slug';
import { buildArtistUrl, buildLiveUrl } from '~app/utilities/urls';
import { isAnonymousUser, isPremiumUser } from '~app/utilities/user';
import { getRecentlyPlayedArtwork } from '~app/utilities/utilities';

import { EmptyStateAuth, EmptyStateUnauth } from './empty-states';
import type { RecentlyPlayedPages } from './mapping';
import { RecentlyPlayedMapping } from './mapping';

type SlideProps = {
  station: RecentlyPlayedResults[number];
  pageName: string;
  index: number;
  sectionPosition: number;
  title?: string;
};

const playedFrom = 204;

export function LiveSlide({
  index,
  pageName,
  sectionPosition,
  station,
  title = '',
}: SlideProps) {
  const isMobile = useIsMobile();
  const theme = useTheme();

  const { onItemSelected } = useItemSelected();
  const StationName = station.name ?? station.content?.at(0)?.name ?? 'iHeart';

  const itemSelectedCallback = useCallback(() => {
    onItemSelected({
      pageName,
      section: title,
      context: AnalyticsContext.Carousel,
      itemPosition: index,
      sectionPosition,
      assets: {
        asset: {
          id: `${Playback.StationType.Live}|${station?.id}`,
          name: StationName,
          type: Playback.StationType.Live,
        },
      },
    });
  }, [
    pageName,
    index,
    onItemSelected,
    sectionPosition,
    title,
    station,
    StationName,
  ]);

  const context = useMemo(
    () => ({
      pageName,
      playedFrom,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
      sectionName: title,
    }),
    [pageName, title],
  );

  const playProps: UseLivePlayProps = {
    context,
    id: Number(station.id),
  };

  const { playing } = Play.useLivePlay(playProps);

  if (!station || isEmpty(station)) {
    return null;
  }

  const liveUrl = station.id ? buildLiveUrl({ ...station }) : undefined;

  return station.id ?
      <CardCarouselSlide>
        <ContentCard
          href={liveUrl}
          image={
            <ContentCardImage
              alt={StationName}
              decoding={index === 0 ? 'sync' : 'auto'}
              index={index}
              src={MediaServerURL.fromCatalog({ type: 'live', id: station.id })
                .new()
                .flood(theme === 'dark' ? '#27292D' : '#FFF')
                .swap()
                .merge('over')}
              width={isMobile ? 75 : 150}
            />
          }
          imageButton={
            <Play.Live
              {...playProps}
              goToNowPlaying="onPlay"
              liveSlug={makeLiveStationSlug(
                station.name ?? station.content?.at(0)?.name,
                station.id,
              )}
              name={station.name ?? station.content?.at(0)?.name}
              onPress={itemSelectedCallback}
              size={48}
            />
          }
          isActive={playing}
          onNavigation={itemSelectedCallback}
          previewShape="square"
        />
      </CardCarouselSlide>
    : null;
}

export function ArtistSlide({
  index,
  pageName,
  sectionPosition,
  station,
  title = '',
}: SlideProps) {
  const { onItemSelected } = useItemSelected();
  const isMobile = useIsMobile();

  const itemSelectedCallback = useCallback(() => {
    onItemSelected({
      pageName,
      section: title,
      context: AnalyticsContext.Carousel,
      itemPosition: index,
      sectionPosition,
      assets: {
        asset: {
          id: `${Playback.StationType.Artist}|${station?.seedArtistId}`,
          name: station?.name ?? '',
        },
      },
    });
  }, [pageName, index, onItemSelected, sectionPosition, title, station]);

  const context = useMemo(
    () => ({
      pageName,
      playedFrom,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
      sectionName: title,
    }),
    [pageName, title],
  );

  const { playing } = Play.useArtistPlay({
    context,
    id: Number(station?.seedArtistId),
  });

  if (isEmpty(station)) {
    return null;
  }

  const artistUrl =
    station.seedArtistId && station.name ?
      buildArtistUrl({
        id: station.seedArtistId,
        name: station.name,
      })
    : undefined;

  return (
    <CardCarouselSlide>
      <ContentCard
        href={artistUrl}
        image={
          <ContentCardImage
            alt={station.name ?? station.content?.[0]?.name ?? 'iHeart'}
            decoding={index === 0 ? 'sync' : 'auto'}
            index={index}
            src={MediaServerURL.fromCatalog({
              type: 'artist',
              id: String(station?.seedArtistId),
            }).run('circle')}
            width={isMobile ? 75 : 150}
          />
        }
        imageButton={
          <Play.Artist
            artistSlug={
              isNonNullish(station.seedArtistId) ?
                makeArtistSlug(station.name, station.seedArtistId)
              : undefined
            }
            context={context}
            goToNowPlaying="onPlay"
            id={Number(station?.seedArtistId)}
            name={station.name ?? station.content?.[0]?.name}
            onPress={itemSelectedCallback}
            size={48}
          />
        }
        isActive={playing}
        onNavigation={itemSelectedCallback}
        previewShape="circle"
      />
    </CardCarouselSlide>
  );
}

export function PodcastSlide({
  index,
  pageName,
  sectionPosition,
  station,
  title = '',
}: SlideProps) {
  const { onItemSelected } = useItemSelected();
  const isMobile = useIsMobile();

  const itemSelectedCallback = useCallback(() => {
    onItemSelected({
      pageName,
      section: title,
      context: AnalyticsContext.Carousel,
      itemPosition: index,
      sectionPosition,
      assets: {
        asset: {
          id: `${Playback.StationType.Podcast}|${station?.id}`,
          name: station?.name ?? '',
        },
      },
    });
  }, [pageName, index, onItemSelected, sectionPosition, title, station]);

  const context = useMemo(
    () => ({
      pageName,
      playedFrom,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
      sectionName: title,
    }),
    [pageName, title],
  );

  const { playing } = Play.usePodcastPlay({
    context,
    id: Number(station.id),
  });

  if (isEmpty(station)) {
    return null;
  }

  const podcastSlug =
    isNonNullish(station.id) ?
      makePodcastSlug(station.slug ?? station.content?.[0]?.name, station.id)
    : undefined;

  return station.id ?
      <CardCarouselSlide>
        <ContentCard
          href={
            podcastSlug ?
              $path('/podcast/:podcastSlug', { podcastSlug })
            : undefined
          }
          image={
            <ContentCardImage
              alt={station.name ?? station.content?.[0]?.name ?? 'iHeart'}
              decoding={index === 0 ? 'sync' : 'auto'}
              index={index}
              src={MediaServerURL.fromCatalog({
                type: 'podcast',
                id: station.id,
              })}
              width={isMobile ? 75 : 150}
            />
          }
          imageButton={
            <Play.Podcast
              context={context}
              goToNowPlaying="onPlay"
              id={Number(station.id)}
              name={station.name ?? station.content?.[0]?.name}
              onPress={itemSelectedCallback}
              podcastSlug={podcastSlug}
              size={48}
            />
          }
          isActive={playing}
          onNavigation={itemSelectedCallback}
          previewShape="square"
        />
      </CardCarouselSlide>
    : null;
}

export function PlaylistSlide({
  index,
  pageName,
  sectionPosition,
  station,
  title = '',
}: SlideProps) {
  const user = useUser();
  const userIsPremium = isPremiumUser(user);
  const isMobile = useIsMobile();

  const { onItemSelected } = useItemSelected();

  const type =
    userIsPremium ?
      Playback.StationType.Playlist
    : Playback.StationType.PlaylistRadio;

  const context = useMemo(
    () => ({
      pageName,
      playedFrom,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
      sectionName: title,
    }),
    [pageName, title],
  );

  const { playing } = Play.usePlaylistPlay({
    context,
    id: `${Number(station.ownerId)}::${station.playlistId}`,
    type,
  });

  const playlistAssets = playlistAnalyticsData({
    isCurated: true,
    playlistId: station.playlistId ?? '',
    profileId: user?.profileId?.toString() ?? '',
    playlistUserId: station.ownerId ?? '',
    playlistName: station.name ?? '',
    userType: user?.subscription?.type,
    isAnonymous: isAnonymousUser(user) ?? true,
    playlistType: type,
  });

  const playlistSlug = makePlaylistSlug({
    name: station?.name ?? station.content?.[0]?.name,
    userId: station?.ownerId,
    id: station?.playlistId,
  });

  const itemSelectedCallback = useCallback(() => {
    onItemSelected({
      pageName,
      section: title,
      context: AnalyticsContext.Carousel,
      itemPosition: index,
      sectionPosition,
      assets: {
        asset: playlistAssets.asset,
      },
    });
  }, [
    pageName,
    index,
    onItemSelected,
    playlistAssets.asset,
    sectionPosition,
    title,
  ]);

  return (
    <CardCarouselSlide>
      <ContentCard
        href={
          playlistSlug ?
            $path('/playlist/:playlistSlug', { playlistSlug })
          : undefined
        }
        image={
          <ContentCardImage
            alt={station.name ?? station.content?.[0]?.name ?? 'iHeart'}
            decoding={index === 0 ? 'sync' : 'auto'}
            index={index}
            src={getRecentlyPlayedArtwork(station)}
            width={isMobile ? 75 : 150}
          />
        }
        imageButton={
          // We don't have enough information to know if the playlist is premium or not so we're hiding the play button for free users
          userIsPremium ?
            <Play.Playlist
              context={context}
              goToNowPlaying="onPlay"
              id={`${Number(station.ownerId)}::${station.playlistId}`}
              name={station.name ?? station.content?.[0]?.name}
              onPress={itemSelectedCallback}
              playlistSlug={playlistSlug}
              shuffle={false}
              size={48}
              type={type}
            />
          : null
        }
        isActive={playing}
        onNavigation={itemSelectedCallback}
        previewShape="square"
      />
    </CardCarouselSlide>
  );
}

export function FavoritesSlide({
  station,
  pageName,
  index,
  sectionPosition,
}: SlideProps) {
  const { onItemSelected } = useItemSelected();
  const isMobile = useIsMobile();

  const { name, seedProfileId } = station;

  const title = 'My Favorites Radio';

  const context = useMemo(
    () => ({
      pageName,
      playedFrom,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
      sectionName: title,
    }),
    [pageName],
  );

  const itemSelectedCallback = useCallback(() => {
    onItemSelected({
      pageName,
      section: title,
      context: AnalyticsContext.Carousel,
      assets: {
        asset: {
          id: `${Playback.StationType.Favorites}|${seedProfileId}`,
          name: name ?? '',
        },
      },
      sectionPosition,
      itemPosition: index,
    });
  }, [
    pageName,
    index,
    onItemSelected,
    seedProfileId,
    sectionPosition,
    title,
    name,
  ]);

  const { playing } = Play.useFavoritesPlay({
    context,
    id: Number(seedProfileId),
  });

  return (
    <CardCarouselSlide>
      <ContentCard
        href={
          isNonNullish(seedProfileId) ?
            $path('/favorites/:userId?', {
              userId: seedProfileId,
            })
          : undefined
        }
        image={
          <ContentCardImage
            alt={title}
            decoding={index === 0 ? 'sync' : 'auto'}
            index={index}
            src={MediaServerURL.fromCatalog({
              type: 'favorites',
              id: String(seedProfileId),
            })}
            width={isMobile ? 75 : 150}
          />
        }
        imageButton={
          <Play.Favorites
            context={context}
            goToNowPlaying="onPlay"
            id={Number(seedProfileId ?? 0)}
            name={name ?? ''}
            onPress={itemSelectedCallback}
            size={48}
          />
        }
        isActive={playing}
        onNavigation={itemSelectedCallback}
        previewShape="square"
      />
    </CardCarouselSlide>
  );
}

export const Slide = ({
  station,
  pageName,
  index,
  sectionPosition,
  title,
}: {
  station: RecentlyPlayedResults[number];
  pageName: string;
  index: number;
  sectionPosition: number;
  title: string;
}) => {
  switch (station.stationType) {
    case StationEnum.LIVE: {
      return (
        <LiveSlide
          index={index}
          pageName={pageName}
          sectionPosition={sectionPosition}
          station={station}
          title={title}
        />
      );
    }

    case StationEnum.ARTIST: {
      return (
        <ArtistSlide
          index={index}
          pageName={pageName}
          sectionPosition={sectionPosition}
          station={station}
          title={title}
        />
      );
    }

    case StationEnum.PODCAST: {
      return (
        <PodcastSlide
          index={index}
          pageName={pageName}
          sectionPosition={sectionPosition}
          station={station}
          title={title}
        />
      );
    }

    case StationEnum.COLLECTION: {
      return (
        <PlaylistSlide
          index={index}
          pageName={pageName}
          sectionPosition={sectionPosition}
          station={station}
          title={title}
        />
      );
    }

    case StationEnum.FAVORITES: {
      return (
        <FavoritesSlide
          index={index}
          pageName={pageName}
          sectionPosition={sectionPosition}
          station={station}
          title={title}
        />
      );
    }

    default: {
      return null;
    }
  }
};

Slide.displayName = 'RecentlyPlayedCarouselSlide';

export function RecentlyPlayedCarousel({
  sectionPosition,
}: {
  sectionPosition: number;
}) {
  const { pageName } = useLoaderData<{ pageName: RecentlyPlayedPages }>();
  const player = playback.usePlayer();
  const user = useUser();

  const navigate = useNavigate();
  const { onInAppMessageOpen, onInAppMessageExit } = useInAppMessage();
  const searchSession = useSearchSessionContext();

  const [queryEnabled, setQueryEnabled] = useState(false);
  useEffect(() => {
    if (isNonNullish(user?.profileId)) {
      setQueryEnabled(true);
    }
  }, [user?.profileId]);

  const { title, titleSlug, stationTypes } =
    RecentlyPlayedMapping[pageName].common;

  const { description, logo } =
    RecentlyPlayedMapping[pageName].states[user?.isAnonymous ? 'anon' : 'auth'];

  const editable = RecentlyPlayedMapping[pageName].editable;

  const {
    data: stations,
    isLoading,
    refetch,
  } = useQueryRecentlyPlayedStations({
    stationTypes,
    enabled: queryEnabled,
  });

  const regGateContext = {
    trigger: PAYLOAD_TRIGGER_TYPES.RECENTLY_PLAYED,
    origin: ANALYTICS_ORIGIN.LISTEN,
    location: 'edit_icon',
    pageName,
  } satisfies RegGateContext;

  const loginUrl = useLoginUrl({ context: regGateContext });
  const signUpUrl = useSignUpUrl({ context: regGateContext });

  const prefetchRecentlyPlayed = usePrefetchRecentlyPlayed();

  useEffect(() => {
    return player.subscribe({
      play() {
        refetch();
      },
    });
  }, [player, refetch]);

  const carouselItems = useMemo(
    () =>
      stations?.map((item, index) =>
        item.stationType === StationEnum.COLLECTION ?
          { ...item, id: `${item.ownerId}-${index}`, index }
        : { ...item, index },
      ),
    [stations],
  );

  if (!stations || stations?.length === 0 || isLoading) {
    return user?.isAnonymous ?
        <EmptyStateUnauth
          carouselSlideGap={vars.space[12]}
          description={description}
          editable={editable}
          logo={logo}
          title={title}
          titleSlug={titleSlug}
        />
      : <EmptyStateAuth
          carouselSlideGap={vars.space[12]}
          description={description}
          editable={editable}
          logo={logo}
          onPress={() => {
            searchOpen({
              search: {
                sessionId: searchSession.get('sessionId'),
              },
              view: {
                pageName: 'home',
              },
              event: {
                location: 'recently_played',
              },
            });
            navigate($path(Routes.Search));
          }}
          title={title}
          titleSlug={titleSlug}
        />;
  }

  return (
    <CardCarousel
      items={carouselItems}
      kind="recently-played"
      slideGap={vars.space[12]}
      title={
        <Flex alignItems="center" flex={1} gap={vars.space[12]}>
          <Text
            as="h3"
            color={lightDark(vars.color.gray600, vars.color.brandWhite)}
            css={{ whiteSpace: 'nowrap' }}
            kind={{ mobile: 'h4', large: 'h3' }}
          >
            {title}
          </Text>
          <Flex
            justifyContent={{ mobile: 'flex-end', medium: 'flex-start' }}
            width="100%"
          >
            {editable ?
              <Button
                color="default"
                kind="tertiary"
                onHoverStart={() => {
                  prefetchRecentlyPlayed();
                }}
                onPress={() => {
                  trackClick({
                    pageName,
                    sectionName: 'recently_played',
                    location: 'edit',
                  });

                  return user?.isAnonymous ?
                      addRegGateToast({
                        kind: 'info',
                        text: RECENTLY_PLAYED_MESSAGE,
                        onInAppMessageOpen,
                        onInAppMessageExit,
                        messageType:
                          REG_GATE_TOAST_MESSAGE_TYPE.RECENTLY_PLAYED,
                        userTriggered: true,
                        pageName,
                        actions: [
                          {
                            kind: 'tertiary',
                            size: { mobile: 'small', medium: 'large' },
                            color: 'gray',
                            textColor: vars.color.gray600,
                            href: loginUrl.toString(),
                            onPress: () => {
                              onInAppMessageExit({
                                messageType:
                                  REG_GATE_TOAST_MESSAGE_TYPE.RECENTLY_PLAYED,
                                exitType:
                                  REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                                pageName,
                              });
                            },
                            content: 'Log in',
                          },
                          {
                            kind: 'tertiary',
                            size: { xsmall: 'small', medium: 'large' },
                            color: 'gray',
                            textColor: vars.color.gray600,
                            href: signUpUrl.toString(),
                            onPress: () => {
                              onInAppMessageExit({
                                messageType:
                                  REG_GATE_TOAST_MESSAGE_TYPE.RECENTLY_PLAYED,
                                exitType:
                                  REG_GATE_TOAST_EXIT_TYPE.CLICK_SUCCESS,
                                pageName,
                              });
                            },
                            content: 'Sign up',
                          },
                        ],
                      })
                    : navigate($path(Routes.RecentlyPlayed));
                }}
                size="icon"
              >
                <Pencil size={24} />
              </Button>
            : null}
          </Flex>
        </Flex>
      }
    >
      {({ index, ...station }) => {
        return (
          <Slide
            index={index}
            key={`recentlyPlayed-${station.stationType}-${index}`}
            pageName={pageName}
            sectionPosition={sectionPosition}
            station={station}
            title={title}
          />
        );
      }}
    </CardCarousel>
  );
}
