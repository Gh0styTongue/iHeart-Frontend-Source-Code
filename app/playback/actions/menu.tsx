import { Button } from '@iheartradio/web.accomplice/components/button';
import { Flex } from '@iheartradio/web.accomplice/components/flex';
import {
  MenuContent,
  MenuItem,
  MenuTrigger,
} from '@iheartradio/web.accomplice/components/menu';
import { PlayerTooltip } from '@iheartradio/web.accomplice/components/player';
import { EllipsisHorizontal } from '@iheartradio/web.accomplice/icons/ellipsis-horizontal';
import {
  MARK_AS_PLAYED_ACTION,
  MARK_AS_UNPLAYED_ACTION,
  StationType,
} from '@iheartradio/web.playback';
import { memo, useCallback, useState } from 'react';
import { useFetcher } from 'react-router';
import { isNullish } from 'remeda';

import { useFollowUnfollowEvent } from '~app/analytics/follow-unfollow';
import { trackClick } from '~app/analytics/track-click';
import { PresetMenuItem } from '~app/components/menu-items/preset-menu-item';
import { useGetPageName } from '~app/hooks/use-get-page-name';
import { useFollowArtist, useFollowingArtist } from '~app/queries/artist';
import {
  useFollowingLiveStation,
  useFollowLiveStation,
} from '~app/queries/live';
import { useFollowingPlaylist, useFollowPlaylist } from '~app/queries/playlist';
import { useFollowingPodcast, useFollowPodcast } from '~app/queries/podcast';
import { PresetStationTypes } from '~app/routes/_app/_index/components/presets-carousel';
import {
  ANALYTICS_LOCATION,
  AnalyticsContext,
  AnalyticsSaveTypes,
  PRESETS_EVENTS,
} from '~app/utilities/constants';
import {
  buildAlbumUrl,
  buildArtistUrl,
  buildLiveUrl,
  buildPlaylistUrl,
  buildPodcastEpisodeUrl,
  buildPodcastUrl,
} from '~app/utilities/urls';

import { playback } from '../playback';

const canGoToArtist = new Set([
  StationType.Album,
  StationType.Live,
  StationType.Scan,
  StationType.Artist,
  StationType.Favorites,
  StationType.Podcast,
  StationType.Playlist,
  StationType.PlaylistRadio,
  StationType.TopSongs,
]);

const canGoToAlbum = new Set([
  StationType.Album,
  StationType.Artist,
  StationType.Favorites,
  StationType.Playlist,
  StationType.PlaylistRadio,
  StationType.TopSongs,
]);

const canGoToPlaylist = new Set([
  StationType.Playlist,
  StationType.PlaylistRadio,
]);

const FollowPodcast = memo(function FollowPodcast({
  podcastId,
  podcastName,
  setIsMenuOpen,
}: {
  podcastId: number;
  podcastName: string;
  setIsMenuOpen?: (open: boolean) => void;
}) {
  const isFollowing = useFollowingPodcast(podcastId);
  const { onFollowUnfollow } = useFollowUnfollowEvent();
  const pageName = useGetPageName();
  const { follow, unfollow } = useFollowPodcast({
    context: ANALYTICS_LOCATION.MINIPLAYER_OVERFLOW,
    isOnProfilePage: pageName.includes('profile'),
    stationId: podcastId,
    stationName: podcastName,
  });

  const trackFollowUnfollow = useCallback(
    (type: AnalyticsSaveTypes.Follow | AnalyticsSaveTypes.Unfollow) =>
      onFollowUnfollow({
        pageName,
        section: 'player',
        context: AnalyticsContext.Overflow,
        assets: {
          asset: {
            id: `${StationType.Podcast}|${podcastId}`,
            name: podcastName ?? '',
          },
        },
        type,
      }),
    [onFollowUnfollow, pageName, podcastId, podcastName],
  );

  return (
    <MenuItem
      closeOnSelect={false}
      onAction={() => {
        return isFollowing ?
            unfollow(
              {
                podcastId,
              },
              {
                onSuccess: () => {
                  trackFollowUnfollow(AnalyticsSaveTypes.Unfollow);
                  setIsMenuOpen?.(false);
                },
              },
            )
          : follow(
              {
                podcastId,
              },
              {
                onSuccess: () => {
                  trackFollowUnfollow(AnalyticsSaveTypes.Follow);
                  setIsMenuOpen?.(false);
                },
              },
            );
      }}
    >
      {isFollowing ? 'Unfollow podcast' : 'Follow podcast'}
    </MenuItem>
  );
});

