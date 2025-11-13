import { Flex } from '@iheartradio/web.accomplice/components/flex';
import {
  SelectField,
  SelectOption,
} from '@iheartradio/web.accomplice/components/select-field';
import { Text } from '@iheartradio/web.accomplice/components/text';
import * as Playback from '@iheartradio/web.playback';
import { type Key, useCallback, useMemo, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { isString } from 'remeda';
import { isNonNullish, isNullish, toSnakeCase } from 'remeda';
import { $path } from 'safe-routes';

import { trackClick } from '~app/analytics/track-click';
import { useItemSelected } from '~app/analytics/use-item-selected';
import {
  CardCarousel,
  CardCarouselSlide,
} from '~app/components/card-carousel/card-carousel';
import { ContentCardImage } from '~app/components/content-card/content-card';
import { RankedContentCard } from '~app/components/content-card/ranked-content-card';
import { useConfig } from '~app/contexts/config';
import { useIsMobile } from '~app/contexts/is-mobile';
import { useUser } from '~app/contexts/user';
import { Play } from '~app/playback/controls/play';
import {
  type RankersTopPlaylistsResponse,
  DEFAULT_PLAYLIST_GENRE,
  DEFAULT_PLAYLIST_MOOD,
  PLAYLIST_GENRE_KEY,
  PLAYLIST_MOOD_KEY,
  useQueryRankersTopPlaylists,
} from '~app/queries/rankers-top-playlists';
import { ANALYTICS_LOCATION, AnalyticsContext } from '~app/utilities/constants';
import { makePlaylistSlug } from '~app/utilities/slugs/get-playlist-profile-slug';
import { isPremiumUser } from '~app/utilities/user';

export type TopPlaylists = RankersTopPlaylistsResponse;

export type PlaylistMoods = TopPlaylists['moods'];

export type PlaylistGenres = TopPlaylists['genres'];

export type TopPlaylist = TopPlaylists['data'][number];

type PlaylistGenreSelectProps = {
  currentPlaylistGenre: string;
  genres: PlaylistGenres;
  onSelectionChange: (key: string) => void;
  pageName: string;
  stateKey?: string;
};

type PlaylistMoodSelectProps = {
  currentPlaylistMood: string;
  moods: PlaylistMoods;
  onSelectionChange: (key: string) => void;
  pageName: string;
  stateKey?: string;
};

const SECTION_TITLE = 'Top Playlists';

const BY_PLAYLIST_GENRE_STATE_KEY = 'byPlaylistGenre';

const BY_PLAYLIST_MOOD_STATE_KEY = 'byPlaylistMood';

const ALL_GENRES = 'All Genres';

const ALL_MOODS = 'All Moods';

const selectFieldcss = {
  width: 'auto',
  maxWidth: {
    xsmall: '10.6rem',
    small: '12rem',
    medium: '18rem',
  },
};

export function PlaylistGenreSelect({
  currentPlaylistGenre,
  genres,
  onSelectionChange: selectionChange,
  pageName,
  stateKey,
}: PlaylistGenreSelectProps) {
  const [_searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const onSelectionChange = useCallback(
    (key: Key | null) => {
      if (isNullish(key)) return;

      if (isString(key) && key !== currentPlaylistGenre?.toString()) {
        const filterSelection = genres[key]?.title ?? ALL_GENRES;

        trackClick({
          pageName,
          sectionName: toSnakeCase(SECTION_TITLE),
          filterType: 'genre',
          filterSelection,
          location: 'filter',
        });

        setSearchParams(
          prev => {
            prev.set(PLAYLIST_GENRE_KEY, key.toString());
            return prev;
          },
          {
            replace: true,
            preventScrollReset: true,
            state: { stateKey },
          },
        );

        selectionChange(key);
      }
    },
    [
      currentPlaylistGenre,
      genres,
      pageName,
      selectionChange,
      setSearchParams,
      stateKey,
    ],
  );

  return (
    <SelectField
      aria-label="playlist genres select field"
      css={selectFieldcss}
      data-test="playlist-genres"
      defaultSelectedKey={currentPlaylistGenre}
      isOpen={isOpen}
      items={[
        {
          key: DEFAULT_PLAYLIST_GENRE,
          label: 'All Genres',
          value: DEFAULT_PLAYLIST_GENRE,
        },
        ...Object.entries(genres).map(([genreId, genre]) => {
          return {
            key: genreId.toString(),
            label: genre.title,
            value: genreId,
          };
        }),
      ]}
      key={`GenreSelect-${currentPlaylistGenre?.toString()}`}
      name="playlistGenres"
      onBlur={() => setIsOpen(false)}
      onOpenChange={setIsOpen}
      onSelectionChange={onSelectionChange}
    >
      {item => (
        <SelectOption key={item.key} textValue={item.label}>
          {item.label}
        </SelectOption>
      )}
    </SelectField>
  );
}

export function PlaylistMoodSelect({
  currentPlaylistMood,
  moods,
  onSelectionChange: selectionChange,
  pageName,
}: PlaylistMoodSelectProps) {
  const [_searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const onSelectionChange = useCallback(
    (key: Key | null) => {
      if (isNullish(key)) return;

      if (isString(key) && key !== currentPlaylistMood.toString()) {
        const filterSelection =
          moods && !Array.isArray(moods) ?
            (moods[key]?.title ?? ALL_MOODS)
          : '';

        trackClick({
          pageName,
          sectionName: toSnakeCase(SECTION_TITLE),
          filterType: 'moods',
          filterSelection,
          location: 'filter',
        });

        setSearchParams(
          params => {
            params.set(PLAYLIST_MOOD_KEY, key.toString());
            return params;
          },
          { preventScrollReset: true },
        );

        selectionChange(key);
      }
    },
    [currentPlaylistMood, moods, pageName, selectionChange, setSearchParams],
  );

  return (
    <SelectField
      aria-label="playlist-moods"
      css={selectFieldcss}
      data-test="playlist-moods"
      defaultSelectedKey={currentPlaylistMood}
      isOpen={isOpen}
      items={[
        {
          key: DEFAULT_PLAYLIST_MOOD,
          label: 'All Moods',
          value: DEFAULT_PLAYLIST_MOOD,
        },
        ...Object.entries(moods ?? []).map(([moodId, mood]) => {
          return {
            key: moodId ?? '',
            label: mood?.title ?? '',
            value: moodId ?? '',
          };
        }),
      ]}
      key={`mood -${currentPlaylistMood?.toString()}`}
      name="playlistMoods"
      onBlur={() => setIsOpen(false)}
      onOpenChange={(isOpen: boolean) => {
        setIsOpen(isOpen);
      }}
      onSelectionChange={onSelectionChange}
    >
      {item => (
        <SelectOption key={item.key} textValue={item.label}>
          {item.label}
        </SelectOption>
      )}
    </SelectField>
  );
}

function Slide({
  pageName,
  playlist,
  index,
  sectionPosition,
}: {
  pageName: string;
  playlist: TopPlaylist;
  index: number;
  sectionPosition: number;
}) {
  const { onItemSelected } = useItemSelected();
  const isMobile = useIsMobile();
  const user = useUser();
  const userIsPremium = isPremiumUser(user);

  const type =
    userIsPremium ?
      Playback.StationType.Playlist
    : Playback.StationType.PlaylistRadio;

  const context = useMemo(
    () => ({
      pageName,
      playedFrom: 1005,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
      sectionName: SECTION_TITLE,
    }),
    [pageName],
  );

  const { playing } = Play.usePlaylistPlay({
    context,
    type,
    id: `${Number(playlist?.publishedUserId)}::${playlist?.publishedPlaylistId}`,
  });

  const playlistSlug = makePlaylistSlug({
    name: playlist?.title ?? '',
    userId: playlist?.publishedUserId ?? '',
    id: playlist?.publishedPlaylistId ?? '',
  });

  const itemSelectedCallback = useCallback(() => {
    onItemSelected({
      pageName,
      section: 'top_playlists',
      context: AnalyticsContext.Carousel,
      itemPosition: index,
      sectionPosition,
      assets: {
        asset: {
          id: `${type}|${playlist?.publishedPlaylistId}`,
          name: playlist?.title ?? '',
          type: Playback.StationType.Playlist,
        },
      },
    });
  }, [pageName, index, onItemSelected, playlist, sectionPosition, type]);

  return (
    <CardCarouselSlide>
      {({ isFocused, isHovered }) => (
        <RankedContentCard
          {...{ isFocused, isHovered }}
          href={
            playlistSlug ?
              $path('/playlist/:playlistSlug', { playlistSlug })
            : undefined
          }
          image={
            <ContentCardImage
              alt={playlist?.title ?? ''}
              decoding="auto"
              index={index}
              src={playlist?.urlImage || undefined}
              width={isMobile ? 75 : 150}
            />
          }
          imageButton={
            // We don't have enough information to know if the playlist is premium or not so we're hiding the play button for free users
            userIsPremium ?
              <Play.Playlist
                context={context}
                goToNowPlaying="onPlay"
                id={`${Number(playlist?.publishedUserId)}::${playlist?.publishedPlaylistId}`}
                name={playlist.title}
                onPress={itemSelectedCallback}
                playlistSlug={playlistSlug}
                shuffle={false}
                size={48}
                type={type}
              />
            : null
          }
          isActive={playing}
          linesForTitle={2}
          onNavigation={itemSelectedCallback}
          rank={index + 1}
          title={playlist?.title ?? ''}
        />
      )}
    </CardCarouselSlide>
  );
}

export const TopPlaylistsCarousel = ({
  sectionPosition,
}: {
  sectionPosition: number;
}) => {
  const { pageName } = useLoaderData<{ pageName: string }>();
  const [searchParams] = useSearchParams();

  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get(PLAYLIST_GENRE_KEY) ?? DEFAULT_PLAYLIST_GENRE,
  );

  const [selectedMood, setSelectedMood] = useState(
    searchParams.get(PLAYLIST_MOOD_KEY) ?? DEFAULT_PLAYLIST_MOOD,
  );

  const config = useConfig();

  const { data: playlists, isFetching } = useQueryRankersTopPlaylists({
    country: config.environment.countryCode,
    locale: config.environment.locale,
    genre: selectedGenre,
    mood: selectedMood,
  });

  if (isNullish(playlists)) {
    return null;
  }

  const { data, genre, genres, mood, moods } = playlists;

  const items = data
    .filter(isNonNullish)
    .map((item, index) => ({ ...item, index }));

  return (
    <CardCarousel
      isLoading={isFetching}
      items={items}
      key={`top_playlist_${selectedMood}_${selectedGenre}`}
      kind="ranker"
      title={
        <Flex
          alignItems="center"
          gap="$8"
          justifyContent={{ mobile: 'space-between', large: 'flex-start' }}
          paddingRight={{ small: '$8', pointerCoarse: '$0' }}
          width="100%"
        >
          {SECTION_TITLE ?
            <Text as="h3" kind={{ mobile: 'h4', large: 'h3' }}>
              {SECTION_TITLE}
            </Text>
          : null}
          <Flex gap="$4">
            <PlaylistMoodSelect
              currentPlaylistMood={mood ?? DEFAULT_PLAYLIST_MOOD}
              moods={moods}
              onSelectionChange={setSelectedMood}
              pageName={pageName}
              stateKey={BY_PLAYLIST_MOOD_STATE_KEY}
            />
            <PlaylistGenreSelect
              currentPlaylistGenre={genre ?? DEFAULT_PLAYLIST_GENRE}
              genres={genres}
              onSelectionChange={setSelectedGenre}
              pageName={pageName}
              stateKey={BY_PLAYLIST_GENRE_STATE_KEY}
            />
          </Flex>
        </Flex>
      }
    >
      {({ index, ...playlist }) => (
        <Slide
          index={index}
          key={playlist.publishedPlaylistId}
          pageName={pageName}
          playlist={playlist}
          sectionPosition={sectionPosition}
        />
      )}
    </CardCarousel>
  );
};
