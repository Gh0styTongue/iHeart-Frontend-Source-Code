import type { DefaultSelectOption } from '@iheartradio/web.accomplice/components/select-field';
import { SelectOption } from '@iheartradio/web.accomplice/components/select-field';
import { MediaServerURL } from '@iheartradio/web.assets';
import { StationType } from '@iheartradio/web.playback';
import { type Key, useCallback, useMemo, useState } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import { isString } from 'remeda';
import { isNonNullish, isNullish, toSnakeCase } from 'remeda';

import { trackClick } from '~app/analytics/track-click';
import { useItemSelected } from '~app/analytics/use-item-selected';
import { getCardId } from '~app/api/utilities';
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
import type { RankersTopPodcastsResponse } from '~app/queries/rankers-top-podcasts';
import {
  DEFAULT_CATEGORY,
  PODCAST_CATEGORY_KEY,
  useQueryRankersTopPodcasts,
} from '~app/queries/rankers-top-podcasts';
import { ANALYTICS_LOCATION, AnalyticsContext } from '~app/utilities/constants';
import { makePodcastSlug } from '~app/utilities/slugs/get-podcast-profile-slug';
import { buildPodcastUrl } from '~app/utilities/urls';

export type TopPodcasts = RankersTopPodcastsResponse;

export type TopPodcast = RankersTopPodcastsResponse['data'][number];

type PodcastCategorySelectProps = {
  onSelectionChange: (key: string) => void;
  pageName: string;
  selectedCategory: TopPodcasts['category'];
  stateKey: string;
  categories: TopPodcasts['categories'];
};

const ALL_CATEGORIES = 'All Categories';

const BY_CATEGORIES_STATE_KEY = 'by-category';

const SECTION_TITLE = 'Top Podcasts';

export function PodcastCategorySelect({
  onSelectionChange: selectionChange,
  pageName,
  selectedCategory,
  stateKey,
  categories,
}: PodcastCategorySelectProps) {
  const [_searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const onSelectionChange = useCallback(
    (key: Key | null) => {
      if (isNullish(key)) return;

      if (isString(key) && key !== selectedCategory?.toString()) {
        const filterSelection =
          categories.find(cat => getCardId(cat) === key)?.title ||
          ALL_CATEGORIES;

        trackClick({
          pageName,
          sectionName: toSnakeCase(SECTION_TITLE),
          filterType: 'category',
          filterSelection,
          location: 'filter',
        });

        setSearchParams(
          params => {
            params.set(PODCAST_CATEGORY_KEY, key.toString());
            return params;
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
      pageName,
      selectedCategory,
      selectionChange,
      setSearchParams,
      stateKey,
      categories,
    ],
  );

  return (
    <CarouselSelect
      aria-label="podcast-categories"
      data-test="podcast-categories"
      defaultSelectedKey={selectedCategory}
      isOpen={isOpen}
      items={[
        {
          key: DEFAULT_CATEGORY,
          label: 'All Categories',
          value: DEFAULT_CATEGORY,
        },
        ...categories.reduce<DefaultSelectOption[]>((result, category) => {
          const categoryId = getCardId(category);

          if (!isNullish(categoryId) && !isNullish(category.title)) {
            result.push({
              key: categoryId,
              label: category.title,
              value: categoryId,
            });
          }

          return result;
        }, []),
      ]}
      key={selectedCategory?.toString()}
      name="podcastCategories"
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
  pageName,
  podcast,
  index,
  sectionPosition,
}: {
  pageName: string;
  podcast: TopPodcast;
  index: number;
  sectionPosition: number;
}) {
  const { onItemSelected } = useItemSelected();
  const isMobile = useIsMobile();

  const context = useMemo(
    () => ({
      pageName,
      playedFrom: 1004,
      eventLocation: ANALYTICS_LOCATION.CAROUSEL,
      sectionName: SECTION_TITLE,
    }),
    [pageName],
  );

  const { playing } = Play.usePodcastPlay({
    id: Number(podcast?.id),
    context,
  });

  const podcastUrl = buildPodcastUrl({
    podcastId: Number(podcast?.id),
    slug: podcast && 'slug' in podcast ? podcast.slug : '',
  });

  const itemSelectedCallback = useCallback(() => {
    onItemSelected({
      pageName,
      section: 'top_podcasts',
      context: AnalyticsContext.Carousel,
      itemPosition: index,
      sectionPosition,
      assets: {
        asset: {
          id: `${StationType.Podcast}|${podcast?.id}`,
          name: podcast?.title ?? '',
          type: StationType.Podcast,
        },
      },
    });
  }, [pageName, podcast, index, onItemSelected, sectionPosition]);

  return podcast.id ?
      <CardCarouselSlide>
        {({ isFocused, isHovered }) => (
          <RankedContentCard
            {...{ isFocused, isHovered }}
            href={podcastUrl}
            image={
              <ContentCardImage
                alt={podcast?.title ?? ''}
                css={{ boxShadow: '$elevation1' }}
                decoding={index === 0 ? 'sync' : 'auto'}
                index={index}
                src={MediaServerURL.fromCatalog({
                  type: 'podcast',
                  id: podcast.id,
                })}
                width={isMobile ? 70 : 140}
              />
            }
            imageButton={
              <Play.Podcast
                context={context}
                goToNowPlaying="onPlay"
                id={Number(podcast?.id)}
                name={podcast?.title ?? ''}
                onPress={itemSelectedCallback}
                podcastSlug={makePodcastSlug(podcast.slug, podcast.id)}
                size={48}
              />
            }
            isActive={playing}
            linesForTitle={2}
            onNavigation={itemSelectedCallback}
            rank={index + 1}
            title={podcast?.title ?? ''}
          />
        )}
      </CardCarouselSlide>
    : null;
}

export const TopPodcastsCarousel = ({
  sectionPosition,
}: {
  sectionPosition: number;
}) => {
  const { pageName } = useLoaderData<{ pageName: string }>();
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get(PODCAST_CATEGORY_KEY) ?? DEFAULT_CATEGORY,
  );
  const config = useConfig();

  const { data: podcasts, isFetching } = useQueryRankersTopPodcasts({
    country: config.environment.countryCode,
    locale: config.environment.locale,
    category: selectedCategory,
  });

  if (isNullish(podcasts) || isNullish(podcasts.categories)) {
    return null;
  }

  const items = podcasts.data
    .filter(podcast => isNonNullish(podcast))
    .map((item, index) => ({ podcast: item, id: item.id, index }));

  return (
    <CardCarousel
      isLoading={isFetching}
      items={items}
      kind="ranker"
      title={
        <PodcastCategorySelect
          categories={podcasts.categories}
          onSelectionChange={setSelectedCategory}
          pageName={pageName}
          selectedCategory={selectedCategory}
          stateKey={BY_CATEGORIES_STATE_KEY}
        />
      }
    >
      {({ index, podcast }) => (
        <Slide
          index={index}
          key={podcast.id}
          pageName={pageName}
          podcast={podcast}
          sectionPosition={sectionPosition}
        />
      )}
    </CardCarousel>
  );
};
