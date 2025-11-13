import type {
  HomepageBannerData,
  WebAPIClient,
} from '@iheartradio/web.api/webapi';
import type { ServerTimingFunction } from '@iheartradio/web.server-timing';
import type { QueryClient, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import { isNonNullish, isNullish } from 'remeda';

import { useWebApiClient } from '~app/api/webapi-client';
import { logger } from '~app/utilities/logger';

type HomepageBannerResponse = Exclude<HomepageBannerData, 'fields'>;
type HomepageBannerFields = HomepageBannerData['fields'];

export const DefaultHomepageBannerCountryFacet = 'countries/US';

const marketingBannerKeys = {
  all: ['marketingBanner'] as const,
  homepage: (countryFacet: string) =>
    [...marketingBannerKeys.all, countryFacet] as const,
} as const;

export const getHomepageBanner = async ({
  country,
  webapiClient,
  signal,
  time,
}: {
  country: string;
  webapiClient: WebAPIClient;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}): Promise<HomepageBannerFields> => {
  const fetchHomepageBanner = async () => {
    try {
      const variables = {
        query: {
          limit: 1,
          subscription: [
            {
              tags: [country, 'collections/web-homescreen'],
            },
          ],
        },
      };

      const response = (await webapiClient.request(
        webapiClient.queries.homepageBanner(variables),
        { signal },
      )) as HomepageBannerResponse;

      const { fields } = (response.pubsub.query?.items[0]?.content as any).data;

      if (isNullish(fields)) {
        throw new Error('marketing fields is undefined.');
      }

      return fields as HomepageBannerFields;
    } catch (error: any) {
      logger.error(error?.message, { error });
      return {} as HomepageBannerFields;
    }
  };

  return isNonNullish(time) ?
      time('homepage-marketing-banner', fetchHomepageBanner)
    : fetchHomepageBanner();
};

export async function prefetchMarketingBanner({
  country = DefaultHomepageBannerCountryFacet,
  queryClient,
  webapiClient,
  signal,
  time,
}: {
  country?: string;
  queryClient: QueryClient;
  webapiClient: WebAPIClient;
  signal: AbortSignal;
  time?: ServerTimingFunction;
}) {
  await queryClient.prefetchQuery({
    queryKey: marketingBannerKeys.homepage(country),
    queryFn: () => getHomepageBanner({ country, webapiClient, signal, time }),
    staleTime: ms('30m'),
  });
}

export function useQueryMarketingBanner({
  country = DefaultHomepageBannerCountryFacet,
}: {
  country?: string;
}): UseQueryResult<HomepageBannerFields, Error> {
  const webapiClient = useWebApiClient();
  return useQuery({
    placeholderData: previousData => previousData,
    queryKey: marketingBannerKeys.homepage(country),
    queryFn: ({ signal }) =>
      getHomepageBanner({ country, webapiClient, signal }),
    staleTime: ms('30m'),
  });
}
