import type { AmpClient } from '@iheartradio/web.api/amp';
import type { WebApi, WebAPIClient } from '@iheartradio/web.api/webapi';
import type { CountryCode } from '@iheartradio/web.config';
import { countryCodesEnum } from '@iheartradio/web.config';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import { slugify } from '@iheartradio/web.utilities/string/slugify';
import type { QueryClient, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNonNullish, prop } from 'remeda';
import { z } from 'zod';

import { useWebApiClient } from '~app/api/webapi-client';
import { podcastKeys } from '~app/queries/podcast/constants';

export type PodcastCategories = WebApi.PodcastTopicsQuery['podcast_topics'];

export type PodcastCategoriesParameters = {
  country: CountryCode;
  locale: string;
  time?: ServerTimingFunction;
};

export const PodcastCategorySchema = z.object({
  id: z.string(),
  catalog: z
    .object({
      id: z.string(),
    })
    .optional()
    .nullable(),
  title: z.string(),
  subtitle: z.string(),
  img_uri: z.string(),
  link: z.object({
    urls: z.object({
      web: z.string(),
      device: z.string(),
    }),
  }),
});

export type PodcastCategory = z.infer<typeof PodcastCategorySchema>;

export async function getPodcastCategoriesWebAPI({
  country,
  locale,
  time,
  webapiClient,
  signal,
}: PodcastCategoriesParameters & {
  webapiClient: WebAPIClient;
  signal: AbortSignal;
}): Promise<PodcastCategory[]> {
  const fetchPodcastCategoriesWebAPI = async () =>
    await webapiClient
      .request(
        webapiClient.queries.podcastTopics({
          countryCode: country,
          locale,
        }),
        { signal },
      )
      .then(prop('podcast_topics'))
      .then(podcastTopics =>
        podcastTopics.reduce((accumulator, category) => {
          const categoryResult = PodcastCategorySchema.safeParse(category);
          if (categoryResult.success) {
            accumulator.push(categoryResult.data);
          }
          return accumulator;
        }, [] as PodcastCategory[]),
      );

  return isNonNullish(time) ?
      time('podcast-categories', fetchPodcastCategoriesWebAPI)
    : fetchPodcastCategoriesWebAPI();
}

export async function getPodcastCategoriesAMP({
  amp,
  time,
  signal,
}: {
  amp: AmpClient;
  signal?: AbortSignal;
  time?: ServerTimingFunction;
}): Promise<PodcastCategory[]> {
  const fetchPodcastCategoriesAMP = async () =>
    amp.api.v3.podcast
      .getPodcastCategories({ fetchOptions: { signal } })
      .then(prop('body'))
      .then(prop('categories'))
      .then(categories =>
        categories.map(transformAmpCategory).filter(isNonNullish),
      );

  return isNonNullish(time) ?
      time('podcast-categories-amp', fetchPodcastCategoriesAMP)
    : fetchPodcastCategoriesAMP();
}

export async function prefetchPodcastCategoriesWebAPI({
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  queryClient,
  signal,
  time,
  webapiClient,
}: PodcastCategoriesParameters & {
  queryClient: QueryClient;
  webapiClient: WebAPIClient;
  signal: AbortSignal;
}) {
  await queryClient.prefetchQuery({
    queryKey: podcastKeys.categoriesWebAPI(country, locale),
    queryFn: () =>
      getPodcastCategoriesWebAPI({
        country,
        locale,
        time,
        webapiClient,
        signal,
      }),
    staleTime: ms('30m'),
  });
}

export async function prefetchPodcastCategoriesAMP({
  amp,
  queryClient,
  time,
}: {
  amp: AmpClient;
  time?: ServerTimingFunction;
  queryClient: QueryClient;
}) {
  await queryClient.prefetchQuery({
    queryKey: podcastKeys.categoriesAMP(),
    queryFn: ({ signal }) => getPodcastCategoriesAMP({ amp, time, signal }),
    staleTime: ms('30m'),
  });
}

export function useQueryPodcastCategoriesWebAPI({
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  time,
}: PodcastCategoriesParameters): UseQueryResult<PodcastCategory[], Error> {
  const webapiClient = useWebApiClient();
  return useQuery({
    placeholderData: previousData => previousData,
    queryKey: podcastKeys.categoriesWebAPI(country, locale),
    queryFn: ({ signal }) =>
      getPodcastCategoriesWebAPI({
        country,
        locale,
        time,
        webapiClient,
        signal,
      }),
    staleTime: ms('30m'),
  });
}

export function useQueryPodcastCategoriesAMP({ amp }: { amp: AmpClient }) {
  return useQuery({
    queryKey: podcastKeys.categoriesAMP(),
    queryFn: ({ signal }) => getPodcastCategoriesAMP({ amp, signal }),
    staleTime: ms('30m'),
  });
}

export async function getQueryDataPodcastCategoriesWebAPI({
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  queryClient,
  time,
  webapiClient,
  signal,
}: PodcastCategoriesParameters & {
  queryClient: QueryClient;
  webapiClient: WebAPIClient;
  signal: AbortSignal;
}) {
  return queryClient.ensureQueryData({
    queryKey: podcastKeys.categoriesWebAPI(country, locale),
    queryFn: () =>
      getPodcastCategoriesWebAPI({
        country,
        locale,
        signal,
        time,
        webapiClient,
      }),
    staleTime: ms('30m'),
  });
}

export async function getQueryDataPodcastCategoriesAMP({
  queryClient,
  amp,
  signal,
  time,
}: {
  queryClient: QueryClient;
  amp: AmpClient;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}) {
  return queryClient.ensureQueryData({
    queryKey: podcastKeys.categoriesAMP(),
    queryFn: () => getPodcastCategoriesAMP({ amp, time, signal }),
    staleTime: ms('30m'),
  });
}

/**
 *
 * @param ampCategory Podcast Category from AMP
 * @returns a category object shaped like WebAPI podcast category
 */
export function transformAmpCategory(ampCategory?: {
  id: number;
  name: string;
  image: string;
}): PodcastCategory | undefined {
  if (isNonNullish(ampCategory)) {
    const parsedCategory = PodcastCategorySchema.safeParse({
      id: String(ampCategory.id),
      title: ampCategory.name,
      subtitle: '',
      img_uri: ampCategory.image,
      link: {
        urls: {
          web: `https://www.iheart.com/podcast/category/${slugify(ampCategory.name)}-${ampCategory.id}`,
          device: `ihr://goto/podcast/category/${ampCategory.id}`,
        },
      },
    });
    return parsedCategory.success ? parsedCategory.data : undefined;
  } else {
    return undefined;
  }
}