const FollowPlaylist = memo(function FollowPlaylist({
  playlistId,
  playlistName,
  userId,
  setIsMenuOpen,
}: {
  playlistId: string;
  playlistName: string;
  userId: string;
  setIsMenuOpen?: (open: boolean) => void;
}) {
  const isFollowing = useFollowingPlaylist({ id: playlistId, userId });
  const pageName = useGetPageName();
  const { follow, unfollow } = useFollowPlaylist({
    context: ANALYTICS_LOCATION.MINIPLAYER_OVERFLOW,
    isOnProfilePage: pageName.includes('profile'),
    stationId: playlistId,
    stationName: playlistName,
  });
  const { onFollowUnfollow } = useFollowUnfollowEvent();

  const trackFollowUnfollow = useCallback(
    (type: AnalyticsSaveTypes.Follow | AnalyticsSaveTypes.Unfollow) =>
      onFollowUnfollow({
        pageName,
        context: AnalyticsContext.Overflow,
        section: 'player',
        assets: {
          asset: {
            id: `${StationType.Playlist}|${playlistId}`,
            name: playlistName ?? '',
          },
        },
        type,
      }),
    [onFollowUnfollow, pageName, playlistId, playlistName],
  );

  return (
    <MenuItem
      closeOnSelect={false}
      onAction={() => {
        return isFollowing ?
            unfollow(
              {
                id: playlistId,
                userId,
              },
              {
                onSuccess: () => {
                  trackFollowUnfollow(AnalyticsSaveTypes.Unfollow);
                  setIsMenuOpen?.(false);
                },
              },
            )
          : follow(
              {
                id: playlistId,
                userId,
              },
              {
                onSuccess: () => {
                  trackFollowUnfollow(AnalyticsSaveTypes.Follow);
                  setIsMenuOpen?.(false);
                },
              },
            );
      }}
    >
      {isFollowing ? 'Unfollow playlist' : 'Follow playlist'}
    </MenuItem>
  );
});

const FollowArtist = memo(function FollowArtist({
  artistId,
  artistName,
  setIsMenuOpen,
}: {
  artistId: string;
  artistName: string;
  setIsMenuOpen?: (open: boolean) => void;
}) {
  const isFollowing = useFollowingArtist(artistId);
  const pageName = useGetPageName();
  const { follow, unfollow } = useFollowArtist({
    context: ANALYTICS_LOCATION.OVERFLOW_MENU,
    isOnProfilePage: pageName.includes('profile'),
    stationId: artistId,
    stationName: artistName,
  });
  const { onFollowUnfollow } = useFollowUnfollowEvent();

  const trackFollowUnfollow = useCallback(
    (type: AnalyticsSaveTypes.Follow | AnalyticsSaveTypes.Unfollow) =>
      onFollowUnfollow({
        pageName,
        context: AnalyticsContext.Overflow,
        section: 'player',
        assets: {
          asset: {
            id: `${StationType.Artist}|${artistId}`,
            name: artistName ?? '',
          },
        },
        type,
      }),
    [onFollowUnfollow, pageName, artistId, artistName],
  );

  return (
    <MenuItem
      closeOnSelect={false}
      onAction={() => {
        return isFollowing ?
            unfollow(
              { artistId },
              {
                onSuccess: () => {
                  trackFollowUnfollow(AnalyticsSaveTypes.Unfollow);
                  setIsMenuOpen?.(false);
                },
              },
            )
          : follow(
              { artistId },
              {
                onSuccess: () => {
                  trackFollowUnfollow(AnalyticsSaveTypes.Follow);
                  setIsMenuOpen?.(false);
                },
              },
            );
      }}
    >
      {isFollowing ? 'Unfollow artist' : 'Follow artist'}
    </MenuItem>
  );
});

