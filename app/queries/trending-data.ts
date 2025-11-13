import type { WebAPIClient } from '@iheartradio/web.api/webapi';
import { type CountryCode, countryCodesEnum } from '@iheartradio/web.config';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNullish } from 'remeda';

import { useWebApiClient } from '~app/api/webapi-client';
import { logger } from '~app/utilities/logger';

export type TrendingData = {
  title: string;
  image: string;
  link: string;
};

export type TrendingDataParameters = {
  time?: ServerTimingFunction;
  country?: CountryCode;
  locale?: string;
};

export const TRENDING_DATA_KEY = 'trending-data';

export async function getTrendingData({
  time,
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  webapiClient,
  signal,
}: TrendingDataParameters & {
  webapiClient: WebAPIClient;
  signal: AbortSignal;
}): Promise<TrendingData[]> {
  const fetchTrendingData = async () => {
    try {
      const response = await webapiClient.request(
        webapiClient.queries.trending({
          tags: [`countries/${country}`, `locales/${locale}`],
        }),
        { signal },
      );

      const content = response?.pubsub?.query?.items[0]?.content;

      if (content?.__typename === 'PubsubContentTrendingPayloadSelection') {
        const trendingData = content.data?.trending;

        if (isNullish(trendingData)) {
          throw new Error('"trending" is undefined.');
        }

        const data = trendingData?.map(trending => {
          const { title, image, link } = trending;

          return {
            title,
            image: image.public_uri ?? '',
            link: link ?? '',
          };
        });

        return data;
      } else {
        return [];
      }
    } catch (error: any) {
      logger.error(error?.message, { error });

      return [];
    }
  };

  if (time === undefined) {
    return fetchTrendingData();
  }

  return time(TRENDING_DATA_KEY, fetchTrendingData);
}

export async function prefetchTrendingData({
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  queryClient,
  time,
  webapiClient,
  signal,
}: TrendingDataParameters & {
  country?: CountryCode;
  locale?: string;
  queryClient: QueryClient;
  webapiClient: WebAPIClient;
  signal: AbortSignal;
}) {
  await queryClient.prefetchQuery({
    queryKey: [country, locale, TRENDING_DATA_KEY],
    queryFn: () =>
      getTrendingData({ time, country, locale, webapiClient, signal }),
    staleTime: ms('30m'),
  });
}

export function useQueryTrendingData({
  country = countryCodesEnum.Enum.US,
  locale = 'en-US',
  time,
}: TrendingDataParameters & {
  country?: CountryCode;
  locale?: string;
}): UseQueryResult<TrendingData[], Error> {
  const webapiClient = useWebApiClient();
  return useQuery({
    placeholderData: previousData => previousData,
    queryKey: [country, locale, TRENDING_DATA_KEY],
    queryFn: ({ signal }) =>
      getTrendingData({ time, country, locale, webapiClient, signal }),
    staleTime: ms('30m'),
  });
}
