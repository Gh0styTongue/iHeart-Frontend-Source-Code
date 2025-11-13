import type {
  ampContract,
  ClientInferResponseBody,
} from '@iheartradio/web.api/amp';
import type { WebApi, WebAPIClient } from '@iheartradio/web.api/webapi';
import { type CountryCode, countryCodesEnum } from '@iheartradio/web.config';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNonNullish } from 'remeda';

import { type AmpClient, useAmpClient } from '~app/api/amp-client';
import { getCardId } from '~app/api/utilities';
import { useWebApiClient } from '~app/api/webapi-client';
import { logger } from '~app/utilities/logger';

import { getPodcastCategories } from './podcast';

export type RankersTopPodcastsParameters = {
  country?: CountryCode;
  locale?: string;
  time?: ServerTimingFunction;
  category?: string;
};

export type PopularPodcast = ClientInferResponseBody<
  typeof ampContract.v3.podcast.getPodcastCategory
>['podcasts'][number];

export type RankersTopPodcastData = Pick<
  PopularPodcast,
  'id' | 'imageUrl' | 'slug' | 'subtitle' | 'title'
>;

export type RankersTopPodcastsResponse = {
  data: RankersTopPodcastData[];
  category: RankersTopPodcastsParameters['category'];
  categories: WebApi.PodcastTopicsQuery['podcast_topics'];
};

export const DEFAULT_CATEGORY = 'all';
export const PODCAST_CATEGORY_KEY = 'podcast-category';
export const RANKERS_TOP_PODCASTS_KEY = 'rankers-top-podcasts';

export async function getRankersTopPodcasts({
  amp,
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  signal,
  time,
  category = DEFAULT_CATEGORY,
  webapiClient,
}: RankersTopPodcastsParameters & {
  signal: AbortSignal;
  webapiClient: WebAPIClient;
  amp: AmpClient;
}): Promise<RankersTopPodcastsResponse> {
  const fetchRankersTopPodcasts = async () => {
    try {
      const categories = await getPodcastCategories({
        country,
        locale,
        signal,
        time,
        webapiClient,
      });

      const id = getCardId(
        categories?.find(item => {
          const podcastId = getCardId(item);
          return podcastId && Number(podcastId) === Number(category);
        }),
      );

      if (isNonNullish(id) && id !== DEFAULT_CATEGORY) {
        const response = await amp.api.v3.podcast.getPodcastCategory({
          params: { id },
          query: { limit: 10 },
        });

        const data =
          response?.body.podcasts.map<RankersTopPodcastData>(podcast => ({
            id: podcast.id,
            imageUrl: podcast.imageUrl,
            slug: podcast.slug,
            subtitle: podcast.subtitle,
            title: podcast.title,
          })) ?? [];

        const payload = {
          data,
          category: id,
          categories,
        };

        return payload;
      } else {
        const response = await webapiClient.request(
          webapiClient.queries.leads({
            locale,
            query: {
              subscription: [
                {
                  tags: [
                    'collections/popular-podcasts',
                    `countries/${country}`,
                  ],
                },
              ],
            },
          }),
        );

        const data = response.leads.reduce<RankersTopPodcastsResponse['data']>(
          (accumulator, podcast) => {
            if (podcast?.catalog?.id) {
              const podcastUrl =
                podcast.link?.urls?.web && URL.canParse(podcast.link.urls.web) ?
                  new URL(podcast.link.urls.web).pathname
                : undefined;

              const slug =
                podcastUrl ?
                  podcastUrl
                    .split('/')
                    .filter(val => val !== '')
                    .at(-1)
                    ?.replace(`-${podcast.catalog.id}`, '')
                : undefined;

              return [
                ...accumulator,
                {
                  id: Number(podcast.catalog?.id) || 0,
                  imageUrl: podcast.img_uri ?? '',
                  slug: slug ?? '',
                  subtitle: podcast.subtitle ?? '',
                  title: podcast.title ?? '',
                },
              ];
            }

            return accumulator;
          },
          [],
        );

        const payload = {
          data: data.slice(0, 10),
          category: DEFAULT_CATEGORY,
          categories,
        };

        return payload;
      }
    } catch (error: any) {
      logger.error(error?.message, { error });

      const payload = {
        data: [],
        category: DEFAULT_CATEGORY,
        categories: [],
      };

      return payload;
    }
  };

  if (time === undefined) {
    return fetchRankersTopPodcasts();
  }

  return time(RANKERS_TOP_PODCASTS_KEY, fetchRankersTopPodcasts);
}

export async function prefetchRankersTopPodcasts({
  amp,
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  queryClient,
  category = DEFAULT_CATEGORY,
  signal,
  time,
  webapiClient,
}: RankersTopPodcastsParameters & {
  signal: AbortSignal;
  queryClient: QueryClient;
  webapiClient: WebAPIClient;
  amp: AmpClient;
}) {
  await queryClient.prefetchQuery({
    queryKey: [country, locale, RANKERS_TOP_PODCASTS_KEY, category],
    queryFn: () =>
      getRankersTopPodcasts({
        amp,
        country,
        locale,
        category,
        signal,
        time,
        webapiClient,
      }),
    staleTime: ms('30m'),
  });
}

export function useQueryRankersTopPodcasts({
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  category = DEFAULT_CATEGORY,
  time,
}: RankersTopPodcastsParameters): UseQueryResult<
  RankersTopPodcastsResponse,
  Error
> {
  const webapiClient = useWebApiClient();
  const amp = useAmpClient();
  return useQuery({
    placeholderData: previousData => previousData,
    queryKey: [country, locale, RANKERS_TOP_PODCASTS_KEY, category],
    queryFn: ({ signal }) =>
      getRankersTopPodcasts({
        amp,
        country,
        locale,
        category,
        signal,
        time,
        webapiClient,
      }),
    staleTime: ms('30m'),
  });
}
