import { SelectOption } from '@iheartradio/web.accomplice/components/select-field';
import { MediaServerURL } from '@iheartradio/web.assets';
import * as Playback from '@iheartradio/web.playback';
import { type Key, useCallback, useMemo, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { isString } from 'remeda';
import { isNonNullish, isNullish, toSnakeCase } from 'remeda';

import { trackClick } from '~app/analytics/track-click';
import { useItemSelected } from '~app/analytics/use-item-selected';
import { amp } from '~app/api/amp-client';
import {
  CardCarousel,
  CardCarouselSlide,
} from '~app/components/card-carousel/card-carousel';
import { CarouselSelect } from '~app/components/carousel-select/carousel-select';
import { ContentCardImage } from '~app/components/content-card/content-card';
import { RankedContentCard } from '~app/components/content-card/ranked-content-card';
import { useConfig } from '~app/contexts/config';
import { useIsMobile } from '~app/contexts/is-mobile';
import { Play } from '~app/playback/controls/play';
import type { RankersTopArtistsResponse } from '~app/queries/rankers-top-artists';
import {
  ARTIST_GENRE_KEY,
  DEFAULT_ARTIST_GENRE,
  useQueryRankersTopArtists,
} from '~app/queries/rankers-top-artists';
import {
  ANALYTICS_LOCATION,
  AnalyticsContext,
  DEFAULT_POPULAR_GENRES,
} from '~app/utilities/constants';
import { makeArtistSlug } from '~app/utilities/slugs/artist-slug';
import { buildArtistUrl } from '~app/utilities/urls';

export type TopArtists = RankersTopArtistsResponse;

export type TopArtist = Exclude<TopArtists, undefined>['data'][number];

export type ArtistGenres = TopArtists['genres'];

export type CurrentGenre = TopArtists['genre'];

type ArtistGenreSelectProps = {
  genres: ArtistGenres;
  onSelectionChange: (key: number) => void;
  pageName: string;
  selectedGenreKey: string;
  stateKey: string;
};

const ALL_GENRES = 'All Genres';

const BY_ARTIST_GENRE_STATE_KEY = 'byArtistGenre';

const SECTION_TITLE = 'Top Artist Radio';

export function ArtistGenresSelect({
  genres,
  onSelectionChange: selectionChange,
  selectedGenreKey,
  stateKey,
  pageName,
}: ArtistGenreSelectProps) {
  const [_searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const onSelectionChange = useCallback(
    (key: Key | null) => {
      if (isNullish(key)) return;

      if (isString(key) && key !== selectedGenreKey.toString()) {
        const filterSelection =
          genres.find(genre => genre.id === Number(key))?.genreName ||
          ALL_GENRES;

        trackClick({
          pageName,
          sectionName: toSnakeCase(SECTION_TITLE),
          filterType: 'genre',
          filterSelection,
          location: 'filter',
        });

        setSearchParams(
          params => {
            params.set(ARTIST_GENRE_KEY, key.toString());
            return params;
          },
          {
            replace: true,
            preventScrollReset: true,
            state: { stateKey },
          },
        );

        selectionChange(Number(key));
      }
    },
    [
      genres,
      pageName,
      selectedGenreKey,
      selectionChange,
      setSearchParams,
      stateKey,
    ],
  );

  return (
    <CarouselSelect
      aria-label="artist-genres"
      data-test="artist-genres"
      defaultSelectedKey={selectedGenreKey}
      isOpen={isOpen}
      items={[
        {
          key: DEFAULT_POPULAR_GENRES.toString(),
          label: 'All Genres',
          value: DEFAULT_POPULAR_GENRES.toString(),
        },
        ...Object.entries(genres).map(([_id, value]) => {
          return {
            key: value.id.toString(),
            label: value.genreName,
            value: value.id.toString(),
          };
        }),
      ]}
      key={selectedGenreKey.toString()}
      name="artistgenres"
      onBlur={() => setIsOpen(false)}
      onOpenChange={setIsOpen}
      onSelectionChange={onSelectionChange}
      sectionTitle={SECTION_TITLE}
    >
      {item => (
        <SelectOption key={item.key} textValue={item.label}>
          {item.label}
        </SelectOption>
      )}
    </CarouselSelect>
  );
}

function Slide({
  artist,
  index,
  pageName,
  sectionPosition,
}: {
  artist: TopArtist;
  index: number;
  pageName: string;
  sectionPosition: number;
}) {
  const { onItemSelected } = useItemSelected();
  const isMobile = useIsMobile();

  const context = useMemo(
    () => ({
      pageName,
      playedFrom: 1006,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
      sectionName: SECTION_TITLE,
    }),
    [pageName],
  );

  const { playing } = Play.useArtistPlay({
    id: Number(artist?.contentId),
    context,
  });

  const itemSelectedCallback = useCallback(() => {
    onItemSelected({
      pageName,
      section: 'top_artist_radio',
      context: AnalyticsContext.Carousel,
      itemPosition: index,
      sectionPosition,
      assets: {
        asset: {
          id: `${Playback.StationType.Artist}|${artist.contentId!}`,
          name: artist?.label ?? '',
        },
      },
    });
  }, [artist, index, onItemSelected, pageName, sectionPosition]);

  if (isNullish(artist) || isNullish(artist.contentId)) {
    return null;
  }

  const artistUrl = buildArtistUrl({
    id: artist.contentId!,
    name: artist.label ?? '',
  });

  return (
    <CardCarouselSlide>
      {({ isFocused, isHovered }) => (
        <RankedContentCard
          {...{ isFocused, isHovered }}
          description="& similar artists"
          href={artistUrl}
          image={
            <ContentCardImage
              alt={artist?.label ?? ''}
              decoding={index === 0 ? 'sync' : 'auto'}
              index={index}
              src={MediaServerURL.fromCatalog({
                type: 'artist',
                id: artist.contentId!,
              }).run('circle')}
              width={isMobile ? 70 : 140}
            />
          }
          imageButton={
            <Play.Artist
              artistSlug={
                isNonNullish(artist.contentId) ?
                  makeArtistSlug(artist.label, artist.contentId)
                : undefined
              }
              context={context}
              goToNowPlaying="onPlay"
              id={artist.contentId!}
              name={artist.label}
              onPress={itemSelectedCallback}
              size={48}
            />
          }
          isActive={playing}
          linesForTitle={2}
          onNavigation={itemSelectedCallback}
          previewShape="circle"
          rank={index + 1}
          title={artist?.label ?? ''}
        />
      )}
    </CardCarouselSlide>
  );
}

export function TopArtistsCarousel({
  sectionPosition,
}: {
  sectionPosition: number;
}) {
  const { pageName } = useLoaderData<{ pageName: string }>();
  const [searchParams] = useSearchParams();

  const [selectedGenre, setSelectedGenre] = useState(
    Number(searchParams.get(ARTIST_GENRE_KEY) ?? DEFAULT_ARTIST_GENRE),
  );

  const config = useConfig();

  const { data: artists, isFetching } = useQueryRankersTopArtists({
    amp,
    country: config.environment.countryCode,
    locale: config.environment.locale,
    genre: selectedGenre,
  });

  if (isNullish(artists) || isNullish(artists.genres)) {
    return null;
  }

  const items = artists.data.map((item, index) => ({
    item,
    id: item.contentId,
    index,
  }));

  return (
    <CardCarousel
      isLoading={isFetching}
      items={items}
      kind="ranker"
      title={
        <ArtistGenresSelect
          genres={artists.genres}
          onSelectionChange={setSelectedGenre}
          pageName={pageName}
          selectedGenreKey={artists.genre.toString()}
          stateKey={BY_ARTIST_GENRE_STATE_KEY}
        />
      }
    >
      {({ index, item: artist }) => (
        <Slide
          artist={artist}
          index={index}
          pageName={pageName}
          sectionPosition={sectionPosition}
        />
      )}
    </CardCarousel>
  );
}