const FollowLive = memo(function FollowLive({
  setIsMenuOpen,
  stationId,
  stationName,
}: {
  setIsMenuOpen?: (open: boolean) => void;
  stationId: string;
  stationName: string;
}) {
  const isFollowing = useFollowingLiveStation(stationId);
  const { onFollowUnfollow } = useFollowUnfollowEvent();
  const pageName = useGetPageName();
  const { follow, unfollow } = useFollowLiveStation({
    context: ANALYTICS_LOCATION.MINIPLAYER_OVERFLOW,
    isOnProfilePage: pageName.includes('profile'),
    profileStationId: stationId,
    stationName,
  });

  const trackFollowUnfollow = useCallback(
    (type: AnalyticsSaveTypes.Follow | AnalyticsSaveTypes.Unfollow) =>
      onFollowUnfollow({
        pageName,
        section: 'player',
        context: AnalyticsContext.Overflow,
        assets: {
          asset: {
            id: `${StationType.Live}|${stationId}`,
            name: stationName ?? '',
          },
        },
        type,
      }),
    [onFollowUnfollow, pageName, stationId, stationName],
  );

  return (
    <MenuItem
      closeOnSelect={false}
      onAction={() => {
        return isFollowing ?
            unfollow(
              {
                stationId,
              },
              {
                onSuccess: () => {
                  trackFollowUnfollow(AnalyticsSaveTypes.Unfollow);
                  setIsMenuOpen?.(false);
                },
              },
            )
          : follow(
              {
                stationId,
              },
              {
                onSuccess: () => {
                  trackFollowUnfollow(AnalyticsSaveTypes.Follow);
                  setIsMenuOpen?.(false);
                },
              },
            );
      }}
    >
      {isFollowing ? 'Unfollow station' : 'Follow station'}
    </MenuItem>
  );
});

export function Menu({ isHidden }: { isHidden?: boolean }) {
  const state = playback.useState();
  const metadata = playback.useMetadata();
  const pageName = useGetPageName();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fetcher = useFetcher();
  const markEpisodeAsPlayed = playback.useMarkEpisodeAsPlayed();
  const { adBreak } = playback.useAds();

  if (isNullish(state.station) || isNullish(metadata)) {
    return null;
  }

  const [userId, playlistId] = String(state.station.id).split('::');

  const { type } = state.station;

  const {
    id,
    artistId,
    artistName,
    albumId,
    albumName,
    completed,
    podcastId,
    podcastSlug,
    followable,
    transcriptionAvailable,
    title,
    subtitle,
  } = metadata.data;

  const {
    artistId: stationArtistId,
    id: stationId,
    meta,
    name,
  } = state.station;

  const albumUrl =
    artistId && albumId && albumName ?
      buildAlbumUrl({
        artist: { id: artistId, name: artistName ?? '' },
        album: { id: albumId, name: albumName },
      })
    : undefined;
  const artistUrl =
    artistId ?
      buildArtistUrl({ id: artistId, name: artistName ?? '' })
    : undefined;
  const stationUrl = id ? buildLiveUrl({ name: subtitle, id }) : undefined;
  const podcastUrl =
    podcastId && podcastSlug ?
      buildPodcastUrl({ podcastId, slug: podcastSlug })
    : undefined;
  const episodeUrl =
    id && podcastId && podcastSlug && subtitle ?
      buildPodcastEpisodeUrl({
        podcastId,
        podcastSlug,
        episodeId: id,
        episodeName: subtitle,
      })
    : undefined;
  const playlistUrl =
    playlistId && userId ?
      buildPlaylistUrl({
        name: subtitle ?? '',
        userId,
        id: playlistId,
      })
    : undefined;

  const isPlaylist =
    type === StationType.Playlist || type === StationType.PlaylistRadio;

  const artistPlaybackTypes = [
    StationType.Artist,
    StationType.Album,
    StationType.TopSongs,
  ];

  const presetId =
    artistPlaybackTypes.includes(type) && stationArtistId ?
      stationArtistId
    : stationId;

  return (
    <Flex isHidden={isHidden ?? { mobile: true, 'container-large': false }}>
      <PlayerTooltip content="More Options">
        <MenuTrigger isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <Button color="default" kind="tertiary" size="icon">
            <EllipsisHorizontal size={32} />
          </Button>
          <MenuContent>
            <PresetMenuItem
              location={PRESETS_EVENTS.MINIPLAYER_OVERFLOW}
              station={{
                id: presetId.toString(),
                title: name ?? 'Station',
                imageUrl: isPlaylist ? meta?.image : undefined,
              }}
              stationType={
                PresetStationTypes[type as keyof typeof PresetStationTypes]
              }
            />
            {(
              (type === StationType.PlaylistRadio ||
                type === StationType.Playlist) &&
              followable &&
              playlistId
            ) ?
              <FollowPlaylist
                playlistId={playlistId}
                playlistName={subtitle ?? title ?? ''}
                setIsMenuOpen={setIsMenuOpen}
                userId={userId}
              />
            : null}
            {type === StationType.Artist && artistId ?
              <FollowArtist
                artistId={artistId}
                artistName={artistName}
                setIsMenuOpen={setIsMenuOpen}
              />
            : null}
            {(type === StationType.Live || type === StationType.Scan) && id ?
              <FollowLive
                setIsMenuOpen={setIsMenuOpen}
                stationId={id}
                stationName={meta?.title ?? ''}
              />
            : null}
            {(
              (type === StationType.Live || type === StationType.Scan) &&
              stationUrl
            ) ?
              <MenuItem href={stationUrl}>Go to station</MenuItem>
            : null}
            {canGoToPlaylist && playlistUrl ?
              <MenuItem href={playlistUrl}>Go to playlist</MenuItem>
            : null}
            {canGoToArtist.has(type) && artistUrl ?
              <MenuItem href={artistUrl}>Go to artist</MenuItem>
            : null}
            {canGoToAlbum.has(type) && albumUrl ?
              <MenuItem data-test="go-to-album-option" href={albumUrl}>
                Go to album
              </MenuItem>
            : null}
            {type === StationType.Podcast && podcastId ?
              <FollowPodcast
                podcastId={podcastId}
                podcastName={subtitle ?? ''}
                setIsMenuOpen={setIsMenuOpen}
              />
            : null}
            {type === StationType.Podcast && podcastUrl ?
              <MenuItem href={podcastUrl}>Go to podcast</MenuItem>
            : null}
            {type === StationType.Podcast && episodeUrl ?
              <MenuItem href={episodeUrl}>View episode info</MenuItem>
            : null}
            {transcriptionAvailable && episodeUrl ?
              <>
                <MenuItem
                  data-test="view-episode-transcript-option"
                  href={`${episodeUrl}?viewTranscription=true`}
                  onAction={() =>
                    trackClick({
                      pageName,
                      location: 'miniplayer_overflow|transcription_option',
                    })
                  }
                  routerOptions={{
                    preventScrollReset: true,
                  }}
                >
                  View episode transcript
                </MenuItem>
              </>
            : null}
            {type === StationType.Podcast && !adBreak ?
              <MenuItem
                onAction={() => {
                  const action =
                    completed ? MARK_AS_UNPLAYED_ACTION : MARK_AS_PLAYED_ACTION;

                  markEpisodeAsPlayed({ action, episodeId: id });

                  fetcher.submit(
                    { type: action, episodeId: id },
                    {
                      action: podcastUrl,
                      method: 'POST',
                    },
                  );
                }}
              >
                {completed ? 'Mark as unplayed' : 'Mark as played'}
              </MenuItem>
            : null}
          </MenuContent>
        </MenuTrigger>
      </PlayerTooltip>
    </Flex>
  );
}
